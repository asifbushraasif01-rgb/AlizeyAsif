const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const status = document.getElementById("status");

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const downloadBtn = document.getElementById("downloadBtn");

let stream = null;

// Start Camera
startBtn.addEventListener("click", async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        video.srcObject = stream;

        status.innerHTML = "📷 Camera Ready";

        captureBtn.disabled = false;
        startBtn.disabled = true;

    } catch (err) {
        alert("Camera permission denied.");
    }
});

// Capture
captureBtn.addEventListener("click", () => {

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/png");

    photo.src = img;
    photo.style.display = "block";

    video.style.display = "none";

    captureBtn.disabled = true;
    retakeBtn.disabled = false;
    downloadBtn.disabled = false;

    status.innerHTML = "✅ Photo Captured";

});

// Retake
retakeBtn.addEventListener("click", () => {

    photo.style.display = "none";
    video.style.display = "block";

    captureBtn.disabled = false;
    retakeBtn.disabled = true;
    downloadBtn.disabled = true;

    status.innerHTML = "📷 Camera Ready";

});

// Download
downloadBtn.addEventListener("click", () => {

    const a = document.createElement("a");

    a.href = photo.src;
    a.download = "photo.png";

    a.click();

});

// Stop camera when page closes
window.addEventListener("beforeunload", () => {

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

});
