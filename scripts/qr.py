import os
from xml.sax.saxutils import escape

import qrcode
import qrcode.image.svg


def qr_matrix_to_path(matrix: list[list[bool]], box_size: int) -> str:
    commands = []
    for row_index, row in enumerate(matrix):
        y = row_index * box_size
        for column_index, filled in enumerate(row):
            if not filled:
                continue
            x = column_index * box_size
            commands.append(
                f"M{x},{y}H{x + box_size}V{y + box_size}H{x}z"
            )
    return "".join(commands)


def generate_animated_qr_svg(url: str, output_path: str):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_H,
        box_size=3,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)

    matrix = qr.get_matrix()
    box_size = qr.box_size
    size = len(matrix) * box_size
    path_data = qr_matrix_to_path(matrix, box_size)
    center = size / 2
    radius = size / 2 - (box_size * 2.5)
    circle_control = radius * 0.5522847498
    escaped_url = escape(url)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}mm" height="{size}mm" viewBox="0 0 {size} {size}" role="img" aria-labelledby="qr-title qr-desc">
  <title id="qr-title">HHK QR code</title>
  <desc id="qr-desc">QR code for {escaped_url}.</desc>
  <style>
    .qr-fill {{ fill: #000; }}
    .qr-draw {{ fill: none; stroke: #000; stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; opacity: 0; pointer-events: none; }}
    .qr-hidden-path {{ fill: none; stroke: none; opacity: 0; pointer-events: none; }}
    .qr-motion-dot {{ fill: #000; opacity: 0; pointer-events: none; }}
    svg[data-theme="dark"] .qr-fill {{ fill: #fff; }}
    svg[data-theme="dark"] .qr-draw {{ stroke: #fff; }}
    svg[data-theme="dark"] .qr-motion-dot {{ fill: #fff; }}
  </style>
  <path id="qr-path" class="qr-fill" d="{path_data}" fill-rule="nonzero"/>
  <path id="qr-draw-path" class="qr-draw" d="{path_data}"/>
  <path id="qr-morph-target" class="qr-hidden-path" d="M{center} {center - radius}C{center + circle_control} {center - radius} {center + radius} {center - circle_control} {center + radius} {center}C{center + radius} {center + circle_control} {center + circle_control} {center + radius} {center} {center + radius}C{center - circle_control} {center + radius} {center - radius} {center + circle_control} {center - radius} {center}C{center - radius} {center - circle_control} {center - circle_control} {center - radius} {center} {center - radius}Z"/>
  <circle id="qr-motion-dot" class="qr-motion-dot" r="2.2"/>
</svg>
'''
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"Animated QR code saved to {output_path}")

def generate_qr_code(url: str, output_path: str):
    # Check if output format is SVG
    is_svg = output_path.lower().endswith('.svg')
    if is_svg:
        generate_animated_qr_svg(url, output_path)
        return
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_H,
        box_size=30,
        border=1,
        image_factory=qrcode.image.svg.SvgPathImage if is_svg else None,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        img.save(f)
    print(f"Light mode QR code saved to {output_path}")

def generate_qr_code_dark(url: str, output_path: str):
    # Generate a QR code with white foreground and black background (for dark mode)
    is_svg = output_path.lower().endswith('.svg')
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_H,
        box_size=30,
        border=1,
        image_factory=qrcode.image.svg.SvgPathImage if is_svg else None,
    )
    qr.add_data(url)
    qr.make(fit=True)
    if is_svg:
        import io
        img = qr.make_image(fill_color="black", back_color="white")
        svg_io = io.BytesIO()
        img.save(svg_io)
        svg_data = svg_io.getvalue().decode('utf-8')
        # Remove XML declaration if present
        if svg_data.startswith("<?xml"):
            first_tag = svg_data.find('<svg')
            if first_tag != -1:
                svg_data = svg_data[first_tag:]
        # Insert a black background rect and set all path fills to white
        import re
        svg_tag_end = svg_data.find('>')
        if svg_tag_end != -1:
            rect = '<rect width="100%" height="100%" fill="#000"/>'
            svg_data = svg_data[:svg_tag_end+1] + rect + svg_data[svg_tag_end+1:]
        svg_data = re.sub(r'fill="#000000"', 'fill="#ffffff"', svg_data)
        # Add XML declaration back
        svg_data = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg_data
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_data)
    else:
        img = qr.make_image(fill_color="white", back_color="black")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'wb') as f:
            img.save(f)
    print(f"Dark mode QR code saved to {output_path}")

if __name__ == "__main__":
    website_url = input("Enter the website URL: ")
    format_choice = input("Choose format (png/svg) [default: png]: ").lower().strip()
    
    if format_choice == "svg":
        output_file_light = "assets/ui/qr.svg"
        output_file_dark = "assets/ui/qr-dark.svg"
    else:
        output_file_light = "assets/ui/qr.png"
        output_file_dark = "assets/ui/qr-dark.png"
    
    generate_qr_code(website_url, output_file_light)
    generate_qr_code_dark(website_url, output_file_dark)
