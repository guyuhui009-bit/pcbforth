#!/usr/bin/env python3
"""Generate clean company logos as SVG then convert to PNG."""
import cairosvg, os

logos = {
    "huawei": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <!-- Huawei flower icon -->
  <g transform="translate(20,40)">
    <ellipse cx="0" cy="-14" rx="4.5" ry="12" fill="#CF0A2C" transform="rotate(0)"/>
    <ellipse cx="0" cy="-14" rx="4.5" ry="12" fill="#CF0A2C" transform="rotate(60)"/>
    <ellipse cx="0" cy="-14" rx="4.5" ry="12" fill="#CF0A2C" transform="rotate(120)"/>
    <ellipse cx="0" cy="-14" rx="4.5" ry="12" fill="#CF0A2C" transform="rotate(180)"/>
    <ellipse cx="0" cy="-14" rx="4.5" ry="12" fill="#CF0A2C" transform="rotate(240)"/>
    <ellipse cx="0" cy="-14" rx="4.5" ry="12" fill="#CF0A2C" transform="rotate(300)"/>
  </g>
  <text x="58" y="48" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#CF0A2C" letter-spacing="1">HUAWEI</text>
</svg>""",

    "lenovo": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <text x="20" y="52" font-family="Arial,sans-serif" font-size="38" font-weight="bold" fill="#E2231A" letter-spacing="-1">Lenovo</text>
</svg>""",

    "foxconn": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <rect x="0" y="0" width="240" height="80" fill="white"/>
  <text x="12" y="52" font-family="Arial,sans-serif" font-size="30" font-weight="bold" fill="#003087" letter-spacing="1">FOXCONN</text>
</svg>""",

    "byd": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <!-- BYD badge shape -->
  <rect x="10" y="15" width="220" height="50" rx="4" fill="#003087"/>
  <rect x="13" y="18" width="214" height="44" rx="3" fill="none" stroke="#C8A84B" stroke-width="2"/>
  <text x="120" y="50" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="4">BYD</text>
</svg>""",

    "dji": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <rect x="0" y="0" width="240" height="80" fill="white"/>
  <text x="20" y="56" font-family="Arial,sans-serif" font-size="48" font-weight="900" fill="#1A1A1A" letter-spacing="-2">DJI</text>
</svg>""",

    "hikvision": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <rect x="0" y="0" width="240" height="80" fill="white"/>
  <!-- Red H icon -->
  <rect x="10" y="18" width="8" height="44" fill="#E30613"/>
  <rect x="10" y="37" width="20" height="8" fill="#E30613"/>
  <rect x="22" y="18" width="8" height="44" fill="#E30613"/>
  <text x="44" y="52" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="#1A1A1A" letter-spacing="0.5">HIKVISION</text>
</svg>""",

    "oppo": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <rect x="0" y="0" width="240" height="80" fill="white"/>
  <text x="20" y="54" font-family="Arial,sans-serif" font-size="40" font-weight="bold" fill="#1D8348" letter-spacing="2">OPPO</text>
</svg>""",

    "xiaomi": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">
  <rect x="0" y="0" width="240" height="80" fill="white"/>
  <!-- MI square icon -->
  <rect x="10" y="18" width="44" height="44" rx="10" fill="#FF6900"/>
  <text x="32" y="49" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">mi</text>
  <text x="66" y="52" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="#FF6900" letter-spacing="0">Xiaomi</text>
</svg>""",
}

for name, svg_content in logos.items():
    svg_path = f"{name}.svg"
    png_path = f"{name}.png"
    with open(svg_path, "w") as f:
        f.write(svg_content)
    try:
        cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=240, output_height=80)
        size = os.path.getsize(png_path)
        print(f"OK {name}.png ({size} bytes)")
    except Exception as e:
        print(f"ERR {name}: {e}")

print("Done!")
