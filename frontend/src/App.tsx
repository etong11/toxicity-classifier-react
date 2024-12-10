import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const labels = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate'];

function App() {
  const [value, setValue] = useState("Sentence");
  const [activeTab, setActiveTab] = useState<string>('toggles');
  const [toggleStates, setToggleStates] = useState<number[]>(
    Array(labels.length).fill(0)
  );
  const [activeText, setActiveText] = useState<string>('');
  const [rowStates, setRowStates] = useState<number[]>(
    Array(labels.length).fill(0)
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);
  const [prediction, setPrediction] = useState<string>('');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [textExamples, setExamples] = useState<string[]>([]);

  const getTestExamples = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/getExamples');
      const responseData = response.data;
      console.log("responseData", responseData);
      setExamples(responseData.examples);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const setPreferences = async () => {
    try {
      setIsTraining(true);
      var inputPreferences = rowStates;
      if (activeTab === 'toggles') {
        inputPreferences = toggleStates;
      }
      const response = await axios.post('http://127.0.0.1:5000/setPreferences', {
        preferences: inputPreferences,
      });
      const responseData = response.data;
      console.log("setPreferences", responseData);
      setValue(responseData);
      setIsOnboarding(false);
      setIsTraining(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getPrediction = async () => {
    try {
      console.log("activeText", activeText);
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        data: activeText,
      });
      const responseData = response.data;
      console.log("responseData", responseData);
      if (responseData != null) {
        if (responseData.predicted === 0) {
          setPrediction('not toxic');
        } else if (responseData.predicted === 1) {
          setPrediction('toxic');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Popup while model is being trained
  const renderTrainingPopup = () => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '90%',
          maxHeight: '90%',
          textAlign: 'center'
        }}>
          <h2>Training Model...</h2>
          <p>
          The model is currently being trained based on your preferences. Please wait.
          </p>
        </div>
      </div>
    );
  }

  // Modify the setActiveTab to open modal when 'blank' tab is selected
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsOnboarding(true);
    setPrediction('');
    setActiveText('');
    setExamples([]);

    if (tab === 'blank') {
      setModalOpen(true);
    }
  };

  const handleToggleChange = (index: number) => {
    const updatedToggles = [...toggleStates];
    updatedToggles[index] = updatedToggles[index] === 0 ? 1 : 0;
    setToggleStates(updatedToggles);
    console.log(`Label: ${labels[index]}, Value: ${updatedToggles[index]}`);
  };

  const handleRowToggleChange = (index: number) => {
    const updatedRows = [...rowStates];
    updatedRows[index] = updatedRows[index] === 0 ? 1 : 0;
    setRowStates(updatedRows);
  };

  const renderToggleOnboarding = () => {
    return (
      <div>
      {labels.map((label, index) => (
        <div key={index} className="toggle-row">
          <label className="switch">
            <input
              type="checkbox"
              checked={toggleStates[index] === 1}
              onChange={() => handleToggleChange(index)}
            />
            <span className="slider"></span>
          </label>
          <span className="label">{label}</span>
        </div>
      ))}
      </div>
    )
  }

  const renderTextbox = () => {
    return (
      <div>
      <h2>Test Model</h2>
        <p>Enter any comment in the textbox below to see if the model that has been
          trained on your preferences will show it to you or not.
        </p>
      <div className="example-textbox">
            <textarea
              value={activeText}
              onChange={(e) => setActiveText(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                marginTop: '20px',
                marginBottom: '20px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button className="general" onClick={getPrediction}>Get Prediction</button>
        </div>
    )
  }

  const renderPredictionOutput = () => {
    return (
    <div className="prediction" id={`${prediction === 'toxic' ? prediction : 'not-toxic'}`}>
      <p>Based on your content moderation preferences, our model has determined that the input text is: 
      <b> {prediction}</b>.
      </p>
      {prediction === 'toxic' && (
        <p>
          You would not be shown this text in your comment section/feed.
        </p>
      )}
      {prediction === 'not toxic' && (
        <p>
          You would be shown this text in your comment section/feed.
        </p>
      )}
    </div>
    )
  }

  const renderToxicityTable = () => {
    return (
      <table className="toxicity-table">
          <thead>
            <tr>
              <th>Toxicity Label</th>
              <th>Text Example</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, index) => (
              <tr key={index}>
                <td>
                  <button
                    onClick={() => handleRowToggleChange(index)}
                    className={`row-toggle ${rowStates[index] === 1 ? 'active' : ''}`}
                  >
                    {label}
                  </button>
                </td>
                <td>{textExamples[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
    )};

  const renderTabContent = () => {
    if (activeTab === 'toggles') {
      return (
        <div>
          <h2>Set Content Moderation Preferences</h2>
          <p>
            Please select the types of toxic content you would like to not see.
          </p>
          {renderToggleOnboarding()}
          <button className="general" onClick={setPreferences}>Save Preferences</button>
          
          <hr style={{ margin: '20px 0' }} />

          {renderTextbox()}
          {prediction != "" && renderPredictionOutput()}
        </div>
      );
    } else {
      return (
        <div>
        <h2>Set Content Moderation Preferences</h2>
        <p>
          Examples of each category of toxic language from the dataset that the model will be trained on are shown below.
          Please select the types of toxic content you would like to not see.
        </p>
        {renderToxicityTable()}
        <button className="general" onClick={setPreferences}>Save Preferences</button>
        {renderTextbox()}
        {prediction != "" && renderPredictionOutput()}
        </div>
      );
    }
  };

  const handleAgreeButtonClick = async () => {
    setModalOpen(false);
    getTestExamples();
  }

  const handleDisagreeButtonClick = () => {
    setModalOpen(false);
    setActiveTab('toggles');
  }

  // Modal component for disclaimer
  const Modal = () => {
    if (!modalOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          width: '1000px',
          maxWidth: '90%',
          maxHeight: '90%'
        }}>
          <h2>Toxicity Examples</h2>
          <p>
          This section is dedicated to showcasing examples of toxic language, 
          categorized into various types such as threats, insults, identity-based hate, 
          and more. These examples are provided to help you better understand the nature 
          and nuances of toxic communication.
          </p>
          <p>
          Please note that while these examples are representative, 
          they are intended solely for educational and awareness purposes. Reviewing these examples will 
          provide insights into how language can manifest in harmful ways, aiding in identifying and 
          addressing toxicity effectively.
          </p>
          <p>
          By clicking "Agree", you acknowledge that you understand that you will be exposed to examples of toxic language.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}>
            <button className="general"
              onClick={() => handleAgreeButtonClick()}
            >
              Agree
            </button>
            <button className="disagree"
              onClick={() => handleDisagreeButtonClick()}
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <Modal />
      {isTraining && renderTrainingPopup()}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <button
          onClick={() => handleTabChange('toggles')}
          style={{
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'toggles' ? '#ddd' : '#fff',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        >
          Toggles
        </button>
        <button
          onClick={() => handleTabChange('blank')}
          style={{
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'blank' ? '#ddd' : '#fff',
            border: '1px solid #ccc',
          }}
        >
          Examples
        </button>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;