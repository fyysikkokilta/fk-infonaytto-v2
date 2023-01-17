# Information display of the Guild of Physics

New version of the information display made to solve its [predecessor](https://github.com/fyysikkokilta/fk-infonaytto) problems with maintainability and perfomance. Made with React.

New features:
- intelligent pages: page visibility and duration on the screen is easily configured
- easier to maintain(?)

Removed features:
- less emphasis on animations
- a bit less lörinä

### Usage
Clone repo, install dependencies in root and frontend with `npm install` and make production build with `npm run build:ui`. After that start the server with `npm start` and open http://localhost:3000 in browser.

Some of the content require browser extension to bypass CORS restrictions (for example [Cors Everywhere](https://addons.mozilla.org/fi/firefox/addon/cors-everywhere/)). Future consideration is to provide backend solely with purpose to allow content to be shown without extension.

### Configuration
In Page.json define pages that you want to show by commenting out unneeded pages. Create file apiKeys.js in frontend/src where you put your google calendar API key (and other possible keys). Configure telegram-bot/config.py to show telegram content on the screen. Also add symlink from telegram-bot/update.json to update.json. To use Spotify.js create script that updates history.json file for example by using scp. 

#### Note about Raspberry Pi configuration
Install dependencies: `sudo apt install xdotool tmux`

To make Firefox open automatically on startup, do the following:
1. Set up Raspbian to automatically log in to the user you want. This can be done with `sudo raspi-config` and select "auto-login GUI" from the Boot options. Then, find all instances of the username of the user which was used to run `raspi-config` in the files `/etc/lightdm/lightdm.conf` and `/etc/systemd/system/getty@tty1.service.d/autologin.conf`, and replace them with the user name you want.
1. Add the line `@sh path/to/infonaytto/launch_infonaytto.sh` to `~/.config/lxsession/LXDE-pi/autostart` (note the `@` at the beginning), with the user that will log in automatically.
1. To prevent the raspi from going to sleep, also add the following lines to `autostart` (instructions from [here](https://www.bitpi.co/2015/02/14/prevent-raspberry-pi-from-sleeping/)):
```
@xset s noblank
@xset s off
@xset -dpms
```

To automatically turn of the screen during certain time of day (e.g. between 2 AM and 7:45 AM): `sudo crontab -e` and add the lines
```
0  2 * * * vcgencmd display_power 0
45 7 * * * vcgencmd display_power 1
```

### Contributing
Adding new pages to the infomation display is simple. Just take a look `frontend/src/pages/Example.js` to see how page works. Contact developers if you want to contribute.
