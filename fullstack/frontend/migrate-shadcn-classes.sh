#!/usr/bin/env bash
# frontend/migrate-shadcn-classes.sh
# A shadcn-vue osztályneveket a Figma-neves tokenekre írja át a megadott komponensmappákban.
#
# Használat (a frontend/ mappából, vagy a gyökérből: just shadcn-migrate <komponens>...):
#   bash migrate-shadcn-classes.sh sheet navigation-menu
#
# FIGYELEM: komponensenként csak EGYSZER futtasd, közvetlenül a `shadcn-vue add` után!

set -euo pipefail
cd "$(dirname "$0")"

if [ "$#" -eq 0 ]; then
  echo "Használat: bash migrate-shadcn-classes.sh <komponens> [<komponens>...]   (pl. button dialog)" >&2
  exit 1
fi

for name in "$@"; do
  dir="src/components/ui/$name"
  if [ ! -d "$dir" ]; then
    echo "Nincs ilyen komponensmappa: $dir" >&2
    exit 1
  fi
  find "$dir" -type f \( -name '*.vue' -o -name '*.js' \) -print0 |
  xargs -0 perl -pi -e '
    s/\btext-accent-foreground(?![-\w])/text-accent/g;
    s/\b(bg|text|border|ring|outline)-accent(?![-\w])/$1 eq "bg" ? "bg-accent-soft" : "$1-accent"/ge;
    s/\bbg-sidebar-accent(?![-\w])/bg-accent-soft/g;
    s/\btext-popover-foreground(?![-\w])/text-text/g;
    s/\btext-card-foreground(?![-\w])/text-text/g;
    s/\btext-muted-foreground(?![-\w])/text-text-muted/g;
    s/\btext-foreground(?![-\w])/text-text/g;
    s/\bbg-(popover|card)(?![-\w])/bg-surface/g;
    s/\bbg-background(?![-\w])/bg-bg/g;
    s/\bbg-(secondary|muted)(?![-\w])/bg-surface-2/g;
    s/\btext-primary-foreground(?![-\w])/text-accent-text/g;
    s/\bbg-primary(?![-\w])/bg-accent/g;
    s/\btext-primary(?![-\w])/text-accent/g;
    s/\bbg-destructive(?![-\w])/bg-danger/g;
    s/\btext-destructive(?![-\w])/text-danger/g;
    s/\b(ring|outline)-ring(?![-\w])/$1-accent/g;
    s/\bring-offset-background(?![-\w])/ring-offset-bg/g;
  '
  echo "Átírva: $dir"
done
