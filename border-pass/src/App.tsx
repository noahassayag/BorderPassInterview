import React from "react";
import "./App.css";
import Questionnaire from "./components/Questionnaire";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Questionnaire App</h1>
      </header>
      <Questionnaire />
    </div>
  );
};

export default App;
