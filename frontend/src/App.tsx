import React, {useState, useEffect} from 'react';
import './App.css';

import axios from 'axios';

const labels = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate'];

function App(){

  const [activeTab, setActiveTab] = useState<string>('toggles');
  const [toggleStates, setToggleStates] = useState<boolean[]>(
    Array(5).fill(false) // Initial state for 5 toggles
  );
  const  [value, setValue] = useState("Sentence");

  const handleToggleChange = (index: number) => {
    const updatedToggles = [...toggleStates];
    updatedToggles[index] = !updatedToggles[index];
    setToggleStates(updatedToggles);
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
                  checked={toggleStates[index]}
                  onChange={() => handleToggleChange(index)}
                />
                <span className="slider"></span>
              </label>
              <span className="label">{label}</span>
            </div>
          ))}
        </div>
      );
    } else {
      return <div>This tab is blank.</div>;
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
        Blank Tab
      </button>
    </div>
    <div style={{ border: '1px solid #ccc', padding: '20px' }}>
      {renderTabContent()}
    </div>
  </div>
  );
}

export default App;
