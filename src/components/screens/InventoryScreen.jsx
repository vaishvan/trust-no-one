import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../context/GameContext';

const InventoryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const InventoryContainer = styled.div`
  background-color: #222;
  border: 4px solid #aaa;
  padding: 2rem;
  width: 500px;
  color: white;
  font-family: 'Press Start 2P', cursive, sans-serif;
`;

const InventoryTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #ffd700;
`;

const FoodGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px 0;
`;

const FoodSlot = styled.div`
  background-color: #333;
  border: 2px solid ${props => (props.selected ? '#ffd700' : '#666')};
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  
  &:hover {
    border-color: #aaa;
  }
  
  &::after {
    content: '${props => props.showPrompt ? "Press F" : ""}';
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 8px;
    color: #fff;
    pointer-events: none;
  }
`;

const FoodImage = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.color || 'transparent'};
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 4px;
`;

const FoodDetails = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #333;
  border-radius: 4px;
`;

const FoodActionMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 120px;
  background-color: #333;
  border: 2px solid #666;
  z-index: 15;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const FoodActionOption = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#555' : '#333'};
  
  &:hover {
    background-color: ${props => props.selected ? '#666' : '#555'};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #666;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4a5;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: 'Press Start 2P', cursive, sans-serif;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #5b6;
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
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

const InventoryScreen = ({ onThrowFood }) => {
  const { state, dispatch } = useGame();
  const [selectedFood, setSelectedFood] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null); // index of food with menu open
  const [selectedMenuOption, setSelectedMenuOption] = useState(0); // 0 = Eat, 1 = Drop
  const [keyPressListener, setKeyPressListener] = useState(false);

  // Initialize with first food item selected if available
  useEffect(() => {
    if (state.inventory.foods.length > 0 && !selectedFood) {
      setSelectedFood({ ...state.inventory.foods[0], index: 0 });
    }
  }, [state.inventory.foods, selectedFood]);  // Handle key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const maxSlots = state.inventory.maxSlots;
      const colCount = 4; // Number of columns in the grid
      const rowCount = Math.ceil(maxSlots / colCount);

      // Handle action menu navigation
      if (actionMenuOpen !== null) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            setSelectedMenuOption(prev => (prev > 0 ? prev - 1 : 0));
            break;
          case 'ArrowDown':
            e.preventDefault();
            setSelectedMenuOption(prev => (prev < 1 ? prev + 1 : 1));
            break;
          case 'f':
            e.preventDefault();
            if (selectedMenuOption === 0) {
              handleEatFood({ ...state.inventory.foods[actionMenuOpen], index: actionMenuOpen });
            } else {
              handleDropFood({ ...state.inventory.foods[actionMenuOpen], index: actionMenuOpen });
            }
            break;
          case 'Escape':
            e.preventDefault();
            setActionMenuOpen(null);
            setSelectedMenuOption(0);
            break;
        }
      } else {
        // Handle inventory grid navigation
        const currentIndex = selectedFood ? selectedFood.index : -1;
        let newIndex = currentIndex;
        
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            if (currentIndex === -1) {
              // If nothing selected, select first available item
              if (state.inventory.foods.length > 0) {
                setSelectedFood({ ...state.inventory.foods[0], index: 0 });
              }
            } else {
              newIndex = currentIndex - colCount;
              if (newIndex < 0) newIndex = currentIndex;
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (currentIndex === -1) {
              // If nothing selected, select first available item
              if (state.inventory.foods.length > 0) {
                setSelectedFood({ ...state.inventory.foods[0], index: 0 });
              }
            } else {
              newIndex = currentIndex + colCount;
              if (newIndex >= maxSlots) newIndex = currentIndex;
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (currentIndex === -1) {
              // If nothing selected, select first available item
              if (state.inventory.foods.length > 0) {
                setSelectedFood({ ...state.inventory.foods[0], index: 0 });
              }
            } else {
              newIndex = currentIndex - 1;
              if (newIndex < 0 || newIndex % colCount === colCount - 1) newIndex = currentIndex;
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (currentIndex === -1) {
              // If nothing selected, select first available item
              if (state.inventory.foods.length > 0) {
                setSelectedFood({ ...state.inventory.foods[0], index: 0 });
              }
            } else {
              newIndex = currentIndex + 1;
              if (newIndex >= maxSlots || newIndex % colCount === 0) newIndex = currentIndex;
            }
            break;
          case 'f':
            e.preventDefault();
            if (selectedFood) {
              setActionMenuOpen(selectedFood.index);
              setSelectedMenuOption(0);
            }
            break;
          case 'Escape':
            setActionMenuOpen(null);
            break;
        }

        // If moving to a new index and it's different, check if there's food there
        if (newIndex !== currentIndex && newIndex >= 0) {
          const newFood = newIndex < state.inventory.foods.length ? state.inventory.foods[newIndex] : null;
          if (newFood) {
            setSelectedFood({ ...newFood, index: newIndex });
          }        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFood, actionMenuOpen, selectedMenuOption, state.inventory]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActionMenuOpen(null);
    };

    if (actionMenuOpen !== null) {
      // Add timeout to avoid immediate closure from the same click
      setTimeout(() => {
        window.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [actionMenuOpen]);

  const handleClose = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'game' });
  };

  const handleEatFood = (food) => {
    if (food) {
      dispatch({ 
        type: 'EAT_FOOD', 
        payload: food 
      });
      setSelectedFood(null);
      setActionMenuOpen(null);
    }
  };
  const handleDropFood = (food) => {
    if (food) {
      dispatch({ 
        type: 'DROP_FOOD', 
        payload: food 
      });
      setSelectedFood(null);
      setActionMenuOpen(null);
    }
  };
  // Generate slots for the inventory grid
  const renderFoodSlots = () => {
    const slots = [];
    const maxSlots = state.inventory.maxSlots;
    
    for (let i = 0; i < maxSlots; i++) {
      const food = i < state.inventory.foods.length ? state.inventory.foods[i] : null;
      const isSelected = selectedFood && food && selectedFood.id === food.id && selectedFood.index === i;
      const hasActionMenu = actionMenuOpen === i;
      
      slots.push(
        <FoodSlot 
          key={i} 
          selected={isSelected}
          onClick={() => food && setSelectedFood({ ...food, index: i })}
        >          {food ? (
            <>
              <FoodImage 
                color={getFoodColor(food.rarity)} 
                imageUrl={food.img} // Use the img property from our food items
              />{hasActionMenu && (
                <FoodActionMenu onClick={(e) => e.stopPropagation()}>
                  <FoodActionOption 
                    selected={selectedMenuOption === 0}
                    onClick={() => handleEatFood({ ...food, index: i })}
                  >
                    Eat
                  </FoodActionOption>
                  <FoodActionOption 
                    selected={selectedMenuOption === 1}
                    onClick={() => handleDropFood({ ...food, index: i })}
                  >
                    Drop
                  </FoodActionOption>
                </FoodActionMenu>
              )}
            </>
          ) : null}
        </FoodSlot>
      );
    }
    
    return slots;
  };

  return (
    <InventoryOverlay>
      <InventoryContainer>
        <InventoryTitle>Inventory</InventoryTitle>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          Use arrow keys to navigate. Press F to interact with selected item.
        </div>
        
        <FoodGridContainer>
          {renderFoodSlots()}
        </FoodGridContainer>
        
        {selectedFood && !actionMenuOpen && (
          <FoodDetails>
            <h3>{selectedFood.name}</h3>
            <p>{selectedFood.description}</p>
            <p>Hunger: +{selectedFood.hunger}</p>
            <p>Health: +{selectedFood.health}</p>
          </FoodDetails>
        )}
        
        <ButtonContainer>
          <Button onClick={handleClose}>Close</Button>
        </ButtonContainer>
      </InventoryContainer>
    </InventoryOverlay>
  );
};

export default InventoryScreen;
