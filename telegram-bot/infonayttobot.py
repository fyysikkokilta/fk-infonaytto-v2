# -*- coding: utf-8 -*-

"""
Simple Telegram bot to bridge messages to a channel and to the info screen.
See README.md for more details. Environment variables are used for configuration.
"""

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters,
)
import logging
import json
import os

# set up logging
logging.basicConfig(
    format="%(asctime)s - %(filename)s:%(lineno)d - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# Load configuration from environment variables
bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
assert bot_token, "TELEGRAM_BOT_TOKEN environment variable is required"

output_filename = os.getenv("OUTPUT_FILENAME", "./update.json")
assert output_filename.endswith("json"), "Output filename must end with .json"

public_channel_id = os.getenv("TELEGRAM_PUBLIC_CHANNEL_ID")
assert public_channel_id, "TELEGRAM_PUBLIC_CHANNEL_ID environment variable is required"
try:
    public_channel_id = int(public_channel_id)
except ValueError:
    raise ValueError("TELEGRAM_PUBLIC_CHANNEL_ID must be a valid integer")
assert abs(public_channel_id) > 1, "Public channel ID must be a valid chat ID"

admin_username = os.getenv("TELEGRAM_ADMIN_USERNAME")
assert admin_username, "TELEGRAM_ADMIN_USERNAME environment variable is required"

# Parse group chats to follow from environment variable
group_chats_env = os.getenv("TELEGRAM_GROUP_CHATS_TO_FOLLOW", "")
group_chats_to_follow = []
if group_chats_env.strip():
    try:
        # Support comma-separated list of chat IDs
        group_chats_to_follow = [
            int(chat_id.strip())
            for chat_id in group_chats_env.split(",")
            if chat_id.strip()
        ]
    except ValueError:
        raise ValueError(
            "TELEGRAM_GROUP_CHATS_TO_FOLLOW must be a comma-separated list of integers"
        )

logger.info(f"Bot configured with {len(group_chats_to_follow)} group chats to follow")


def update_output_file(msg):
    # update latest_message_id to external json file for group chats
    # msg should be a telegram.Message object

    chat = msg.chat
    assert chat.type in [
        "group",
        "supergroup",
        "channel",
    ], "update_output_file() called for incorrect chat type {} (chat ID {})".format(
        chat.type, chat.id
    )

    assert (
        chat.username is not None
    ), "update_output_file() called for non-public chat {} ({})".format(
        chat.id, chat.title
    )

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

            # TODO: catch JSON decode errors due to corrupt file and start with fresh one or something

        assert (
            chat.id in group_chats_to_follow or chat.id == public_channel_id
        ), "update_output_file() called for invalid chat {} ({}) ".format(
            chat.id, chat.title
        )

        # use chat.username as key
        output_data[chat.username] = {
            "chat_id": chat.id,
            "title": chat.title,
            "latest_message_id": msg.message_id,
            "username": chat.username,
            "date": int(msg.date.timestamp()),
        }

        # logger.info(pformat(output_data[chat.username))

        with open(output_filename, "w+t") as f:
            f.write(json.dumps(output_data, indent=4))

    except (IOError, ValueError) as e:

        print("Error with file {}:".format(output_filename))
        print(e)
        raise


async def send_help_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_message = f"""
Tälle botille lähetetyt yksityisviestit lähetetään eteenpäin julkiselle kanavalle, joka on näkyvillä kiltiksen infonäytöllä. Halutessasi viesti lähetätään anonyyminä.

Jos jokin on pielessä tai sinulla on kehitysehdotus, ota yhteyttä ylläpitäjään @{admin_username}.


Private messages sent to this bot will be forwarded to a public channel, which is visible on the guild room info screen. If you want, your message will be sent anonymously.

If something is broken or you have feedback, contact the administrator @{admin_username}.
"""
    await context.bot.send_message(
        update.effective_message.chat.id, help_message.strip()
    )


async def handle_group_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = update.effective_message
    chat = msg.chat

    if chat.id not in group_chats_to_follow:
        logger.warning(
            f"bot received message from group chat with ID {chat.id} ({chat.title}) but is not configured to follow it"
        )
        return

    if chat.username is None:
        logger.warning(f"chat {chat.id} ({chat.title}) is not a public group")
        return

    update_output_file(msg)


async def handle_private_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Ask the user whether to forward their message to the public channel anonymously.
    """
    keyboard = [
        [
            InlineKeyboardButton("Kyllä / Yes", callback_data="1"),
            InlineKeyboardButton("Ei / No", callback_data="0"),
        ]
    ]
    markup = InlineKeyboardMarkup(keyboard)
    context.user_data["msg"] = update.effective_message
    await update.message.reply_text(
        "Haluatko lähettää viestin anonyyminä?\nDo you want your message to be anonymous?",
        reply_markup=markup,
    )


async def on_anonymity_choice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    This gets called when the user clicks on the button specifying whether to
    send the message to the public channel as anonymous.
    The message that will be forwarded is in user_data["msg"].
    """
    query = update.callback_query
    msg = context.user_data["msg"]
    del context.user_data["msg"]

    if int(query.data) == 1:
        bot = context.bot
        # send anonymously, strip data from message
        if msg.text:
            ret = await bot.send_message(public_channel_id, msg.text)
        elif msg.sticker:
            ret = await bot.send_sticker(public_channel_id, msg.sticker.file_id)
        elif msg.photo:
            ret = await bot.send_photo(
                public_channel_id, msg.photo[0].file_id, msg.caption
            )
        elif msg.video:
            ret = await bot.send_video(
                public_channel_id, msg.video.file_id, msg.caption
            )
        elif msg.video_note:
            ret = await bot.send_video_note(public_channel_id, msg.video_note.file_id)
        elif msg.document:
            ret = await bot.send_document(public_channel_id, msg.document.file_id)
        elif msg.voice:
            ret = await bot.send_voice(public_channel_id, msg.voice.file_id)
        elif msg.audio:
            ret = await bot.send_audio(public_channel_id, msg.audio.file_id)
        elif msg.location:
            ret = await bot.send_location(public_channel_id, location=msg.location)
        else:
            ret = await bot.send_message(
                msg.chat.id, "Tiedostomuoto ei ole tuettu / unsupported message type :("
            )
    else:
        ret = await msg.forward(public_channel_id)

    update_output_file(ret)
    await query.edit_message_text(
        "Viesti lähetettiin onnistuneesti. The message was sent successfully."
    )


async def handle_error(update: object, context: ContextTypes.DEFAULT_TYPE):
    logger.warning(f"Update {update} caused error {context.error}")


async def post_init(application: Application):
    application.add_handler(
        CommandHandler("start", send_help_message, filters=filters.ChatType.PRIVATE)
    )
    application.add_handler(
        CommandHandler("help", send_help_message, filters=filters.ChatType.PRIVATE)
    )
    application.add_handler(
        MessageHandler(filters.ChatType.PRIVATE, handle_private_message)
    )
    application.add_handler(CallbackQueryHandler(on_anonymity_choice))
    application.add_handler(
        MessageHandler(filters.ChatType.GROUPS, handle_group_message)
    )
    application.add_error_handler(handle_error)

    logger.info("Post init done.")


def main():
    app = Application.builder().token(bot_token).concurrent_updates(False).build()
    app.post_init = post_init
    app.run_polling()


if __name__ == "__main__":
    main()
