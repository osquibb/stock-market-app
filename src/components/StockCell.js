import React from 'react';
import { ALPHA_VANTAGE_API_KEY } from '../config';
import { Line } from 'react-chartjs-2';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';

// props: stock='MSFT', range='1D' (1D, 10D, 1M, 3M, 1Y, Max)

const ChartContainer = styled.div`
height: 30vh;
min-width: 200px;
background-color: #20375B;
border-radius: 15px;
`;

const RangeButton = styled.div`

background-color: #346E83;
border-radius: 5px;
text-align: center;
margin-top: 10px;
margin-bottom: 10px;
&:hover {
  background-color: #20375B;
  color: white;
  border-color: white;
  cursor: pointer;
}
`;

const StockData = styled.div`
border-radius: 5px;
text-align: center;
margin-top: 10px;
margin-bottom: 10px;
&:hover {
  cursor: default;
}
`;

const StockInput = styled.input`
border-radius: 5px;
margin-top: 10px;
margin-bottom: 10px;
padding-left: 5px;
min-width: 200px;
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


export default class StockCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chartData: {
                    labels: [],
                    datasets: [
                      {
                        label: '',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: []
                      }
                    ]
                  },
                  price: 0,
                  change: '0%',
                  symbol: null    
    };
    this.getStockData = this.getStockData.bind(this);
    this.getQuote = this.getQuote.bind(this);
    this.selectSymbol = this.selectSymbol.bind(this);
  };

  componentDidMount() {
    console.log('Stock Cell Mounted');
  }

  selectSymbol(e) {
    if (e.keyCode === 13) {
      this.setState({symbol: e.target.value}, () => {
        this.getQuote(this.state.symbol);
        this.getStockData(this.state.symbol);
      });
    }
  }

  async getQuote(symbol) {

    let price = this.state.price;
    let change = this.state.change;

    await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          if (data["Global Quote"]) {
            price = data["Global Quote"]["05. price"];
            change = data["Global Quote"]["10. change percent"];
          }
        })
        .catch(error => console.log(error));
    
    this.setState({price: price, change: change})

  }

  async getStockData(symbol, range) {

    const chartData = {...this.state.chartData};

    let fetchURL = '';
    chartData.datasets[0].label = `${symbol} - ${range} Close`;

    switch (range) {
      case '1D':
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&apikey=${ALPHA_VANTAGE_API_KEY}`;
        chartData.labels = ['9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
        '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00'];
        
        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          if(!data) {
            return;
          }
          const propValues = new Array(chartData.labels.length);
          if (data["Meta Data"]) {
            for (let i=0; i < propValues.length; i++) {
              propValues[i] = `${data["Meta Data"]["3. Last Refreshed"].split(' ')[0]} ${chartData.labels[i]}:00`;
            }
            chartData.datasets[0].data = new Array(chartData.labels.length);
            for (let i=0; i < chartData.datasets[0].data.length; i++) {
              chartData.datasets[0].data[i] = data["Time Series (15min)"][propValues[i]] === undefined ? null : parseFloat(data["Time Series (15min)"][propValues[i]]["4. close"]);
            }
          }
        })
        .catch(error => console.log(error));

        break;
        
      case '10D':
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          if(!data) {
            return;
          }
          if (Object.keys(data)) {
            chartData.labels = Object.keys(data["Time Series (Daily)"]).slice(0,10);
            chartData.labels.reverse();
            chartData.datasets[0].data = new Array(chartData.labels.length);
            for (let i=0; i < chartData.datasets[0].data.length; i++) {
              chartData.datasets[0].data[i] = data["Time Series (Daily)"][chartData.labels[i]] === undefined ? null : parseFloat(data["Time Series (Daily)"][chartData.labels[i]]["4. close"]);
            }
          }
        })
        .catch(error => console.log(error));

        break;

      case '1M':
      
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          if(!data) {
            return;
          }
          if (Object.keys(data)) {
            chartData.labels = Object.keys(data["Time Series (Daily)"]).length >= 30 ?
            Object.keys(data["Time Series (Daily)"]).slice(0,30) :
            Object.keys(data["Time Series (Daily)"]);
            chartData.labels.reverse(); 
            chartData.datasets[0].data = new Array(chartData.labels.length);
            for (let i=0; i < chartData.datasets[0].data.length; i++) {
              chartData.datasets[0].data[i] = data["Time Series (Daily)"][chartData.labels[i]] === undefined ? null : parseFloat(data["Time Series (Daily)"][chartData.labels[i]]["4. close"]);
            }
          }
        })
        .catch(error => console.log(error));

        break;

      case '3M':
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          if(!data) {
            return;
          }
          if (Object.keys(data)) {
            chartData.labels = Object.keys(data["Weekly Time Series"]).length >= 12 ?
            Object.keys(data["Weekly Time Series"]).slice(0,12) :
            Object.keys(data["Weekly Time Series"]);
            chartData.labels.reverse(); 
            chartData.datasets[0].data = new Array(chartData.labels.length);
            for (let i=0; i < chartData.datasets[0].data.length; i++) {
              chartData.datasets[0].data[i] = data["Weekly Time Series"][chartData.labels[i]] === undefined ? null : parseFloat(data["Weekly Time Series"][chartData.labels[i]]["4. close"]);
            }
          }
        })
        .catch(error => console.log(error));
        
        break;

      case '1Y':
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          if(!data) {
            return;
          }
          if (Object.keys(data)) {
            chartData.labels = Object.keys(data["Monthly Time Series"]).length >= 12 ?
            Object.keys(data["Monthly Time Series"]).slice(0,12) :
            Object.keys(data["Monthly Time Series"]);
            chartData.labels.reverse(); 
            chartData.datasets[0].data = new Array(chartData.labels.length);
            for (let i=0; i < chartData.datasets[0].data.length; i++) {
              chartData.datasets[0].data[i] = data["Monthly Time Series"][chartData.labels[i]] === undefined ? null : parseFloat(data["Monthly Time Series"][chartData.labels[i]]["4. close"]);
            }
          }
        })
        .catch(error => console.log(error));

        break;

      default:
          fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&apikey=${ALPHA_VANTAGE_API_KEY}`;
          chartData.labels = ['9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
           '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00'];
          
          await fetch(fetchURL)
          .then(response => response.json())
          .then(data => {
          if(!data) {
            return;
          }
          const propValues = new Array(chartData.labels.length);
          if (data["Meta Data"]) {
            for (let i=0; i < propValues.length; i++) {
              propValues[i] = `${data["Meta Data"]["3. Last Refreshed"].split(' ')[0]} ${chartData.labels[i]}:00`;
            }
            chartData.datasets[0].data = new Array(chartData.labels.length);
            for (let i=0; i < chartData.datasets[0].data.length; i++) {
              chartData.datasets[0].data[i] = data["Time Series (15min)"][propValues[i]] === undefined ? null : parseFloat(data["Time Series (15min)"][propValues[i]]["4. close"]);
            }
          }
          })
          .catch(error => console.log(error));
    }

    this.setState({chartData: chartData});
   
  }

  render() {    
    return(
      <React.Fragment>
        <Row className="justify-content-center" hidden={this.state.symbol !== null}>
          <StockInput 
            placeholder="Enter ticker symbol..."
            onKeyDown={this.selectSymbol}
          />
        </Row>
          <Row hidden={this.state.symbol === null} style={{paddingLeft: 20, paddingRight: 20}}>
            <Col>
              <RangeButton
                onClick={() => this.getStockData(this.state.symbol, '1D')}>
                1D
              </RangeButton>
            </Col>
            <Col>
              <RangeButton
                onClick={() => this.getStockData(this.state.symbol, '10D')}>
                10D
              </RangeButton>
            </Col>
            <Col>
              <RangeButton
                onClick={() => this.getStockData(this.state.symbol, '1M')}>
                1M
              </RangeButton>
            </Col>
            <Col>
              <RangeButton
                onClick={() => this.getStockData(this.state.symbol, '3M')}>
                3M
              </RangeButton>
            </Col>
            <Col>
              <RangeButton
                onClick={() => this.getStockData(this.state.symbol, '1Y')}>
                1Y
              </RangeButton>
            </Col>
          </Row>
          <Row>
            <Col>
              <ChartContainer>
                <Line 
                  data={this.state.chartData}
                  options={
                    {maintainAspectRatio: false}
                  } />
              </ChartContainer>
              <Row>
                <Col>
                  <StockData><strong>Price</strong> : ${Math.round(this.state.price*100)/100}</StockData>
                  <StockData><strong>Change</strong> : <span style={{color: parseInt(this.state.change.substring(0, this.state.change.length - 1)) >= 0 ? 'green': 'red'}}>{this.state.change}</span></StockData>
                </Col>
              </Row>
            </Col>
          </Row>
      </React.Fragment>
    );
  }
}
