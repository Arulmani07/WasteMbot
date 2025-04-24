// Load Teachable Machine model
let model;
const classes = ["Dry Waste", "Wet Waste", "E-Waste"];

async function init() {
  const modelUrl = "YOUR-TEACHABLE-MACHINE-MODEL-https://teachablemachine.withgoogle.com/models/Ob5Nn-csT//model.json";
  model = await tf.loadLayersModel(modelUrl);
  console.log("Model loaded!");
}

// Detect waste from image
async function detect(imageElement) {
  const tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();
  
  const prediction = await model.predict(tensor).data();
  const topClass = classes[prediction.indexOf(Math.max(...prediction))];
  
  document.getElementById("result").innerHTML = `
    ✅ <b>${topClass}</b><br>
    💡 ${getTip(topClass)}
  `;
}

// Waste tips
function getTip(className) {
  const tips = {
    "Dry Waste": "Rinse and recycle in the blue bin.",
    "Wet Waste": "Compost in the green bin.",
    "E-Waste": "Take to e-waste recycling centers."
  };
  return tips[className] || "Check local guidelines.";
}

// Camera capture
document.getElementById("camera-btn").addEventListener("click", async () => {
  const video = document.getElementById("camera");
  video.hidden = false;
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
});

// Image upload
document.getElementById("upload").addEventListener("change", (e) => {
  const image = new Image();
  image.src = URL.createObjectURL(e.target.files[0]);
  image.onload = () => detect(image);
});

init(); // Load model on startup
