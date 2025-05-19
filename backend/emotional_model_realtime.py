import cv2, time, os

from emotional_model_core import make_model, detect_emotion_with_stability
import numpy as np

emotion_threshold = 1
def detect_emotion_with_stability(frame, model):
    """Detect emotions in a frame with time-based stability"""
    global current_emotion, emotion_start_time, emotion_threshold

    # Dictionary which assigns each label an emotion (alphabetical order)
    emotion_dict = {0: "Angry", 1: "Happy", 2: "Sad", 3: "Calm"}

    # prevent usage and unnecessary logging messages
    cv2.ocl.setUseOpenCL(False)

    # Face detection
    facecasc = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facecasc.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        # Draw rectangle around face
        cv2.rectangle(frame, (x, y-50), (x+w, y+h+10), (255, 0, 255), 3)

        # Extract face region
        roi_gray = gray[y:y + h, x:x + w]

        # Preprocess for model
        try:
            cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0) / 255.0

            # Get model prediction
            prediction = model.predict(cropped_img, verbose=0)
            maxindex = int(np.argmax(prediction))
            detected_emotion = emotion_dict[maxindex]
            confidence = float(prediction[0][maxindex])

            # Apply emotion stability logic
            current_time = time.time()

            # First detection ever
            if current_emotion is None:
                current_emotion = detected_emotion
                emotion_start_time = current_time
            # New emotion detected
            elif current_emotion != detected_emotion:
                # Only switch if the new emotion has been consistent for the threshold time
                if current_time - emotion_start_time >= emotion_threshold:
                    # Reset timer and update emotion
                    current_emotion = detected_emotion
                    emotion_start_time = current_time
                # If not consistent for threshold time, keep current emotion
            # Same emotion detected - do nothing, keep current emotion

            # Display the emotion with confidence
            display_text = f"{current_emotion} ({confidence:.2f})"
            cv2.putText(frame, display_text, (x+20, y-60),
                      cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
        except Exception as e:
            print(f"Error processing face: {e}")

    return frame

def emotion_recog_webcam(model):
    # Start video capture from webcam
    cap = cv2.VideoCapture(0)

    # Reset emotion stability variables
    global current_emotion, emotion_start_time
    current_emotion = None
    emotion_start_time = time.time()

    print("Press 'q' to exit")

    while True:
        # Read a frame from the webcam
        ret, frame = cap.read()

        if not ret:
            print("Failed to grab frame")
            break

        # Process the frame and detect emotions with stability
        result_frame = detect_emotion_with_stability(frame, model)

        # Display the result
        cv2.namedWindow("Mood Analysis", cv2.WINDOW_NORMAL) 
        cv2.imshow("Mood Analysis", result_frame)

        # Exit on pressing 'q' key
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the webcam and close windows
    cap.release()
    cv2.destroyAllWindows()

# For single image emotion recognition
def emotion_recog(frame, model):
    """Emotion recognition for a single frame"""
    # Load the model weights
    if not os.path.exists('model_weights_training_optimal.h5'):
        print("No model weights found. Please train the model first.")
        return frame

    # Process the frame with the stability logic
    return detect_emotion_with_stability(frame, model)