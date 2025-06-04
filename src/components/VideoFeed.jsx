import React, {useState, useEffect, useRef} from 'react';
import '../index.css';

function VideoFeed () {
    
    const [videofeed, setVideofeed] = useState(true);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if(videofeed){
            startWebcam();
            startSendingFrames();
        } else{
            stopWebcam();
            stopSendingWebFrames();
        }
    }, [videofeed])
    const startWebcam = () => {
        const webcam = document.getElementById('webcam');

        async function startWebcam() {
            try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            webcam.srcObject = stream;
            } catch (error) {
            console.error("Error accessing the webcam");
            }
        }

        startWebcam();
        }
    const stopWebcam = () => {
    const webcam = document.getElementById('webcam');

        async function stopWebcam() {
            try {
            stream = webcam?.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                webcam.srcObject = null;
            }
            }catch (error) {
            console.error("Error stopping the video feed");
            }
        }
    }

    async function sendFrame() {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if(!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0,0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/jpeg');

        try{
            const res = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify({image: dataURL})
            });
            const result = await res.json();
            console.log("Detected Emotion: ", result.emotion);  

        } catch(Error){
            console.error("Error sending frame", error)
        }
    }

    const startSendingFrames = () => {
        intervalRef.current = setInterval(sendFrame, 1500); // every 1.5 sec
    };

    const stopSendingFrames = () => {
        clearInterval(intervalRef.current);
    };


    return (
    <div className="center-btn">
        {videofeed &&<video id="webcam" className="webcam" autoPlay></video>}
        <button id="toggle-btn" className="toggle-btn" onClick={() => setVideofeed(prev => !prev)}> {videofeed ? 'Stop Webcam':"Start Webcam"} </button>
    </div>

    )

    
}

export default VideoFeed;
