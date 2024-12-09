# User-Centered Content Moderation - Toxicity Classifier
Made by Emma Tong (eltong) & Eunice Lee (eylee2)
This project was inspired by the Facebook Feed case study and FeedVis tool studied in class when examining Transparency of Existence in Human-AI design. 
The dataset we used was from Kaggle as a part of a [Toxic Comment Classification Challenge](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/overview), which we sourced from our inital codebase that we intended to edit. This initial codebase was Tensorflow's [Toxicity Classifier demo](https://github.com/tensorflow/tfjs-models/tree/master/toxicity/demo). We ended up not using this codebase and model, since we couldn't modify the model the way we wanted to fit our project goals & we wanted. 

Instead, we ended up 

For our front end, we built a native React app to develop our two interfaces: toggle & example. The toggle interface allows the user the freedom to select which toxicity categories they want to be shown, while the examples category functions similarly to the toggle interface but showcases examples of the text to provide additional context for the user. 

what open-source code you imported (if any)
what changes you made
what new code you implemented (If you built your application based on any open-source initial code, we expect you make nontrivial changes to the code.) 


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
