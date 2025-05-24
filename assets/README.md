# Assets Directory

This directory contains static assets for the ProductivityPro application.

## Required Assets

The following assets should be placed in this directory:

- `icon.png` - Main application icon (512x512 recommended)
- `icon.ico` - Windows application icon
- `icon.icns` - macOS application icon
- `tray-icon.png` - System tray icon for Windows/Linux (16x16 recommended)
- `tray-icon-mac.png` - System tray icon for macOS (22x22 recommended)

## Asset Generation

You can use tools like [Electron Icon Maker](https://github.com/jaretburkett/electron-icon-maker) to generate all the required icon formats from a single source image.

Example:
```
npm install -g electron-icon-maker
electron-icon-maker --input=source-icon.png --output=./
```

This will generate all the required icon formats in the current directory.