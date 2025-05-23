import React from 'react';
import styled from 'styled-components';

const DroppedFoodContainer = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const FoodSprite = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => props.color || '#fff'};
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

// Add a visual indicator for dropped food
const FoodIndicator = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  animation: pulse 1.5s infinite alternate;
  
  @keyframes pulse {
    0% { transform: translateX(-50%) scale(0.7); opacity: 0.5; }
    100% { transform: translateX(-50%) scale(1.3); opacity: 0.8; }
  }
`;

// Helper function to get food color based on rarity
const getFoodColor = (rarity) => {
  switch (rarity) {
    case 'rare':
      return '#c9a';
    case 'uncommon':
      return '#7c7';
    case 'common':
    default:
      return '#aaa';
  }
};

const DroppedFood = ({ 
  food, 
  position
}) => {
  // Use the img property from our food items
  const foodImageUrl = food.img;
  
  return (
    <DroppedFoodContainer style={{ left: position.x, top: position.y }}>
      <FoodSprite 
        color={getFoodColor(food.rarity)} 
        imageUrl={foodImageUrl}
      />
      <FoodIndicator />
    </DroppedFoodContainer>
  );
};

export default DroppedFood;
