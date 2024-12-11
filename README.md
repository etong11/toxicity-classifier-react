# User-Centered Content Moderation - Toxicity Classifier
Made by Emma Tong (eltong) & Eunice Lee (eylee2)
This project was inspired by the Facebook Feed case study and FeedVis tool studied in class when examining Transparency of Existence in Human-AI design. 
The dataset we used was from Kaggle as a part of a [Toxic Comment Classification Challenge](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/overview), which we sourced from our inital codebase that we intended to edit. This initial codebase was Tensorflow's [Toxicity Classifier demo](https://github.com/tensorflow/tfjs-models/tree/master/toxicity/demo). We ended up not using this codebase and model, since we couldn't modify the model the way we wanted to fit our project goals & we wanted. 

Instead, we ended up developing our codebase without open-source code to build upon but looked to the Tensorflow demo and dataset for an idea of some features to showcase in our project and UI (e.g. the toxicity labels, having a classifier). 

For our front end, we built a native React app to develop our two interfaces: toggle & example. The toggle interface allows the user the freedom to select which toxicity categories they want to be shown, while the examples category functions similarly to the toggle interface but showcases examples of the text to provide additional context for the user. 
We read through a paper that our TA Seyun recommended, titled _Personalizing Content Moderation on Social Media: User Perspectives on Moderation Choices, Interface Design, and Labor_ by Jhaver, S. et al ([link]([url](https://arxiv.org/abs/2305.10374))) after reciving feedback from our original project proposal. The paper served to be quite relevant to our project, so we wanted to expand on the resarch by also exploring novel interfaces that uses text examples in context of a user's moderation choices. 

For our backend, we followed our course notes/assignments and a scikit-learn tutorial on building a classifier model that would be used to classify the toxic comments we enter in our interface. While we followed the process of having to preprocess, train, and  test our dataset, we made changes to the tutorial to adapt to our Kaggle dataset and our project goals. 

This is the premise of our project, and we've included instructions on the setup of our project below so that you can test our code locally. 


# Setup
## Backend (Python)
Create a virtual environment
```
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies
```
pip install -r requirements.txt
```

## Frontend (React TS)
Move to the frontend directory and install the dependencies
```
cd frontend
npm i
```

# Running
In one terminal, run the backend (make sure you are in the virtual environment created)
```
python app.py
```

In a separate terminal (keep backend terminal open), run frontend
```
cd frontend
npm start
```
