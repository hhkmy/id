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
    
    if is_svg:
        with open(output_path, 'wb') as f:
            img.save(f)
    else:
        with open(output_path, 'wb') as f:
            img.save(f)
    print(f"QR code saved to {output_path}")

if __name__ == "__main__":
    website_url = input("Enter the website URL: ")
    format_choice = input("Choose format (png/svg) [default: png]: ").lower().strip()
    
    if format_choice == "svg":
        output_file = "assets/ui/qr.svg"
    else:
        output_file = "assets/ui/qr.png"
    
    generate_qr_code(website_url, output_file)