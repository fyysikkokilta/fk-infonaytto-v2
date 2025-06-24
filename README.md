# Information display of the Guild of Physics

New version of the information display made to solve its [predecessor](https://github.com/fyysikkokilta/fk-infonaytto) problems with maintainability and perfomance. Made with React.

New features:

- intelligent pages: page visibility and duration on the screen is easily configured
- easier to maintain(?)

Removed features:

- less emphasis on animations
- a bit less lörinä

## 🚀 Quick Start

### Development Setup

1. Clone repo, install bun and dependencies in root and telegram bot with `bun install` and `pip install -r requirements.txt`.
2. Create a `.env` file using the example `.env.example`
3. Create the bot config in file `config.py` using the example `example-update.json`
4. Copy `example-update.json` to `update.json`
5. After that start the server with `bun run server.ts` and bot with `python infonayttobot.py` and open http://localhost:3010 in browser.

## 🐳 Docker CI/CD Setup

This project includes automated Docker image building and deployment using GitHub Actions and GitHub Container Registry (ghcr.io).

### How It Works

#### GitHub Actions CI Pipeline

The CI pipeline (`.github/workflows/ci.yml`) automatically:

1. **Builds Docker images** for both the app and Telegram bot
2. **Pushes images** to GitHub Container Registry (ghcr.io)
3. **Tags images** with branch names, PR numbers, semantic versions, and commit SHAs
4. **Caches layers** for faster subsequent builds

#### Triggered On

- **Push to main/master branch** - Builds and pushes production images
- **Pull Requests** - Builds images for testing (doesn't push)
- **Git tags** (v*.*.\*) - Creates release versions

### 📦 Docker Images

After the CI runs, you'll have images available at:

- `ghcr.io/fyysikkokilta/fk-infonaytto-v2-app:latest` - Web application
- `ghcr.io/fyysikkokilta/fk-infonaytto-v2-bot:latest` - Telegram bot

### 🏃‍♂️ Running with Docker

#### Development (Build Locally)

```bash
# Use the development compose file (builds locally)
docker compose up -d
```

#### Production (Use Pre-built Images)

```bash
# Use pre-built images from GitHub Container Registry
docker compose -f docker-compose.prod.yml up -d
```

### 🏷 Image Tags

The CI automatically creates the following tags:

- `latest` - Latest main/master branch
- `main` / `master` - Branch-specific tags
- `pr-123` - Pull request builds
- `v1.0.0` - Semantic version tags
- `sha-abc1234` - Commit-specific tags

### 📁 Docker File Structure

```
.
├── .github/workflows/ci.yml     # CI pipeline
├── docker/
│   ├── Dockerfile.app          # Web app Dockerfile
│   └── Dockerfile.bot          # Telegram bot Dockerfile
├── docker-compose.yml          # Development (build locally)
└── docker-compose.prod.yaml    # Production (use pre-built images)
```

### 🐛 Docker Troubleshooting

#### Images Not Found

- Check that CI has run successfully
- Verify the repository name is correct
- Ensure images are public or you're authenticated

#### Permission Denied

- Make sure GitHub Actions has write permissions to packages
- Check that you're logged into ghcr.io if using private images

#### Build Failures

- Check the GitHub Actions logs
- Ensure Dockerfiles are valid
- Verify all required files are included in the build context

## 🖥️ Raspberry Pi Configuration

To make Chromium open automatically on startup, do the following:

1. Set up Raspbian to automatically log in to the user you want. This can be done with `sudo raspi-config` and select "Desktop Autologin Desktop GUI" from the System options -> Boot / Auto Login. Then, find all instances of the username of the user which was used to run `raspi-config` in the files `/etc/lightdm/lightdm.conf` and `/etc/systemd/system/getty@tty1.service.d/autologin.conf`, and replace them with the user name you want.

2. Add the line `@chromium-browser --kiosk infonaytto.fyysikkokilta.fi` to `~/.config/lxsession/LXDE-pi/autostart` (note the `@` at the beginning), with the user that will log in automatically.

3. To prevent the raspi from going to sleep, also add the following lines to `autostart` (instructions from [here](https://www.bitpi.co/2015/02/14/prevent-raspberry-pi-from-sleeping/)):

```
@xset s noblank
@xset s off
@xset -dpms
```

To automatically turn off the screen during certain time of day (e.g. between 12 AM and 7 AM): `sudo crontab -e` and add the lines

```
0  0 * * * DISPLAY=:0 xset dpms force off
0  7 * * * DISPLAY=:0 xset -dpms
```

## 🤝 Contributing

Adding new pages to the information display is simple. Just take a look `src/pages/Example.tsx` to see how page works. Contact developers if you want to contribute.
