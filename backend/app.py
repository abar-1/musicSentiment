from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import re
from emotion_model import make_model, detect_emotion_with_stability
import subprocess


app = Flask(__name__) #Flask constructor
CORS(app)

model = make_model()
model_path = "model_weights_training_optimal.weights.h5"
model.load_weights(model_path)


@app.route('/run_python', methods=['POST'])
def run_python():
    data = request.get_json()
    script_path = data['script_path']
    try:
        result = subprocess.run(['python', 'emotion_model.py'], capture_output=True, text=True, check=True)
        return jsonify({'output': result.stdout, 'error': result.stderr})
    except subprocess.CalledProcessError as e:
         return jsonify({'output': e.stdout, 'error': e.stderr}), 500
    except FileNotFoundError:
        return jsonify({'error': 'Python script not found'}), 404

def analyze():
    try:
        data = request.json
        image_data = data['image']
        image_data = re.sub('^data:image/.+base64,', '', image_data)
        decoded = base64.b64decode(image_data)
        np_data = np.frombuffer(decoded, np.uint8)
        img = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

        processed_frame = detect_emotion_with_stability(img, model)
        from emotion_model import current_emotion
        return jsonify({"emotion": current_emotion})
    except Exception as e:
        print("Error", e)
        return jsonify({"error": str(e)}), 500

if __name__=='__main__':
    app.run(debug=True)

