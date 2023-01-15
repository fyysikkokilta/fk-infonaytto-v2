# Start the infonaytto html file in firefox and set it to full screen.
# To run this script on GUI login, add the following line (without # (but with @) and with the correct path) to ~/.config/lxsession/LXDE-pi/autostart
#@sh /home/infonaytto/infonaytto/launch_infonaytto.sh

# open terminal and display IP address
#lxterminal --command="watch ifconfig wlan0" &

export DISPLAY=:0
INFONAYTTO_FOLDER=~/fk-infonaytto-v2
#TODO: implement this: https://stackoverflow.com/questions/50988416/stop-tmux-detached-session-closing-when-command-finishes
# Serve infonaytto page
lxterminal --command="tmux new-session -s 'page' 'serve -s $INFONAYTTO_FOLDER/build'" &

# Start bot
lxterminal --command="tmux new-session -s 'bot' 'python3 $INFONAYTTO_FOLDER/telegram-bot/infonayttobot.py'" &

# from https://askubuntu.com/questions/36287/how-to-start-firefox-in-fullscreen-mode
firefox-esr http://localhost:3000 &

until xdotool search --sync --onlyvisible --class "Firefox" windowactivate key F11; do
	# xdotool sometimes fails, retry
	echo retrying xdotool fullscreen
	sleep 0.1
done
