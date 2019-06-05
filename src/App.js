import React from 'react';
import logo from './logo.svg';
import './App.css';

const API_KEY = 'MA4OHKLGGWPC2AJD';

function logStockData(symbol) {
  fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
}


function App() {

  // API TESTING...

  logStockData('AAPL');

  // ...API TESTING

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
