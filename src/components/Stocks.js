import React from 'react';
import { Row, Col } from 'reactstrap';
import StockCell from './StockCell';

export const Stocks = (props) => {

  return (
    <div hidden={!props.selected}>
      <Row>
        <Col>
          <StockCell />
        </Col>
        <Col>
          <StockCell />
        </Col>
      </Row>
    </div>           
  ); 
}
