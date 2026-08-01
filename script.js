//!!! یہاں اپنا Apps Script کا /exec والا link لگائیں!!!
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUeFmcHL_BO6gdnojFUFRDyCrPv4-SbT8a0E_Js6CI9blcvTFhWFR7afMofEPRQzRv/exec";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btn = document.getElementById('btn');
const progress = document.getElementById('progress');
const errorBox = document.getElementById('error');

let cameraStream = null;

// Page load ہوتے ہی camera کی permission لے لیں تاکہ click پر delay نہ ہو
window.onload = async () => {
  try {
    updateProgress("کیمرہ تیار ہو رہا ہے... 0%");
    cameraStream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: "environment" } 
    });
    video.srcObject = cameraStream;
    updateProgress("تیار ہے۔ بٹن دبائیں 100%");
  } catch (err) {
    showError("کیمرہ Error: " + err.name + "\n" + err.message);
  }
};

function updateProgress(msg) {
  progress.innerText = msg;
  errorBox.innerText = "";
}

function showError(msg) {
  errorBox.innerText = "❌ " + msg;
  progress.innerText = "";
  btn.disabled = false;
}

async function startProcess() {
  btn.disabled = true;
  errorBox.innerText = "";

  try {
    // 1. تصویر کھینچنا 25%
    updateProgress("تصویر کھینچی جا رہی ہے... 25%");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.7);

    // 2. بھیجنا 50%
    updateProgress("سرور پر بھیجا جا رہا ہے... 50%");
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error("Server Error: " + response.status);

    // 3. جواب 75%
    updateProgress("جواب کا انتظار ہے... 75%");
    const result = await response.json();

    // 4. مکمل 100%
    updateProgress("✅ " + result.message + " 100%");
    btn.innerText = "دوبارہ بھیجیں";

  } catch (error) {
    showError("بھیجنے میں مسئلہ: " + error.message);
  } finally {
    btn.disabled = false;
  }
}
