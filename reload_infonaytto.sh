#!/bin/bash

# run this script to remotely send F5 keystroke to Firefox
# with option --pull, also pull from git
# with option --restart, close firefox and reopen with infonaytto HTML

cd "$(dirname "$0")"

if [[ "$@" == "--pull" ]]
then
	# exit on error (e.g. merge conflict etc.)
	set -e
	git pull
	set +e
fi

if [[ "$@" == "--restart" ]]
then

	#NOTE: killing firefox makes it think it has crashed, to prevent it from nagging, go to about:config and set toolkit.startup.max_resumed_crashes to -1
	killall firefox-esr

	DISPLAY=:0 sh launch_infonaytto.sh

else

	export DISPLAY=:0
	if xdotool search --onlyvisible --class "Firefox" windowactivate key F5
	then
		# sometimes key gets stuck, do this just in case
		xdotool keyup F5
		echo "Sent F5 to Firefox."
	else
		echo "Running instance of Firefox not found."
	fi

fi
