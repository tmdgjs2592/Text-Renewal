document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const resultDiv = document.getElementById('result');
    
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    const response = await fetch('/perform-ocr', {
        method: 'POST',
        body: formData
    });

    const text = await response.text();
    resultDiv.innerHTML = text;

    // Display the result container
    resultDiv.style.display = 'flex';
});
