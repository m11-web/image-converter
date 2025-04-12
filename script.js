document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const formatSelect = document.getElementById('format');
    const applyChangesButton = document.getElementById('applyChanges');
    const imageCanvas = document.getElementById('imageCanvas');
    const ctx = imageCanvas.getContext('2d');
    let uploadedImage = null;

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage = new Image();
                uploadedImage.onload = () => {
                    // Set initial canvas size to the image size
                    imageCanvas.width = uploadedImage.width;
                    imageCanvas.height = uploadedImage.height;
                    ctx.drawImage(uploadedImage, 0, 0);
                };
                uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    applyChangesButton.addEventListener('click', () => {
        if (!uploadedImage) {
            alert('Please upload an image first.');
            return;
        }

        const newWidth = widthInput.value ? parseInt(widthInput.value) : uploadedImage.width;
        const newHeight = heightInput.value ? parseInt(heightInput.value) : uploadedImage.height;
        const newFormat = formatSelect.value;

        imageCanvas.width = newWidth;
        imageCanvas.height = newHeight;
        ctx.drawImage(uploadedImage, 0, 0, newWidth, newHeight);

        // Convert the canvas to the desired format and offer download
        imageCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `edited_image.${newFormat.split('/')[1]}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, newFormat);
    });
});
