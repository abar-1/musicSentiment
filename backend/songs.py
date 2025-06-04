import random, sys, subprocess, webbrowser
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyOAuth


def loadDataset():
    df = pd.read_csv("final_data.csv")
    return df

def getSongs(user_mood):
    #Define moods and randomly select one
    moods = ["Happy", "Angry", "Calm", "Sad"]
    detected_mood = user_mood
    print(f"Detected Mood: {detected_mood}")

    df = loadDataset();

    #Define genres and randomly select a few
    genres = ["Rock", "Pop", "Jazz", "Country", "Electronic", "Hip-Hop", "Urbano Latino",
            "Indie", "Indian", "New-Age", "K-Pop", "Spanish", "French", "Classical"]
    possible_genres = random.sample(genres, k=random.randint(1, 7))
    print(f"Selected Genres: {possible_genres}")

    #Sort and reset index
    df = df.sort_values(by=['valence', 'energy'], ascending=[False, False]).reset_index(drop=True)

    #Filter once based on mood and genres
    filtered_df = df[(df['Mood'] == detected_mood) & (df['genre'].isin(possible_genres))]

    #Sample up to 20 matching songs
    num_songs = min(20, len(filtered_df))
    if num_songs == 0:
        print("No matching songs found.")
        recommended_songs = []
    else:
        sampled_songs = filtered_df.sample(n=num_songs)
        recommended_songs = [
            {
                "track_name": row["track_name"],
                "track_artist": row["artist_name"],
                "track_id": row["track_id"]
            }
            for _, row in sampled_songs.iterrows()
        ]

    return recommended_songs

def create_playlist(user_mood):
    CLIENT_ID = 'YOUR_CLIENT_ID'
    CLIENT_SECRET = 'YOUR_CLIENT_SECRET_ID'
    REDIRECT_URI = 'https://open.spotify.com/'
    SCOPE = 'playlist-modify-public'
    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=CLIENT_ID,
                                               client_secret=CLIENT_SECRET,
                                               redirect_uri=REDIRECT_URI,
                                               scope=SCOPE))
    songs = getSongs(user_mood)

    track_ids = [track['track_id']for track in songs]

    user_id = sp.current_user()['id']
    
    playlist = sp.user_playlist_create(user=user_id, name="MoodMusicJam", public=True)
    playlist_id = playlist['id']
    playlist_url = playlist['external_urls']['spotify']
    sp.playlist_add_items(playlist_id, track_ids)

    try:
        if sys.platform.startswith('win'):  # Windows
            chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
            subprocess.run([chrome_path, playlist_url])
        elif sys.platform.startswith('darwin'):  # macOS
            subprocess.run(["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", playlist_url])
        elif sys.platform.startswith('linux'):  # Linux
            subprocess.run(["google-chrome", playlist_url])
        else:
            print("Unsupported OS. Opening in default browser instead.")
            webbrowser.open(playlist_url)
    except Exception as e:
        print("Failed to open Chrome:", e)
        webbrowser.open(playlist_url)




    


