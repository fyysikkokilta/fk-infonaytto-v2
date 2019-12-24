# FK-Infonäyttö Telegram bridge

`infonayttobot.py` is a Telegram bot that forwards private messages sent to it to a specified public channel (possibly anonymously). It records the message ID of the sent messages to `update.json`, which can be then used to embed the latest post(s) (for example in `tgpost.html`) using the [Telegram Post Widget API](https://core.telegram.org/widgets/posts). The bot can also be set up to follow some public group chats and save the latest message ID's from those to `update.json` as well. The bot uses the [Python Telegram Bot](https://python-telegram-bot.org/) library.

## Setup

1. Install dependencies: `sudo pip3 install python-telegram-bot` (or use virtualenv).
1. Fill in the bot token and other values in `config.py`.
1. Make sure to disable [privacy mode](https://core.telegram.org/bots#privacy-mode) for your bot with BotFather. Add the bot to the channels you want it to follow.
1. Run the bot: `python3 infonayttobot.py` in `tmux` or `screen` or whatever. Messages in chats will be tracked in the file `update.json` by default.
1. See `tgpost.html` on how the messages get displayed in the info screen.
