import {FC, ComponentPropsWithoutRef} from 'react';
import styled from 'styled-components';

const BaseLoader: FC<ComponentPropsWithoutRef<'div'>> = (props) => (
  <Wrapper data-qa="base-loader" className="loader" {...props}>
    <Point />
    <Point />
    <Point />
  </Wrapper>
);

const Point = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: rgb(52, 152, 219);
  margin: 6px 3px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${Point} {
    &:nth-child(1) {
      animation: bounce 1s ease-in-out infinite;
    }

    &:nth-child(2) {
      animation: bounce 1s ease-in-out 0.33s infinite;
    }

    &:nth-child(3) {
      animation: bounce 1s ease-in-out 0.66s infinite;
    }
  }
`;

export default BaseLoader;
