#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$HOME/.local/share/applications" "$HOME/.local/share/icons/hicolor/256x256/apps"
cp "$ROOT/assets/icon.png" "$HOME/.local/share/icons/hicolor/256x256/apps/libresky-office.png"
cat > "$HOME/.local/share/applications/libresky-office.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=LibreOffice
Comment=LibreSky Bluesky client
Exec=$ROOT/bin/libreoffice
Icon=libresky-office
Terminal=false
Categories=Network;InstantMessaging;
StartupWMClass=libresky-office
EOF
chmod +x "$ROOT/bin/libreoffice"
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$HOME/.local/share/applications" || true
fi
echo "Installed LibreOffice in the application menu."
