#!/bin/bash

killall chromium-browser
tmux kill-session -t page
tmux kill-session -t bot

sleep 10
