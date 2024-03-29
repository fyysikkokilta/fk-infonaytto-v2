# Information display of the Guild of Physics

New version of the information display made to solve its [predecessor](https://github.com/fyysikkokilta/fk-infonaytto) problems with maintainability and perfomance. Made with React.

New features:
- intelligent pages: page visibility and duration on the screen is easily configured
- easier to maintain(?)

Removed features:
- less emphasis on animations
- a bit less lörinä

### Usage
Clone repo, install bun and dependencies in root and telegram bot with `bun install`. After that start the server with `bun run server.ts` and open http://localhost:3010 in browser.

Some of the content require browser extension to bypass CORS restrictions (for example [Cors Everywhere](https://addons.mozilla.org/fi/firefox/addon/cors-everywhere/)). Future consideration is to provide backend solely with purpose to allow content to be shown without extension.

### Configuration
In Page.json define pages that you want to show by commenting out unneeded pages. Create file apiKeys.ts in src where you put your google calendar, Flickr API keys and Wappu declaration flag (and other possible keys). Configure telegram-bot/config.py to show telegram content on the screen. Also add symlink from telegram-bot/update.json to update.json. To use Spotify.js create script that updates history.json file for example by using scp. 

#### Note about Raspberry Pi configuration
Install dependencies: `sudo apt install xdotool tmux`

To make Firefox open automatically on startup, do the following:
1. Set up Raspbian to automatically log in to the user you want. This can be done with `sudo raspi-config` and select "Desktop Autologin Desktop GUI" from the System options -> Boot / Auto Login. Then, find all instances of the username of the user which was used to run `raspi-config` in the files `/etc/lightdm/lightdm.conf` and `/etc/systemd/system/getty@tty1.service.d/autologin.conf`, and replace them with the user name you want.
1. Add the line `@sh path/to/infonaytto/launch_infonaytto.sh` to `~/.config/lxsession/LXDE-pi/autostart` (note the `@` at the beginning), with the user that will log in automatically.
1. To prevent the raspi from going to sleep, also add the following lines to `autostart` (instructions from [here](https://www.bitpi.co/2015/02/14/prevent-raspberry-pi-from-sleeping/)):
```
@xset s noblank
@xset s off
@xset -dpms
```

To automatically turn of the screen during certain time of day (e.g. between 12 AM and 7 AM): `sudo crontab -e` and add the lines
```
0  0 * * * DISPLAY=:0 xset dpms force off
0  7 * * * DISPLAY=:0 xset -dpms
```

### Contributing
Adding new pages to the infomation display is simple. Just take a look `frontend/src/pages/Example.tsx` to see how page works. Contact developers if you want to contribute.
