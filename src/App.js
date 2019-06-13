import React from 'react';
import './App.css';
import { Container, Row, Col } from 'reactstrap';
import StockCell from './components/StockCell';
import { AddStockCellButton } from './components/AddStockCellButton';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { stockCells: 
      [
        <StockCell />,
        <AddStockCellButton />
      ] 
    };
  }

  addStockCell(symbol, range) {
    const newStockCell = <StockCell />
  }

  render() {

    const RenderStockCells = () => {
      return this.state.stockCells.map(stockCell => {
        return(<Col xs='6' className="text-center">  
          {stockCell}
        </Col>);
      });
    }

    return (
      <Container>
        <Row>
          <RenderStockCells />
        </Row>
      </Container>
    );
  }

  
}

export default App;
