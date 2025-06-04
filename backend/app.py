from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import cv2, threading
import numpy as np
import pandas as pd
from emotional_model_core import make_model
from emotional_model_realtime import emotion_recog_webcam
from songs import getSongs, create_playlist
import subprocess


app = Flask(__name__) 
CORS(app)

# Initialize global variables
model = None
model_ready = False
is_warming_up = False

def warmup_model():
    global model, model_ready, is_warming_up
    is_warming_up = True
    try:
        model = make_model()
        model_path = "model_weights_training_optimal.weights.h5"
        model.load_weights(model_path)
        model_ready=True
    except Exception as e:
        print("Error warming up model: ", e)
        model_ready = False
    is_warming_up = False

@app.route('/warmup', methods=['GET'])
def warmup():
    global model_ready, is_warming_up
    if not model_ready and not is_warming_up:
        threading.Thread(target=warmup_model).start()
        return jsonify({"status": "Warming up"})
    return jsonify({"status" : "Ready" if model_ready else "Warming up"})

@app.route('/run_python', methods=['POST', 'GET'])
def run_python():
    data = request.get_json()
    script_path = data['script_path']
    try:
        result = emotion_recog_webcam(model)
        return jsonify({'output': result, 'error': None})
    except subprocess.CalledProcessError as e:
         return jsonify({'output': None, 'error': str(e)}), 500
    except FileNotFoundError:
        return jsonify({'error': 'Python script not found'}), 404
    


@app.route('/get_songs', methods=['POST'])
def get_songs():
    try:
        data = request.json
        genres = data.get('genres', [])
        user_mood = data.get('user_mood', '')
        database = data.get('database')
        df = pd.DataFrame(database)
        result = create_playlist(user_mood)
        print(result)
        return jsonify({'status': 'Ready', 'songs': result})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__=='__main__':
    app.run(debug=True)

