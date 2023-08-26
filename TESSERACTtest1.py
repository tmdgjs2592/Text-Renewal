from PIL import Image
import pytesseract

# Path to the Tesseract executable (if not in system PATH)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Load the PNG image using PIL (Python Imaging Library)
image = Image.open(r'C:\Users\rkozl\OneDrive\Desktop\triangles and rectangles\TESSERACTtest1image1.png')

# Perform OCR on the image
extracted_text = pytesseract.image_to_string(image)

# Print the extracted text
print(extracted_text)
