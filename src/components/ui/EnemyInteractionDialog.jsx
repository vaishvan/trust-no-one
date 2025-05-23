import React, { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../context/GameContext';

const EnemyInteractionDialogContainer = styled.div`
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  border: 4px solid #964B00;
  width: 80%;
  max-width: 800px;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  background-image: ${props => props.backgroundImage ? `url(${props.backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const DialogContent = styled.div`
  display: flex;
  align-items: center;
`;

const EnemyImage = styled.div`
  width: 96px;
  height: 96px;
  background-color: transparent;
  border-radius: 5px;
  margin-right: 15px;
  flex-shrink: 0;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const DialogText = styled.div`
  color: white;
  font-family: 'Press Start 2P', cursive, sans-serif;
  font-size: 16px;
  line-height: 1.5;
`;

const EnemyName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #ff9;
`;

const DialogOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const DialogOption = styled.button`
  background-color: #964B00;
  border: 2px solid #c97840;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  font-family: 'Press Start 2P', cursive, sans-serif;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #c97840;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #6b3504;
  }
`;

// Maps enemy types to their respective image paths (placeholders)
const enemyImageMap = {
  'redMushroom': '/path/to/sprites/redMushroom.png',
  'blueMushroom': '/path/to/sprites/blueMushroom.png',
  'fireSpirit': '/path/to/sprites/fireSpirit.png',
  'iceSpirit': '/path/to/sprites/iceSpirit.png',
  'greenOcto': '/path/to/sprites/greenOcto.png',
  'blueOcto': '/path/to/sprites/blueOcto.png',
  'redSkull': '/path/to/sprites/redSkull.png',
  'blueSkull': '/path/to/sprites/blueSkull.png',
  'heartz': '/path/to/sprites/heartz.png',
  'furiousFireSpirit': '/path/to/sprites/furiousFireSpirit.png',
  'waterSlime': '/path/to/sprites/waterSlime.png',
  'grassSlime': '/path/to/sprites/grassSlime.png',
};

const EnemyInteractionDialog = ({ 
  enemy, 
  onClose, 
  onFeed, 
  onBefriend, 
  onAttack,
  dialogStage = 'request', // 'request', 'feeding', 'befriended', 'angry'
  backgroundImage = '/path/to/dialog-background.png' 
}) => {
  const { state } = useGame();
  const [selectedFood, setSelectedFood] = useState(null);
  
  const getEnemyImagePath = (enemyType) => {
    return enemyImageMap[enemyType] || `/path/to/sprites/${enemyType}.png`;
  };

  const getDialogText = () => {
    switch (dialogStage) {
      case 'request':
        return "I'll help ya out real good, just give me some food. What ya say?";
      case 'feeding':
        return "Thank you! This food looks delicious!";
      case 'befriended':
        return "I'm your friend now. I'll help you on your journey!";
      case 'angry':
        return "You're not giving me food? Then prepare to fight!";
      default:
        return "...";
    }
  };

  return (
    <EnemyInteractionDialogContainer backgroundImage={backgroundImage}>
      <DialogContent>
        <EnemyImage imageUrl={getEnemyImagePath(enemy.type)} />
        <DialogText>
          <EnemyName>{enemy.name}</EnemyName>
          {getDialogText()}
        </DialogText>
      </DialogContent>
        <DialogOptions>
        {dialogStage === 'request' && (
          <>
            <DialogOption onClick={onFeed} disabled={state.inventory.foods.length === 0}>
              Give Food
            </DialogOption>
            <DialogOption onClick={onAttack}>
              Fight
            </DialogOption>
            <DialogOption onClick={onClose}>
              Leave
            </DialogOption>
          </>
        )}
        
        {dialogStage === 'feeding' && (
          <DialogOption onClick={onBefriend}>
            Continue
          </DialogOption>
        )}
        
        {dialogStage === 'befriended' && (
          <DialogOption onClick={onClose}>
            Great!
          </DialogOption>
        )}
        
        {dialogStage === 'angry' && (
          <>
            <DialogOption onClick={onAttack}>
              Fight
            </DialogOption>
            <DialogOption onClick={onClose}>
              Run away
            </DialogOption>
          </>
        )}
      </DialogOptions>
    </EnemyInteractionDialogContainer>
  );
};

export default EnemyInteractionDialog;
