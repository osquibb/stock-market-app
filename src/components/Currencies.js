import React from 'react';
import { Row, Col } from 'reactstrap';


export const Currencies = (props) => {

  return (
    <div hidden={!props.selected}>
      <Row>
        <Col>
          <h2>Currency Cell</h2>
        </Col>
        <Col>
          <h2>Currency Cell</h2>
        </Col>
      </Row>
    </div>           
  ); 
}
