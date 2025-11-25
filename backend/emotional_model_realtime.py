import cv2, time, os

from emotional_model_core import make_model, detect_emotion
import numpy as np

emotion_threshold = 1
def detect_emotion(frame, model, state, threshold=1.0):
    """Detect emotion in a frame. State = (current_emotion, start_time)"""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    facecasc = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = facecasc.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    current_emotion, emotion_start_time = state

    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        cropped = cv2.resize(roi_gray, (48, 48)).reshape(1,48,48,1)/255.0
        pred = model.predict(cropped, verbose=0)
        maxidx = int(np.argmax(pred))
        detected = {0:"Angry",1:"Happy",2:"Sad",3:"Calm"}[maxidx]
        conf = float(pred[0][maxidx])

        now = time.time()
        if current_emotion != detected or current_emotion is None:
            if now - emotion_start_time >= threshold:
                current_emotion = detected
                emotion_start_time = now

        cv2.putText(frame, f"{current_emotion} ({conf:.2f})", (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

    return frame, (current_emotion, emotion_start_time)

def emotion_recog_webcam(model, duration=10):
    # Start video capture from webcam
    cap = cv2.VideoCapture(0)

    start_time = time.time()
    emotions = []

    # Reset emotion stability variables
    global current_emotion, emotion_start_time
    current_emotion = None
    emotion_start_time = time.time()

    state = (None, time.time())
    emotions = []
    while time.time() - start_time < duration:  # Run for 15 seconds
        ret, frame = cap.read()
        if not ret:
            break

        frame, state = detect_emotion(frame, model, state)
        current_emotion, _ = state
        if current_emotion is not None:
            emotions.append(current_emotion)

        #cv2.namedWindow("Mood Analysis", cv2.WINDOW_NORMAL)
        #cv2.imshow("Mood Analysis", frame)

        #if cv2.waitKey(1) & 0xFF == ord('q'):
            #break


    # Release the webcam and close windows
    cap.release()
    cv2.destroyAllWindows()
    if not emotions: 
        return "No emotions detected"

    from collections import Counter
    counts = Counter(emotions)
    result = f"Detected emotion is: {counts.most_common(1)[0][0]}"
    return counts.most_common(1)[0][0]

# For single image emotion recognition
# For single image recognition
def emotion_recog(frame, model):
    """Emotion recognition for a single frame"""
    if model is None:
        print("Model not loaded")
        return "No model"
    state = (None, time.time())
    frame, state = detect_emotion(frame, model, state)
    return state[0]  # Returns current emotion
