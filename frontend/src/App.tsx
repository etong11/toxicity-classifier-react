import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const labels = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate'];
const textExamples = [
  'This is an example of toxic behavior.',
  'This is an example of severe toxic behavior.',
  'This is an example of obscene language.',
  'This is an example of a threat.',
  'This is an example of an insult.',
  'This is an example of identity hate.',
];

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

  const setPreferences = async () => {
    try {
      setIsTraining(true);
      const response = await axios.post('http://127.0.0.1:5000/setPreferences', {
        preferences: toggleStates,
      });
      // const responseData = await response.json();
      const responseData = response.data;
      console.log("responseData", responseData);
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
          setPrediction('The text is not toxic.');
        } else if (responseData.predicted === 1) {
          setPrediction('The text is toxic.');
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
          width: '1000px',
          height: '350px',
          maxWidth: '90%',
          maxHeight: '90%'
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
    if (tab === 'blank') {
      setModalOpen(true);
    }
  };

  const handleToggleChange = (index: number) => {
    const updatedToggles = [...toggleStates];
    updatedToggles[index] = updatedToggles[index] === 0 ? 1 : 0;
    setToggleStates(updatedToggles);
    console.log(`Label: ${labels[index]}, Value: ${updatedToggles[index]}`);

    if (updatedToggles[index] === 1) {
      setActiveText(textExamples[index]);
    } else if (activeText === textExamples[index]) {
      setActiveText('');
    }
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
      <button onClick={setPreferences}>Set Preferences</button>
      </div>
    )
  }

  const renderTabContent = () => {
    if (activeTab === 'toggles') {
      return (
        <div>
          {isTraining && renderTrainingPopup()}
          {renderToggleOnboarding()}
          <div className="example-textbox">
            <textarea
              value={activeText}
              onChange={(e) => setActiveText(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
              }}
              placeholder="Toggle a label to see an example sentence."
            />
          </div>
          <button onClick={getPrediction}>Get Prediction</button>
          <div className="prediction">
            <h2>Prediction</h2>
            <p>{prediction}</p>
          </div>
        </div>
      );
    } else {
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
      );
    }
  };

  // Modal component
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
          height: '350px',
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
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}>
            <button 
              onClick={() => setModalOpen(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Agree
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: "You suck!" })
        });
        const responseData = await response.json();
        console.log(responseData);
        setValue(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Modal Component */}
      <Modal />

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