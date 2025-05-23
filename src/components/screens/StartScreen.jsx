import React from 'react';
import styled from 'styled-components';
import { useGame } from '../../context/GameContext';

const StartScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Press Start 2P', cursive, sans-serif;
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background-color: #4a0;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-family: 'Press Start 2P', cursive, sans-serif;
  
  &:hover {
    background-color: #6c0;
  }
`;

const StartScreen = () => {
  const { dispatch } = useGame();

  const handleStartGame = () => {
    // Reset the game first with new randomized controls
    dispatch({ type: 'RESET_GAME' });
    // Then set the screen to game
    dispatch({ type: 'SET_SCREEN', payload: 'game' });
  };

  return (
    <StartScreenContainer>
      <Title>Trust No (?) One</Title>
      <StartButton onClick={handleStartGame}>Start</StartButton>
    </StartScreenContainer>
  );
};

export default StartScreen;
