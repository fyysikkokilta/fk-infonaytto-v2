#!/bin/bash

killall chromium
tmux kill-session -t page
tmux kill-session -t bot
