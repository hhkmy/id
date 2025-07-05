import qrcode
import qrcode.image.svg
import os

def generate_qr_code(url: str, output_path: str):
    # Check if output format is SVG
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