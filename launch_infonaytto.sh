#!/bin/bash

# Start the infonaytto html file in firefox and set it to full screen.
# To run this script on GUI login, add the following line (without # (but with @) and with the correct path) to ~/.config/lxsession/LXDE-pi/autostart
#@sh /home/infonaytto/infonaytto/launch_infonaytto.sh

# open terminal and display IP address
#lxterminal --command="watch ifconfig wlan0" &

export DISPLAY=:0
INFONAYTTO_FOLDER=~/fk-infonaytto-v2
#TODO: implement this: https://stackoverflow.com/questions/50988416/stop-tmux-detached-session-closing-when-command-finishes
# Serve infonaytto page
lxterminal --command="tmux new-session -s 'page' '/home/infonaytto/.bun/bin/bun run $INFONAYTTO_FOLDER/server.ts'" &

# Start bot
lxterminal --command="tmux new-session -s 'bot' 'python3 $INFONAYTTO_FOLDER/telegram-bot/infonayttobot.py'" &

sleep 10

nohup chromium-browser --kiosk --disable-web-security --user-data-dir="~/test" http://localhost:3010 & disown
