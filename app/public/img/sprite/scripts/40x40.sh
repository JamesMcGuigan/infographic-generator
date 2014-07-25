#!/bin/bash +x
mkdir ../40x40
for i in ../*.png; do
    convert $i -bordercolor white -border 1x1 -alpha set -channel RGBA -fuzz %15 -fill none -floodfill +0+0 white -shave 1x1 -background none -geometry 40x40 ../40x40/`basename $i`;
done
