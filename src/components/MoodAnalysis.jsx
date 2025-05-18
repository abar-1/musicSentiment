import React, {useState, useEffect} from "react";
import LoadingSpinner from "./LoadingSpinner";
import '../index.css';
function MoodAnalysis() {
    const [btnactive, setbtnActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
      setbtnActive(!btnactive);
      setLoading(true);
      const scriptPath = '../../backend/emotional_model.py'
      try {
        const response = await fetch('http://localhost:5000/run_python', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ script_path: "emotional_model.py" }),
        });
        setLoading(false);

        const data = await response.json();
        if (response.ok) {
             console.log('Python script output:', data.output);
        } else {
            console.error('Error running Python script:', data.error)
        }
       
    } catch (error) {
        console.error('Failed to call the server:', error);
    }
    
    };
    return(
        <div className='center-btn'>
            <button className={`toggle-btn ${btnactive ? 'active' : ''}`} onClick={() => handleClick()}> Analyze My Facial Expression</button>
            {loading && <LoadingSpinner />}
        </div>
    )
};

export default MoodAnalysis;