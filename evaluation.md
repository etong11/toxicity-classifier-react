# Choosing a Model
While we followed an existing sklearn tutorial for how to preprocess text before inputting it into a model, we experiemented with the model the tutorial gave along with other models. Then, we evaluated the accuracy of the model using `evaluate` in `app.py` to record and compare how accuracy changes across models and across different perference inputs to the model. For each model, we used the test dataset from Kaggle (`test.csv` for the text and `test_labels.csv` for the features).

As for what models we chose, we did online research about what types of models are well-suited for our dataset. From this research, we decided to explore using MultinomialNB, LinearSVC, and LogisticRegression.

## Code for Each Model
### MultinomialNB
```
model = MultinomialNB().fit(X_train_tfidf, y)
```
This was what was provided in the [sklearn tutorial](https://scikit-learn.org/1.4/tutorial/text_analytics/working_with_text_data.html) for text classification and what we started with. While this model is good for text classification, it performs poorly if the features are not independent which is the case for our dataset. Thus, we explored other alternatives.
### Linear SVC
```
model = LinearSVC().fit(X_train_tfidf, y)
```
This model is simple and efficient which fits our purposes with the user constantly changing their inputted preferences. It also performs well on high-dimensional data and is used for classification tasks.
### LogisticRegression
```
model = LogisticRegression(max_iter=1000).fit(X_train_tfidf, y)
```
We wanted to explore using this model since it is relatively simplistic which could prevent the model from overfitting to the data. It also is what we used in our class assignments so it was a good baseline to compare.

### Other Models
We also experimented with using GridSearchSVC to optimize the hyperparameters of MultinomialNB, LinearSVC, and LogisticRegression but we found that this resulted in longer processing times and didn't improve the accuracy of the model with the default hyperparameters by much.

## Evaluation
### Accuracy of Different Models and Single Preference Inputs (only uses one feature)
| Model    | toxic | severe_toxic | obscene | threat | insult | identity_hate |
| -------- | ------- | ------- | ------- | ------- | ------- | ------- | 
| MultinomialNB | 0.41112794129168734 | 0.41533258468047324 | 0.4047360998668094 | 0.4163380428821394 | 0.39924525345381423 | 0.4130670392520436 |
| LinearSVC | 0.5305293672142278 | 0.42146979708025384 | 0.48734689613747356 | 0.4177939985897469 | 0.46263482280431434 | 0.41996160977775454 |
| LogisticRegression | 0.510250450497506 | 0.42079731529602254 | 0.4737209788200883 | 0.41737614583061294 | 0.4538795017105847 | 0.4182836697918571 |

### Accuracy of Different Models and Double Preference Inputs (only uses two features, non-exhaustive)
| Model    | [toxic, severe_toxic] | [obscene, threat] | [insult, identity_hate]
| -------- | ------- | ------- | ------- |
| MultinomialNB | 0.41112794129168734 | 0.4045532892846883 | 0.3989971533780784 |
| LinearSVC | 0.5305293672142278 | 0.4877582199472461 | 0.4645673918153091 |
| LogisticRegression | 0.510250450497506 | 0.4752422240213105 | 0.4554725653547831 |

### Accuracy of Different Models and All Preference Inputs (uses all features)
| Model    | all |
| -------- | ------- |
| MultinomialNB | 0.4168211851348881 |
| LinearSVC | 0.5380180721318325 |
| LogisticRegression | 0.5169752683398188 |

## Conclusion
Based off of these accuracy measures on the test dataset, we decided to use LinearSVC as our model due to its higher accuracy than the other models. We were surprised that LogisticRegression performed better than MultinomialNB, the model given in the tutorial, and even almost similar to LinearSVC.
