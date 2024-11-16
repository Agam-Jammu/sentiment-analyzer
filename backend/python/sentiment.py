import re
import requests
from nltk.sentiment import SentimentIntensityAnalyzer
from nrclex import NRCLex
import nltk
import numpy as np
import json
# Uncomment the following lines if you want to use profanity filtering
# from better_profanity import profanity

# Configuration
NODE_API_URL = "http://localhost:3000/api/reddit"  # Node.js API base URL
MICROSERVICE_API_URL = "http://localhost:3000/api/saveData"  # Microservice API endpoint

# Initialize sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Uncomment if using profanity filtering
# profanity.load_censor_words()

# Function to fetch data from Node.js API
def get_data(subreddit):
    """
    Fetch data for the specified subreddit using the Node.js API.
    """
    try:
        response = requests.get(f"{NODE_API_URL}/{subreddit}")
        response.raise_for_status()

        data = response.json()
        if data['success']:
            print(f"Fetched data from subreddit '{subreddit}'")
            return data['data']
        else:
            print(f"API error: {data.get('message', 'Unknown error')}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error communicating with Node.js API: {e}")
        return None

# Function to clean and preprocess text
def preprocess_text(text):
    # Remove markdown links but keep the link text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    # Remove blockquotes
    text = re.sub(r'^>+', '', text, flags=re.MULTILINE)
    # Remove other markdown formatting
    text = re.sub(r'(\*{1,3}|_{1,3}|`{1,3}|~{2}|#+)', '', text)
    # Remove markdown lists
    text = re.sub(r'^\s*([-*+]|\d+\.)\s+', '', text, flags=re.MULTILINE)
    # Replace HTML entities
    text = re.sub(r'&[#\w]+;', '', text)
    # Replace non-breaking spaces and other whitespace characters with regular spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove special unicode characters
    text = text.encode('ascii', 'ignore').decode('ascii')
    # Normalize to lowercase (optional)
    # text = text.lower()
    # Strip leading/trailing whitespace
    text = text.strip()
    # Censor profanity (optional)
    # text = profanity.censor(text)
    return text

# Function to analyze sentiment using VADER
def analyze_sentiment(text):
    sentences = nltk.sent_tokenize(text)
    compound_scores = [analyzer.polarity_scores(sentence)['compound'] for sentence in sentences]
    return np.mean(compound_scores) if compound_scores else 0

# Function to analyze emotions using NRC
def analyze_emotion_nrc(text):
    emotions = NRCLex(text).affect_frequencies
    # Ensure all emotion keys are present
    all_emotions = ['anger', 'anticipation', 'disgust', 'fear', 'joy', 'negative',
                    'positive', 'sadness', 'surprise', 'trust']
    emotions_sum = {emotion: emotions.get(emotion, 0) for emotion in all_emotions}
    return emotions_sum

# Function to compute overall positivity and negativity
def compute_overall_scores(sentiment_score, emotion_scores):
    # Define positive and negative emotions
    positive_emotions = ['joy', 'trust', 'positive', 'anticipation', 'surprise']
    negative_emotions = ['anger', 'disgust', 'fear', 'sadness', 'negative']

    # Extract sentiment scores
    sentiment_pos = max(sentiment_score, 0)
    sentiment_neg = -min(sentiment_score, 0)

    # Exponent to increase scores exponentially
    exponent = 2

    # Compute positive emotion score
    positive_emotion_score = sum([emotion_scores.get(emotion, 0) ** exponent for emotion in positive_emotions])
    max_positive_emotion_score = len(positive_emotions) * (1 ** exponent)
    positive_emotion_score /= max_positive_emotion_score

    # Compute negative emotion score
    negative_emotion_score = sum([emotion_scores.get(emotion, 0) ** exponent for emotion in negative_emotions])
    max_negative_emotion_score = len(negative_emotions) * (1 ** exponent)
    negative_emotion_score /= max_negative_emotion_score

    # Define weights
    sentiment_weight = 0.6
    emotion_weight = 0.4

    # Compute overall positivity and negativity
    overall_positivity = sentiment_weight * sentiment_pos + emotion_weight * positive_emotion_score
    overall_negativity = sentiment_weight * sentiment_neg + emotion_weight * negative_emotion_score

    return overall_positivity, overall_negativity

# Main function to fetch, analyze, and send data
def process_subreddit(subreddit):
    data = get_data(subreddit)
    if not data:
        print("No data to process.")
        return

    for post in data:
        # Process comments in each post
        if 'comments' in post and post['comments']:
            for comment in post['comments']:
                if 'body' in comment:
                    # Preprocess the comment text
                    text = preprocess_text(comment['body'])
                    sentiment_score = analyze_sentiment(text)
                    emotion_scores = analyze_emotion_nrc(text)

                    # Add sentiment and emotion scores to the comment data
                    comment["sentiment_score"] = sentiment_score
                    comment.update(emotion_scores)

                    # Compute overall positivity and negativity
                    overall_positivity, overall_negativity = compute_overall_scores(sentiment_score, emotion_scores)
                    comment["overall_positivity"] = overall_positivity
                    comment["overall_negativity"] = overall_negativity
                else:
                    print(f"Comment {comment.get('id', 'unknown')} has no 'body' field.")
        else:
            print(f"Post {post.get('id', 'unknown')} has no comments.")

    # Prepare output data
    output_data = {
        "success": True,
        "data": data
    }

    # Send results to the microservice API
    try:
        response = requests.post(MICROSERVICE_API_URL, json=output_data)
        response.raise_for_status()
        print("Analysis results sent to the microservice API successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Error sending data to microservice API: {e}")

# Example usage
if __name__ == "__main__":
    process_subreddit("technology")
