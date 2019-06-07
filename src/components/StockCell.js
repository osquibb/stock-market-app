import React from 'react';
import { ALPHA_VANTAGE_API_KEY } from '../config';
import { Line } from 'react-chartjs-2';
import { Row, Col } from 'reactstrap';

// props: stock='MSFT', range='1D' (1D, 5D, 1M, 3M, 1Y, Max)

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
                  }    
    };
    this.getStockData = this.getStockData.bind(this);
  };

  componentDidMount() {
    // this.getStockData(this.props.symbol, '1D');
  }

  async getStockData(symbol, range) {

    const chartData = {...this.state.chartData};

    let fetchURL = '';
    chartData.datasets[0].label = `${symbol} - ${range} Close`;

    switch (range) {
      case '1D':
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&apikey=${ALPHA_VANTAGE_API_KEY}`;
        chartData.labels = ['9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
         '1:00', '1:15', '1:30', '1:45', '2:00', '2:15', '2:30', '2:45', '3:00', '3:15', '3:30', '3:45', '4:00'];
        
        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
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
        });

        break;
        
      case '10D':
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          chartData.labels = Object.keys(data["Time Series (Daily)"]).slice(0,10);
          chartData.labels.reverse();
          chartData.datasets[0].data = new Array(chartData.labels.length);
          for (let i=0; i < chartData.datasets[0].data.length; i++) {
            chartData.datasets[0].data[i] = data["Time Series (Daily)"][chartData.labels[i]] === undefined ? null : parseFloat(data["Time Series (Daily)"][chartData.labels[i]]["4. close"]);
          }
        });

        break;

      case '1M':
      
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          chartData.labels = Object.keys(data["Time Series (Daily)"]).length >= 30 ?
            Object.keys(data["Time Series (Daily)"]).slice(0,30) :
            Object.keys(data["Time Series (Daily)"]);
          chartData.labels.reverse(); 
          chartData.datasets[0].data = new Array(chartData.labels.length);
          for (let i=0; i < chartData.datasets[0].data.length; i++) {
            chartData.datasets[0].data[i] = data["Time Series (Daily)"][chartData.labels[i]] === undefined ? null : parseFloat(data["Time Series (Daily)"][chartData.labels[i]]["4. close"]);
          }
        });

        break;

      case '3M':
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          chartData.labels = Object.keys(data["Weekly Time Series"]).length >= 12 ?
            Object.keys(data["Weekly Time Series"]).slice(0,12) :
            Object.keys(data["Weekly Time Series"]);
          chartData.labels.reverse(); 
          chartData.datasets[0].data = new Array(chartData.labels.length);
          for (let i=0; i < chartData.datasets[0].data.length; i++) {
            chartData.datasets[0].data[i] = data["Weekly Time Series"][chartData.labels[i]] === undefined ? null : parseFloat(data["Weekly Time Series"][chartData.labels[i]]["4. close"]);
          }
        });
        
        break;

      case '1Y':
        fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          chartData.labels = Object.keys(data["Monthly Time Series"]).length >= 12 ?
            Object.keys(data["Monthly Time Series"]).slice(0,12) :
            Object.keys(data["Monthly Time Series"]);
          chartData.labels.reverse(); 
          chartData.datasets[0].data = new Array(chartData.labels.length);
          for (let i=0; i < chartData.datasets[0].data.length; i++) {
            chartData.datasets[0].data[i] = data["Monthly Time Series"][chartData.labels[i]] === undefined ? null : parseFloat(data["Monthly Time Series"][chartData.labels[i]]["4. close"]);
          }
        });

        break;

      default:
          fetchURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&apikey=${ALPHA_VANTAGE_API_KEY}`;
          chartData.labels = ['9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
           '1:00', '1:15', '1:30', '1:45', '2:00', '2:15', '2:30', '2:45', '3:00', '3:15', '3:30', '3:45', '4:00'];
          
          await fetch(fetchURL)
          .then(response => response.json())
          .then(data => {
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
          });
    }

    this.setState({chartData: chartData});
   
  }

  render() {    
    return(
      <div style={{height: '30vh',
                   backgroundColor: '#20375B',
                   borderRadius: 20}}>
        <Line 
          data={this.state.chartData}
          options={
            {maintainAspectRatio: false}
          } />
        <Row>
          <Col>
            <div 
              style={{border: '1px solid #20375B', borderRadius: 10}} 
              onClick={() => this.getStockData(this.props.symbol, '1D')}>
                1D
            </div>
          </Col>
        
        
        </Row>
      </div>
    );
  }
}
