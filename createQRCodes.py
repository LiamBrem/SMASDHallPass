import qrcode
from PIL import Image
import os

# Base URL - Will need changed once we get domain
base_url = "https://liambrem.pythonanywhere.com/"

# Specify the directory to save the QR code images
save_directory = "/Desktop/QR"

# Names to be appended
with open("names/allTeachers.txt", "r") as file:
    listOfNames = file.readlines()


# Generate and save QR codes
for name in listOfNames:
    name = name.strip()

    # Combine the base URL and the name
    full_url = base_url + "teacher/" + name
    
    # Create a QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add data to the QR code
    qr.add_data(full_url)
    qr.make(fit=True)
    
    # Create an image from the QR code instance
    img = qr.make_image(fill_color="black", back_color="white")

    # Create the full path for saving the image
    save_path = os.path.join(save_directory, f"qrcode_{name}.png")
    
    # Save the image
    #img.save(save_path)

    # Display the image (optional)
    img.show()



    





