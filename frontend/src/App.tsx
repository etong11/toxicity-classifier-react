import React, {useState, useEffect} from 'react';
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

function App(){
  const  [value, setValue] = useState("Sentence");
  const [activeTab, setActiveTab] = useState<string>('toggles');
  const [toggleStates, setToggleStates] = useState<number[]>(
    Array(labels.length).fill(0) // Initial state for each toggle (0 is off)
  );
  const [activeText, setActiveText] = useState<string>(''); // To track active example text

  const [rowStates, setRowStates] = useState<number[]>(
    Array(labels.length).fill(0) // Initial state for table row toggles
  );



  const handleToggleChange = (index: number) => {
    const updatedToggles = [...toggleStates];
    updatedToggles[index] = updatedToggles[index] === 0 ? 1 : 0; // Toggle between 1 and 0
    setToggleStates(updatedToggles);
    console.log(`Label: ${labels[index]}, Value: ${updatedToggles[index]}`); // Debug: Log the label and value

    // Update the active text based on the toggle
    if (updatedToggles[index] === 1) {
      setActiveText(textExamples[index]);
    } else if (activeText === textExamples[index]) {
      setActiveText(''); // Clear the text if the currently displayed example is toggled off
    }
  };

  const handleRowToggleChange = (index: number) => {
    const updatedRows = [...rowStates];
    updatedRows[index] = updatedRows[index] === 0 ? 1 : 0; // Toggle between 1 and 0
    setRowStates(updatedRows);
  };

  const renderTabContent = () =>{
    if (activeTab === 'toggles') {
      return (
        <div>
          {labels.map((label, index) => (
            <div key={index} className="toggle-row">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={toggleStates[index] === 1} // Convert number to boolean
                  onChange={() => handleToggleChange(index)}
                />
                <span className="slider"></span>
              </label>
              <span className="label">{label}</span>
            </div>
          ))}
          <div className="example-textbox">
            <textarea
              value={activeText}
              readOnly
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
  }


  function handleSubmit(e: { preventDefault: () => void; target: any; }){
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
   
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  useEffect(() => {



    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/predict', {
          data: "You suck!"
        });
        console.log(response.data);
        setValue(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <form method="post" onSubmit={handleSubmit}>
    //       <label>
    //         Enter test you wish to identify: <input name = "myInput" defaultValue="Enter a toxic sentence here" />
    //       </label>
    //       <button type="submit">Submit form</button>
    //     </form>
    //     <p>
    //       Response.data 
    //       <pre>{JSON.stringify(value, null, 2)}</pre>
    //     </p>
    //   </header>
    // </div>
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('toggles')}
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
          onClick={() => setActiveTab('blank')}
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
