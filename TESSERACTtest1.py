from PIL import Image
import pytesseract

# Path to the Tesseract executable (if not in system PATH)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Load an image into this function
image = Image.open('Image.png')

# Perform OCR on the image
extracted_text = pytesseract.image_to_string(image)

# Print the extracted text
print(extracted_text)
