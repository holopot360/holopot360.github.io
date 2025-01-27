// brightnessWorker.js

let prevFrame = null;

self.onmessage = async (e) => {
  const { imageBitmap, threshold } = e.data;
  
  // Create or reuse an OffscreenCanvas in the worker
  // We'll always draw to a small 32×32 area for speed.
  // (You could store this canvas in a global variable if you like.)
  const offscreen = new OffscreenCanvas(32, 32);
  const ctx = offscreen.getContext('2d');
  
  // Draw the transferred ImageBitmap
  ctx.drawImage(imageBitmap, 0, 0, 32, 32);

  // Option A: Simple average brightness
  // Option B: Frame difference approach is more robust in auto-exposure
  // For clarity, let's do average brightness here:

  const frameData = ctx.getImageData(0, 0, 32, 32);
  const data = frameData.data;
  
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    sum += (data[i] + data[i+1] + data[i+2]) / 3;
  }
  const numPixels = data.length / 4;
  const averageBrightness = sum / numPixels;
  
  // Compare to threshold
  const flashDetected = (averageBrightness > threshold);

  // Post result back
  self.postMessage({ flashDetected });
  
  // If you want a difference-based approach, you'd keep a `prevFrame`,
  // compute the sum of absolute differences, etc. This is just an example.
};