# Information display of the Guild of Physics

New version of the information display made to solve its [predecessor](https://github.com/fyysikkokilta/fk-infonaytto) problems with maintainability and perfomance. Made with React.

New features:
- intelligent pages: page visibility and duration on the screen is easily configured
- easier to maintain(?)

Removed features:
- less emphasis on animations
- a bit less lörinä

### Usage
1. Clone repo, install bun and dependencies in root and telegram bot with `bun install` and `pip install -r requirements.txt`.
1. Create a `.env` file using the example `.env.example`
1. Create the bot config in file `config.py` using the example `example-update.json`
1. Copy `example-update.json` to `update.json`
1. After that start the server with `bun run server.ts` and bot with `python infonayttobot.py` and open http://localhost:3010 in browser.

#### Docker
The project can also be started as a Docker container using `docker compose -f docker-compose.prod.yaml up -d`.

#### Note about Raspberry Pi configuration
To make Chromium open automatically on startup, do the following:
1. Set up Raspbian to automatically log in to the user you want. This can be done with `sudo raspi-config` and select "Desktop Autologin Desktop GUI" from the System options -> Boot / Auto Login. Then, find all instances of the username of the user which was used to run `raspi-config` in the files `/etc/lightdm/lightdm.conf` and `/etc/systemd/system/getty@tty1.service.d/autologin.conf`, and replace them with the user name you want.
1. Add the line `@chromium-brower --kiosk infonaytto.fyysikkokilta.fi` to `~/.config/lxsession/LXDE-pi/autostart` (note the `@` at the beginning), with the user that will log in automatically.
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
Adding new pages to the infomation display is simple. Just take a look `src/pages/Example.tsx` to see how page works. Contact developers if you want to contribute.
