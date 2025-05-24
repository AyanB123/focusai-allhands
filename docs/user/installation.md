# Installation Guide

This guide provides detailed instructions for installing ProductivityPro on Windows, macOS, and Linux.

## System Requirements

Before installing ProductivityPro, ensure your system meets the following requirements:

### Windows
- Windows 10 or later
- 4GB RAM (8GB recommended)
- 500MB free disk space
- Administrator privileges for installation

### macOS
- macOS Mojave (10.14) or later
- 4GB RAM (8GB recommended)
- 500MB free disk space
- Administrator privileges for installation

### Linux
- Ubuntu 20.04 LTS or equivalent
- 4GB RAM (8GB recommended)
- 500MB free disk space
- sudo privileges for installation

## Installation Instructions

### Windows

1. Download the latest Windows installer (.msi) from the [ProductivityPro website](https://productivitypro.app/downloads).
2. Double-click the downloaded file to start the installation wizard.
3. Follow the on-screen instructions:
   - Accept the license agreement
   - Choose the installation location (default: `C:\Program Files\ProductivityPro`)
   - Select additional components (browser extensions, etc.)
   - Click "Install"
4. When prompted, allow the application to make changes to your device.
5. After installation completes, click "Finish" to launch ProductivityPro.

### macOS

1. Download the latest macOS installer (.dmg) from the [ProductivityPro website](https://productivitypro.app/downloads).
2. Double-click the downloaded file to mount the disk image.
3. Drag the ProductivityPro icon to the Applications folder.
4. Open the Applications folder and right-click (or Control-click) on ProductivityPro.
5. Select "Open" from the context menu.
6. Click "Open" when prompted to confirm opening the application.
7. When prompted, enter your administrator password to grant necessary permissions.

### Linux

#### Debian/Ubuntu (using .deb package)

1. Download the latest .deb package from the [ProductivityPro website](https://productivitypro.app/downloads).
2. Open a terminal and navigate to the download location.
3. Run the following command:
   ```bash
   sudo dpkg -i productivitypro_*.deb
   sudo apt-get install -f
   ```
4. Launch ProductivityPro from the application menu or by running:
   ```bash
   productivitypro
   ```

#### Using AppImage

1. Download the latest AppImage from the [ProductivityPro website](https://productivitypro.app/downloads).
2. Open a terminal and navigate to the download location.
3. Make the AppImage executable:
   ```bash
   chmod +x ProductivityPro-*.AppImage
   ```
4. Run the AppImage:
   ```bash
   ./ProductivityPro-*.AppImage
   ```

## Browser Extensions

ProductivityPro works best with its browser extensions for accurate URL tracking:

### Chrome Extension
1. After installing ProductivityPro, open Google Chrome.
2. Visit the [Chrome Web Store page for ProductivityPro](https://chrome.google.com/webstore/detail/productivitypro).
3. Click "Add to Chrome" and confirm the installation.
4. The extension will automatically connect to the desktop app.

### Firefox Extension
1. After installing ProductivityPro, open Firefox.
2. Visit the [Firefox Add-ons page for ProductivityPro](https://addons.mozilla.org/en-US/firefox/addon/productivitypro).
3. Click "Add to Firefox" and confirm the installation.
4. The extension will automatically connect to the desktop app.

## First-Time Setup

After installation, ProductivityPro will guide you through an initial setup process:

1. Create an account or sign in with existing credentials.
2. Grant necessary permissions for activity tracking.
3. Configure tracking preferences (idle detection, excluded apps, etc.).
4. Set up integrations (Google Calendar, Trello, etc.) if desired.
5. Complete the onboarding tutorial to learn about key features.

## Troubleshooting

If you encounter issues during installation:

### Windows
- Ensure you have administrator privileges.
- Try running the installer in compatibility mode for Windows 10.
- Temporarily disable antivirus software during installation.

### macOS
- If you see "App cannot be opened because it is from an unidentified developer," right-click the app and select "Open" instead of double-clicking.
- Reset the permissions in System Preferences > Security & Privacy if prompted.

### Linux
- For dependency issues, run `sudo apt-get install -f` to resolve them.
- Check system logs (`journalctl -xe`) for detailed error messages.

## Uninstallation

### Windows
1. Open Control Panel > Programs > Programs and Features.
2. Select ProductivityPro and click "Uninstall."
3. Follow the on-screen instructions.

### macOS
1. Open the Applications folder in Finder.
2. Drag ProductivityPro to the Trash.
3. Empty the Trash.

### Linux
- For .deb packages:
  ```bash
  sudo apt-get remove productivitypro
  ```
- For AppImage: Simply delete the AppImage file.

## Next Steps

After installation, proceed to the [Getting Started Guide](getting-started.md) to learn how to use ProductivityPro effectively.