import './App.css';
import * as ml5 from "ml5";
import Webcam from "react-webcam";
import {useEffect, useRef} from "react";
const dimensions = {
  width: 800,
  height: 500
}
function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();
  const { width, height } = dimensions;

  useEffect(() => {
    let detectionInterval;

    const modelLoaded = () => {
      webcamRef.current.video.width = width;
      webcamRef.current.video.height = height;
      canvasRef.current.width = width;
      canvasRef.current.height = height;


      detectionInterval = setInterval(() => {
        detect();
      }, 200);
    };

    const objectDetector = ml5.objectDetector('cocossd', modelLoaded);

    const detect = () => {
      if (webcamRef.current.video.readyState !== 4) {
        console.warn('Video not ready yet');
        return;
      }

      objectDetector.detect(webcamRef.current.video, (err, results) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        if (results && results.length) {
          results.forEach((detection) => {
            ctx.beginPath();
            ctx.fillStyle = "#FF0000";
            const { label, x, y, width, height } = detection;
            ctx.fillText(label, x, y - 5);
            ctx.rect(x, y, width, height);
            ctx.stroke();
          });
        }
      });
    };

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    }

  }, [width, height]);

  return (
      <div>
        <Webcam ref={webcamRef} className="webcam"/>
        <canvas ref={canvasRef} className="canvas"/>
      </div>
  );
}

export default App;
