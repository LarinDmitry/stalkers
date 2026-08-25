import React from 'react';
import styled from 'styled-components';

const FlowView = () => {
  return (
    <Wrapper>
      123
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.gray050};
`;

export default FlowView;
