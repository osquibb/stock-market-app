import React from 'react';
import './App.css';
import { Container, Row, Col } from 'reactstrap';
import StockCell from './components/StockCell';

function App() {

  return (
    <Container>
      <Row>
        <Col xs='4'>  
          <StockCell
            symbol='MSFT'
            range=''
          />
        </Col>
        <Col xs='4'>  
          <StockCell
            symbol='MSFT'
            range=''
          />
        </Col>
        <Col xs='4'>  
          <StockCell
            symbol='MSFT'
            range=''
          />
        </Col>
        <Col xs='4'>  
          <StockCell
            symbol='MSFT'
            range=''
          />
        </Col>
      </Row>
    </Container>
    
  );
}

export default App;
