from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import threading
import numpy as np
import pandas as pd
from emotional_model_core import make_model
from emotional_model_realtime import emotion_recog_webcam
from songs import getSongs, create_playlist
import subprocess


app = Flask(__name__) 
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


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

@app.route('/run_python', methods=['POST'])
def run_python():
    global model, model_ready
    if not model_ready or model is None:
        warmup_model()  # synchronous
        if not model_ready:
            return jsonify({'error': 'Model failed to load'}), 500

    try:
        result = emotion_recog_webcam(model)  # headless
        return jsonify({'output': result, 'error': None})
    except Exception as e:
        return jsonify({'output': None, 'error': str(e)}), 500

    
@app.route('/get_songs', methods=['POST'])
def get_songs():
    try:
        data = request.json
        user_mood = data.get('user_mood', '')
        genres = data.get('genres', [])  # optional
        database = data.get('database')  

        # Load dataset
        if database:
            df = pd.DataFrame(database)
        else:
            df = pd.read_csv("final_data.csv")

        # Use filtered genres if provided
        if not genres:
            # fallback: all genres
            genres = df['genre'].unique().tolist()

        # Filter songs by mood and genres
        filtered_df = df[(df['Mood'] == user_mood) & (df['genre'].isin(genres))]

        # Sample up to 20 songs
        if len(filtered_df) == 0:
            recommended_songs = []
        else:
            recommended_songs = [
                {
                    "track_name": row["track_name"],
                    "track_artist": row["artist_name"],
                    "track_id": row["track_id"]
                }
                for _, row in filtered_df.sample(min(20, len(filtered_df))).iterrows()
            ]

        return jsonify({'status': 'Ready', 'songs': recommended_songs})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
        app.run(debug=True)
