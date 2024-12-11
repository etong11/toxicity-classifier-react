from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import accuracy_score, cohen_kappa_score, f1_score, classification_report
from sklearn.model_selection import GridSearchCV

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def hello_world():
    return "<p>Hello, World!</p>"

df = pd.read_csv('data/train.csv')
X = df['comment_text']
labels = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
df['toxic_preference'] = 0
y = None
model = None
preferences_num = None
preferences = None

count_vect = CountVectorizer()
tfidf_transformer = TfidfTransformer()

@app.route("/train", methods=["POST"])
def train():
    global model
    if y is None:
        return jsonify({"error": "Preferences not set yet"})
    
    if preferences == []:
        return jsonify({"message": "No perferences, no model set"})
    
    # Code on how to create text model from https://scikit-learn.org/1.4/tutorial/text_analytics/working_with_text_data.html
    # Used the tutorial for text preprocessing but looked into different models

    # Preprocessing the comments
    X_train_counts = count_vect.fit_transform(X)
    X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)

    # Chose LinearSVC model due to highest accuracy when evaluating on models with different preference inputs
    model = LinearSVC().fit(X_train_tfidf, y)

    # Training the model - other models used
    # model = MultinomialNB().fit(X_train_tfidf, y)
    # model = LogisticRegression(max_iter=1000).fit(X_train_tfidf, y)

    return jsonify({"message": "Model trained"})

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        if preferences == []:
            # User will see everything, nothing classified as toxic
            return jsonify({"predicted": 0})
        else:
            return jsonify({"error": "Model not trained yet"})
    
    test_input = request.json['data']
    test_input = [test_input]
    
    X_new_counts = count_vect.transform(test_input)
    X_new_tfidf = tfidf_transformer.transform(X_new_counts)

    predicted = model.predict(X_new_tfidf)

    return jsonify({"predicted": int(predicted[0])})

@app.route("/setPreferences", methods=["POST"])
def setPreferences():
    global df, y, preferences_num, preferences
    # Set the y value to match the preferences
    preferences_num = request.json['preferences']

    preferences_bool = [bool(preference) for preference in preferences_num]
    preferences = [labels[i] for i in range(len(labels)) if preferences_bool[i]]
    df['toxic_preference'] = df[preferences].any(axis=1).astype(int)
    y = df['toxic_preference']

    return train()

@app.route("/getExamples", methods=["GET"])
def getExamples():
    examples = {}
    samples = []
    for label in labels:
        if label == 'severe_toxic':
            # There exists no data where only severe_toxic is present
            condition = (df['toxic'] == 1) & (df['severe_toxic'] == 1) & (df[labels].sum(axis=1) == 2)
        else:
            condition = (df[label] == 1) & (df[labels].sum(axis=1) == 1)
        examples[label] = df[condition]['comment_text']
        sample = (examples[label]).sample().tolist()[0]
        samples.append(sample)

    # print("these samples")
    # print(samples)
    return jsonify({"examples": samples})

@app.route("/evaluate", methods=["GET"])
def evaluate():
    # Testing the model
    if model is None:
        if preferences == []:
            # User will see everything, nothing classified as toxic
            return jsonify({"accuracy": 0})
        else:
            return jsonify({"error": "Model not trained yet"})
        
    df_test = pd.read_csv('data/test.csv')
    df_test_labels = pd.read_csv('data/test_labels.csv')
    df_test['toxic_preference'] = 0
    df_test['toxic_preference'] = df_test_labels[preferences].any(axis=1).astype(int)

    X_test = df_test['comment_text']
    y_test = df_test['toxic_preference']

    X_test_counts = count_vect.transform(X_test)
    X_test_tfidf = tfidf_transformer.transform(X_test_counts)
    predicted = model.predict(X_test_tfidf)

    # error_rate = (y_test != predicted).mean()
    # print("Error rate: ", error_rate)
    # print("classification_report: ", classification_report(y_test, predicted))
    print("accuracy_score: ", accuracy_score(y_test, predicted))

    return jsonify({"accuracy": accuracy_score(y_test, predicted)})

if __name__ == "__main__":
    app.run(debug=True)