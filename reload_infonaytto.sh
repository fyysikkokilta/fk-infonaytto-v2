#!/bin/bash

export DISPLAY=:0
if xdotool search --onlyvisible --class "Chromium" windowactivate key F5
then
	# sometimes key gets stuck, do this just in case
	xdotool keyup F5
	echo "Sent F5 to Chromium."
else
	echo "Running instance of Chromium not found."
fi