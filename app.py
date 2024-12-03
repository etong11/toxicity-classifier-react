from flask import Flask, jsonify, request
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

# Code on how to create text model from https://scikit-learn.org/1.4/tutorial/text_analytics/working_with_text_data.html

# Preprocessing the comments
from sklearn.feature_extraction.text import CountVectorizer
count_vect = CountVectorizer()
X_train_counts = count_vect.fit_transform(X)

from sklearn.feature_extraction.text import TfidfTransformer
tfidf_transformer = TfidfTransformer()
X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)

# Training the model
from sklearn.naive_bayes import MultinomialNB
clf = MultinomialNB().fit(X_train_tfidf, y)

@app.route("/predict", methods=["POST"])
def predict():
    test_input = request.json['data']
    test_input = [test_input]
    
    X_new_counts = count_vect.transform(test_input)
    X_new_tfidf = tfidf_transformer.transform(X_new_counts)

    predicted = clf.predict(X_new_tfidf)

    return jsonify({"predicted": int(predicted[0])})

    # return jsonify({"shape": X.shape})

if __name__ == "__main__":
    app.run(debug=True)