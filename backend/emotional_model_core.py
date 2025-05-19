# emotion_model_core.py
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dropout, Flatten, Dense
from tensorflow.keras.optimizers import Adam
import numpy as np
import cv2
import time

emotion_dict = {0: "Angry", 1: "Happy", 2: "Sad", 3: "Calm"}

def make_model():
    model = Sequential()
    model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(48,48,1)))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2, 2)))
    model.add(Dropout(0.25))
    model.add(Conv2D(128, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2, 2)))
    model.add(Conv2D(128, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2, 2)))
    model.add(Dropout(0.25))
    model.add(Flatten())
    model.add(Dense(1024, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(4, activation='softmax'))
    model.compile(loss='sparse_categorical_crossentropy',
                  optimizer=Adam(learning_rate=0.0001),
                  metrics=['accuracy'])
    return model

def detect_emotion_with_stability(frame, model, state):
    """Detect emotion with time-based stability."""
    current_emotion, emotion_start_time = state
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    facecasc = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = facecasc.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        try:
            cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0) / 255.0
            prediction = model.predict(cropped_img, verbose=0)
            maxindex = int(np.argmax(prediction))
            detected_emotion = emotion_dict[maxindex]
            confidence = float(prediction[0][maxindex])
            now = time.time()
            if current_emotion is None or current_emotion != detected_emotion:
                if now - emotion_start_time >= 1.5:
                    current_emotion = detected_emotion
                    emotion_start_time = now
            display_text = f"{current_emotion} ({confidence:.2f})"
            cv2.putText(frame, display_text, (x+20, y-60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
        except:
            continue

    return frame, (current_emotion, emotion_start_time)
