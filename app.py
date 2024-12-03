from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def hello_world():
    return "<p>Hello, World!</p>"

df = pd.read_csv('data/train.csv')
X = df['comment_text']
# y = df[['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']]
y = df['toxic']

# Preprocessing the comments
# from sklearn.feature_extraction.text import CountVectorizer
# count_vect = CountVectorizer()
# X_train_counts = count_vect.fit_transform(X)
# X_train_counts.shape

@app.route("/predict", methods=["GET"])
def predict():
    # return X.shape
    return jsonify({"shape": X.shape})

if __name__ == "__main__":
    app.run(debug=True)