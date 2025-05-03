import qrcode
import os

def generate_qr_code(url, output_path):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=30,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path)
    print(f"QR code saved to {output_path}")

if __name__ == "__main__":
    website_url = input("Enter the website URL: ")
    output_file = "assets/ui/qr.png"
    generate_qr_code(website_url, output_file)