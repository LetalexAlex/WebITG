const form = document.getElementById("uploadForm");
const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("status");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = form.querySelector("input[type='file']");
    if (!fileInput.files?.length) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const xhr = new XMLHttpRequest();

    // track progress
    xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            progressBar.value = percent;
            statusText.textContent = `Uploading... ${Math.round(percent)}%`;
        }
    });

    xhr.addEventListener("load", () => {
        statusText.textContent = "✅ Upload complete!";
    });

    xhr.addEventListener("error", () => {
        statusText.textContent = "❌ Upload failed!";
    });

    xhr.open("POST", "http://localhost:3000/upload");
    xhr.send(formData);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200) {
                //console.log(xhr.responseText);
                document.getElementById("output").textContent = xhr.responseText;
            }
        }
    }
});