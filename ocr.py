from flask import Flask, request, send_file
import pytesseract
from PIL import Image
import os

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def perform_ocr():
    uploaded_file = request.files['uploadedFile']
    if uploaded_file:
        image = Image.open(uploaded_file)
        extracted_text = pytesseract.image_to_string(image)

        # Save extracted text to a text file
        text_file_path = 'extracted_text.txt'
        with open(text_file_path, 'w') as text_file:
            text_file.write(extracted_text)
        
        return "Extraction complete. <a href='/download'>Download Text</a>"
    else:
        return "Error: No file uploaded"

@app.route('/download')
def download_text():
    text_file_path = 'extracted_text.txt'
    return send_file(text_file_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
