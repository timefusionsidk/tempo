from PIL import Image, ImageDraw
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT, exist_ok=True)

BG = (59, 79, 224, 255)      # signal
FG = (247, 245, 240, 255)    # paper


def draw_glyph(draw, cx, cy, r, stroke, color):
    # Stopwatch body: circle with a crown notch and a hand, drawn simply.
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=stroke)
    # crown (small tab on top)
    crown_w = r * 0.38
    draw.rounded_rectangle(
        [cx - crown_w / 2, cy - r - r * 0.32, cx + crown_w / 2, cy - r + r * 0.06],
        radius=crown_w * 0.3,
        fill=color,
    )
    # hand pointing to ~1 o'clock
    angle = math.radians(-60)
    hx = cx + r * 0.55 * math.cos(angle)
    hy = cy + r * 0.55 * math.sin(angle)
    draw.line([cx, cy, hx, hy], fill=color, width=stroke)
    # center dot
    dotr = stroke * 0.9
    draw.ellipse([cx - dotr, cy - dotr, cx + dotr, cy + dotr], fill=color)


def make_icon(size, maskable=False, path=None):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    corner = size * (0.5 if not maskable else 0)  # maskable must be full-bleed square
    if maskable:
        d.rectangle([0, 0, size, size], fill=BG)
        safe_r = size * 0.30  # keep glyph inside the ~40% safe zone radius
        draw_glyph(d, size / 2, size / 2, safe_r, max(2, int(size * 0.045)), FG)
    else:
        radius = size * 0.22
        d.rounded_rectangle([0, 0, size, size], radius=radius, fill=BG)
        r = size * 0.30
        draw_glyph(d, size / 2, size / 2 + size * 0.01, r, max(2, int(size * 0.06)), FG)

    img.save(path)


make_icon(192, False, os.path.join(OUT, "icon-192.png"))
make_icon(512, False, os.path.join(OUT, "icon-512.png"))
make_icon(512, True, os.path.join(OUT, "icon-maskable-512.png"))

print("icons written to", OUT)
