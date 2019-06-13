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
        <AddStockCellButton onClick={() => this.addStockCell()} />
      ],
      nextStockCellID: 0
    };
  }

  // May need unique keys (instead of array indicies) to prevent re-rendering

  addStockCell() {
    const stockCells = [this.state.stockCells];
    stockCells.splice(stockCells.length - 2, 0, <StockCell />);
    this.setState({stockCells});
  }

  render() {

    const RenderStockCells = () => {
      return this.state.stockCells.map((stockCell, index) => {
        return(<Col xs='6' className="text-center" key={index}>  
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
