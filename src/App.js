import React from 'react';
import './App.css';
import { Container, Row, Col } from 'reactstrap';
import styled from 'styled-components';
import { Stocks } from './components/Stocks';
import { Currencies } from './components/Currencies';

const SideMenu = styled.div`
  background-color: #DE7E80;
  padding-top: 10px;
  width: 100%;
  height: 100%;
`;

const SideMenuItem = styled.h6`
  width: 100%;
  border-top: 1px solid;
  border-bottom: 1px solid;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: ${props => props.selected ? '#20375B' : null};
  color: ${props => props.selected ? 'white' : null};
  &:hover {
    color: white;
    cursor: pointer;
  }
`;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selected: 'Stocks'};
  }

  render() {
    return (
      <Container fluid>
        <Row style={{height: "100vh"}}>
          <Col xs="4">
            <SideMenu>
              <Row>
                <Col>
                  <SideMenuItem 
                    selected={this.state.selected === 'Stocks'}
                    onClick={() => this.setState({selected: 'Stocks'})}
                  >
                      Stocks
                  </SideMenuItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <SideMenuItem
                    selected={this.state.selected === 'Currencies'}
                    onClick={() => this.setState({selected: 'Currencies'})}
                  >
                    Currencies
                  </SideMenuItem>
                </Col> 
              </Row>
            </SideMenu>
          </Col>
          <Col xs="8">
            <Container style={{maxWidth: "300px"}}>
              <Stocks selected={this.state.selected === 'Stocks'} />
              <Currencies selected={this.state.selected === 'Currencies'} />
            </Container>            
          </Col>
        </Row>
      </Container>
    ); 
  }
}

export default App;
