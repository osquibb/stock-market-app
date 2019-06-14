import React from 'react';
import { ALPHA_VANTAGE_API_KEY } from '../config';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';

// props: stock='MSFT', range='1D' (1D, 10D, 1M, 3M, 1Y, Max)

const CurrencyDataContainer = styled.div`
height: 30vh;
justify-content: center;
min-width: 200px;
min-height: 140px
background-color: #20375B;
border-radius: 15px;
`;

const CurrencyDataTitle = styled.h4`
height: 60px;
padding-top: 10px;
text-align: center;
color: white;
`;

const CurrencyData = styled.h6`
text-align: center;
color: white;
`;

const Filler = styled.div`
height: 98px;
width: 100%;
`;

const CurrencyInput = styled.input`
border-radius: 5px;
margin-top: 20px;
margin-bottom: 10px;
padding-left: 5px;
width: 240px;
border: 1px solid black;
background-color: #346E83;
color: white;
::placeholder {
  color: white;
}
&:focus {
  outline: none;
}
&:hover {
  border-color: white;
}
`;


export default class CurrencyCell extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
                  inputText: '',
                  fromCurrency: '',
                  toCurrency: '',
                  exchangeRate: 'N/A',
                  date: '' 
                };
    this.selectCurrencies = this.selectCurrencies.bind(this);
  }

  selectCurrencies(e) {
    if (e.keyCode === 13) {
      this.setState({inputText: e.target.value}, () => {
        const fromCurrency = this.state.inputText.split(' ')[0].toUpperCase();
        const toCurrency = this.state.inputText.split(' ')[1].toUpperCase();
        this.getCurrencyData(fromCurrency, toCurrency);
      });
    }
  }

  getCurrencyData(fromCurrency, toCurrency) {
    console.log('called');
    fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${ALPHA_VANTAGE_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if(!data) {
        return;
      }
      const exchangeRate = data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
      const date = data["Realtime Currency Exchange Rate"]["6. Last Refreshed"].split(' ')[0];
      const fromCurrency = data["Realtime Currency Exchange Rate"]["1. From_Currency Code"];
      const toCurrency = data["Realtime Currency Exchange Rate"]["3. To_Currency Code"];

      this.setState({exchangeRate, date, fromCurrency, toCurrency});
    })
    .catch(error => console.log(error));
  }

  render() {    
    return(
      <React.Fragment>
        <Row className="justify-content-center" hidden={this.state.exchangeRate !== 'N/A'}>
          <CurrencyInput 
            placeholder="Enter currencies..."
            onKeyDown={this.selectCurrencies}
          />
          <p>* Separated by a space (eg: "USD EUR")</p>
        </Row>
        <Row hidden={this.state.exchangeRate === 'N/A'}>
          <Filler />
        </Row>
        <Row>
          <Col>
            <CurrencyDataContainer>
              <CurrencyDataTitle>{this.state.fromCurrency} - {this.state.toCurrency}</CurrencyDataTitle>
              <CurrencyData>Exchange Rate: {this.state.exchangeRate === 'N/A' ? 'N/A' : Math.round(this.state.exchangeRate*100)/100}</CurrencyData>
              <CurrencyData>{this.state.date}</CurrencyData>
            </CurrencyDataContainer>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
