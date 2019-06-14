import React from 'react';
import { Row, Col } from 'reactstrap';
import CurrencyCell from './CurrencyCell';


export const Currencies = (props) => {

  return (
    <div hidden={!props.selected}>
      <Row>
        <Col>
          <CurrencyCell />
        </Col>
        <Col>
          <CurrencyCell />
        </Col>
      </Row>
    </div>           
  ); 
}
