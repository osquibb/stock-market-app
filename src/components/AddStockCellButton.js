import React from 'react';
import styled from 'styled-components';

export const AddStockCellButton = () => {
  
  const Button = styled.button`
  background-color: #346E83;
  border-radius: 5px;
  text-align: center;
  margin-top: 100px;
  &:hover {
    background-color: #20375B;
    color: white;
    border-color: white;
    cursor: pointer;
  }
  `;
  
  return(
    <Button>
      Add Stock Chart
    </Button>
  );
}