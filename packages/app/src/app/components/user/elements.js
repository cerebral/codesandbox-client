import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);

  ${props =>
    props.loading &&
    css`
      opacity: 0.5;
    `};
`;

export const IntegrationBlock = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.bgColor};
  flex: 1;
  color: white;
  font-size: 1.25rem;
  padding: 1rem 1.5rem;
`;

export const Details = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  flex: 3;
  padding: 0.75rem 1rem;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const Name = styled.span`
  margin-left: 0.75rem;
  font-size: 1.375rem;
`;

export const Heading = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

export const Info = styled.div`
  font-weight: 400;
`;

export const Action = styled.div`
  display: flex;
  transition: 0.3s ease all;
  border: 1px solid
    ${props => (props.red ? 'rgba(255, 0, 0, 0.4)' : props.theme.secondary)};
  border-radius: 4px;

  justify-content: center;
  align-items: center;

  color: ${props => (props.red ? 'rgba(255, 0, 0, 0.6)' : 'white')};

  background-color: ${props =>
    props.red ? 'transparent' : props.theme.secondary};

  opacity: 0.8;
  cursor: pointer;

  height: 1.5rem;
  width: 1.5rem;

  &:hover {
    opacity: 1;

    color: white;
    background-color: ${props =>
      props.red ? 'rgba(255, 0, 0, 0.6)' : props.theme.secondary};
  }
`;