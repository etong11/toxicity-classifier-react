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