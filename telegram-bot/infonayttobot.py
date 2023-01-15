# -*- coding: utf-8 -*-

"""
Simple Telegram bot to bridge messages to a channel and to the info screen.
See README.md for more details. See also config.py and tgpost.html.
"""

from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, MessageHandler, CallbackQueryHandler, Filters
import logging
import os
import time
from pprint import pformat
import json
import config

# set up logging
logging.basicConfig(format='%(asctime)s - %(filename)s:%(lineno)d - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

bot_token = config.bot_token
assert bot_token, "Bot token missing"

output_filename = config.output_filename
assert output_filename.endswith("json")

public_channel_id = config.public_channel_id
assert abs(public_channel_id) > 1, "Public channel ID missing."

admin_username = config.admin_username
assert admin_username, "Please provide the user name of an admin."

group_chats_to_follow = config.group_chats_to_follow

def update_output_file(msg):
  # update latest_message_id to external json file for group chats
  # msg should be a telegram.Message object

  chat = msg.chat
  assert chat.type in ["group", "supergroup", "channel"], "update_output_file() called for incorrect chat type {} (chat ID {})".format(chat.type, chat.id)

  assert chat.username is not None, "update_output_file() called for non-public chat {} ({})".format(chat.id, chat.title)

  try:
    output_data = None
    try:
      with open(output_filename) as f:
        contents = f.read().strip()
        if not contents:
          contents = "{}"
        output_data = json.loads(contents)

    except IOError:
      # file was not found, we will create it
      output_data = {}

      #TODO: catch JSON decode errors due to corrupt file and start with fresh one or something


    assert chat.id in group_chats_to_follow or chat.id == public_channel_id, "update_output_file() called for invalid chat {} ({}) ".format(chat.id, chat.title)

    # use chat.username as key
    output_data[chat.username] = {
        "chat_id": chat.id,
        "title": chat.title,
        "latest_message_id": msg.message_id,
        "username": chat.username,
        "date": int(msg.date.timestamp()),
        }

    #logger.info(pformat(output_data[chat.username))

    with open(output_filename, "w+t") as f:
      f.write(json.dumps(output_data, indent = 4))

  except (IOError, ValueError) as e:

    print("Error with file {}:".format(output_filename))
    print(e)
    raise

def send_help_message(update, context):
  #NOTE: apply these for all callback functions when python-telegram-bot 0.12 is released:
  # change args from (bot, update) to (update, context)
  # bot = context.bot
  # see https://github.com/python-telegram-bot/python-telegram-bot/wiki/Transition-guide-to-Version-12.0#context-based-callbacks

  help_message = """
Tälle botille lähetetyt yksityisviestit lähetetään eteenpäin julkiselle kanavalle, joka on näkyvillä kiltiksen infonäytöllä. Halutessasi viesti lähetätään anonyyminä.

Jos jokin on pielessä tai sinulla on kehitysehdotus, ota yhteyttä ylläpitäjään @{}.


Private messages sent to this bot will be forwarded to a public channel, which is visible on the guild room info screen. If you want, your message will be sent anonymously.

If something is broken or you have feedback, contact the administrator @{}.
""".format(admin_username, admin_username)

  #logger.info(pformat(update.effective_message.to_dict()))
  context.bot.send_message(update.effective_message.chat.id, help_message.strip())

def handle_group_message(update, context):

  msg = update.effective_message
  chat = msg.chat

  #logger.info(pformat(msg.to_dict()))
  #logger.info(pformat(chat.to_dict()) + "\n")

  if chat.id not in group_chats_to_follow:
    logger.warning("bot received message from group chat with ID {} ({}) but is not configured to follow it".format(chat.id, chat.title))
    return

  if chat.username is None:
    logger.warning("chat {} ({}) is not a public group".format(chat.id, chat.title))
    return

  update_output_file(msg)


def handle_private_message(update, context):
  """
  Ask the user whether to forward their message to the public channel anonymously.
  """

  keyboard = [[InlineKeyboardButton("Kyllä / Yes", callback_data = "1"),
               InlineKeyboardButton("Ei / No", callback_data = "0")]]

  markup = InlineKeyboardMarkup(keyboard)

  context.user_data["msg"] = update.effective_message

  update.message.reply_text("Haluatko lähettää viestin anonyyminä?\nDo you want your message to be anonymous?", reply_markup = markup)

def on_anonymity_choice(update, context):
  """
  This gets called when the user clicks on the button specifying whether to
  send the message to the public channel as anonymous.
  The message that will be forwarded is in user_data["msg"].
  """

  query = update.callback_query
  msg = context.user_data["msg"]

  del context.user_data["msg"]

  #logger.info(query.data)
  #logger.info("type(query.data):" + str(type(query.data)))
  #logger.info(pformat(user_data["msg"].to_dict()))

  if int(query.data) == 1:
    bot = context.bot

    # send anonymously, strip data from message
    if msg.text:
      ret = bot.send_message(public_channel_id, msg.text)
    elif msg.sticker:
      ret = bot.send_sticker(public_channel_id, msg.sticker.file_id)
    elif msg.photo:
      ret = bot.send_photo(public_channel_id, msg.photo[0].file_id, msg.caption)
    elif msg.video:
      ret = bot.send_video(public_channel_id, msg.video.file_id, msg.caption)
    elif msg.video_note:
      ret = bot.send_video_note(public_channel_id, msg.video_note.file_id)
    elif msg.document:
      ret = bot.send_document(public_channel_id, msg.document.file_id)
    elif msg.voice:
      ret = bot.send_voice(public_channel_id, msg.voice.file_id)
    elif msg.audio:
      ret = bot.send_audio(public_channel_id, msg.audio.file_id)
    elif msg.location:
      ret = bot.send_location(public_channel_id, location = msg.location)
    else:
      ret = bot.send_message(msg.chat.id, "Tiedostomuoto ei ole tuettu / unsupported message type :(")

  else:
    ret = msg.forward(public_channel_id)

  update_output_file(ret)

  query.edit_message_text("Viesti lähetettiin onnistuneesti. The message was sent successfully.")
  #channel = "@" + ret.channel.username
  #query.edit_message_text("Viesti lähetettiin onnistuneesti kanavalle {}. The message was sent successfully to the channel {}.".format(channel, channel))

def handle_error(bot, update, error):
  logger.warning(error)

def main():

  pwd = os.path.dirname(os.path.abspath(__file__))
  print("changing working directory to {}".format(pwd))
  os.chdir(pwd)

  # based on echobot2 example
  updater = Updater(bot_token)
  dp = updater.dispatcher
  dp.add_handler(CommandHandler("start", send_help_message, filters = Filters.private))
  dp.add_handler(CommandHandler("help", send_help_message, filters = Filters.private))
  dp.add_handler(MessageHandler(Filters.private, handle_private_message))
  dp.add_handler(CallbackQueryHandler(on_anonymity_choice))
  #TODO: catch channel messages (possible with python-telegram-bot?)
  dp.add_handler(MessageHandler(Filters.group, handle_group_message))
  dp.add_error_handler(handle_error)

  updater.start_polling()

  logger.info("Listening...")
  updater.idle()

if __name__ == "__main__":
  main()
