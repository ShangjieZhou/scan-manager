import styled, { css } from 'styled-components';

export const Svg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  ${props => props.dragging && css`
      cursor: move;
  `};
`