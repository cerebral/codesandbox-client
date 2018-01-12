import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Item = styled.div`
  margin: 1rem;
  margin-top: 0;
  font-size: 0.875rem;
`;

export const GitContainer = styled.div`
  display: inline-block;
  margin: 0 1rem;
  margin-bottom: 0.25rem;
`;

export const UserLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
`;

export const StatsContainer = styled.div`
  height: 2rem;
  font-size: 0.875rem;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 1rem;
`;

export const PrivacyContainer = styled.div`
  margin: 0 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
`;

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: white;
  margin-bottom: 0.5rem;
`;

export const Description = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
`;