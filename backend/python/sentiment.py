import re
from flask import Flask, request, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer
from nrclex import NRCLex
import nltk
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Initialize sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

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

# Route to receive data via POST, process it, and send it back
@app.route('/process', methods=['POST'])
def process_data():
    try:
        data = request.get_json()
        if not data or 'data' not in data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        posts = data['data']
        for post in posts:
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
            "data": posts  # Return the posts with the processed comments
        }

        # Return the processed data as JSON response
        return jsonify(output_data), 200

    except Exception as e:
        print(f"Error processing data: {e}")
        return jsonify({'success': False, 'message': 'Error processing data', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)