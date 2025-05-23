import React from 'react';
import styled from 'styled-components';
import { useGame } from '../../context/GameContext';

const PauseOverlay = styled.div`
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

const PauseMenuContainer = styled.div`
  background-color: #222;
  border: 4px solid #aaa;
  padding: 2rem;
  width: 400px;
  color: white;
  font-family: 'Press Start 2P', cursive, sans-serif;
`;

const PauseTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const MenuOption = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #444;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  label {
    flex: 1;
  }
  
  input {
    flex: 1;
  }
`;


const KeyBindingContainer = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const KeyBindRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  
  label {
    flex: 1;
  }
  
  input {
    width: 100px;
  }
`;

const PauseMenu = () => {
  const { state, dispatch } = useGame();
  const [listeningForKey, setListeningForKey] = React.useState(null);
  const [localKeyBindings, setLocalKeyBindings] = React.useState(state.keyBindings);
  const [localVolume, setLocalVolume] = React.useState(state.settings.volume);

  // Handle resume game button
  const handleResume = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'game' });
  };
    // Handle volume change
  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    setLocalVolume(volume);
    dispatch({ type: 'UPDATE_SETTINGS', payload: { volume } });
  };
  
  // Handle key binding changes
  const startListeningForKey = (action) => {
    setListeningForKey(action);
  };
  
  // Listen for key press and update binding
  React.useEffect(() => {
    if (listeningForKey) {
      const handleKeyDown = (e) => {
        e.preventDefault();
        const newBindings = { ...localKeyBindings, [listeningForKey]: e.key };
        setLocalKeyBindings(newBindings);
        setListeningForKey(null);
        dispatch({ type: 'UPDATE_KEY_BINDINGS', payload: { [listeningForKey]: e.key } });
      };
      
      window.addEventListener('keydown', handleKeyDown, { once: true });
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [listeningForKey, localKeyBindings, dispatch]);
  
  // Handle quit to main menu
  const handleQuit = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'start' });
  };
  
  return (
    <PauseOverlay>
      <PauseMenuContainer>
        <PauseTitle>Paused</PauseTitle>
        
        <MenuOption onClick={handleResume}>Resume Game</MenuOption>
        
        <SliderContainer>
          <label>Volume:</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={localVolume} 
            onChange={handleVolumeChange} 
          />
          <span>{Math.round(localVolume * 100)}%</span>        </SliderContainer>
        
        <KeyBindingContainer>
          <h3>Key Bindings</h3>
          
          <KeyBindRow>
            <label>Move Up:</label>
            <input 
              type="text" 
              value={localKeyBindings.up} 
              onClick={() => startListeningForKey('up')}
              readOnly
            />
          </KeyBindRow>
          
          <KeyBindRow>
            <label>Move Down:</label>
            <input 
              type="text" 
              value={localKeyBindings.down} 
              onClick={() => startListeningForKey('down')}
              readOnly
            />
          </KeyBindRow>
          
          <KeyBindRow>
            <label>Move Left:</label>
            <input 
              type="text" 
              value={localKeyBindings.left} 
              onClick={() => startListeningForKey('left')}
              readOnly
            />
          </KeyBindRow>
          
          <KeyBindRow>
            <label>Move Right:</label>
            <input 
              type="text" 
              value={localKeyBindings.right} 
              onClick={() => startListeningForKey('right')}
              readOnly
            />
          </KeyBindRow>
          
          <KeyBindRow>
            <label>Attack:</label>
            <input 
              type="text" 
              value={localKeyBindings.attack} 
              onClick={() => startListeningForKey('attack')}
              readOnly
            />
          </KeyBindRow>
          
          <KeyBindRow>
            <label>Magic:</label>
            <input 
              type="text" 
              value={localKeyBindings.magic} 
              onClick={() => startListeningForKey('magic')}
              readOnly
            />
          </KeyBindRow>
          
          <KeyBindRow>
            <label>Pause:</label>
            <input 
              type="text" 
              value={localKeyBindings.pause} 
              onClick={() => startListeningForKey('pause')}
              readOnly
            />
          </KeyBindRow>
        </KeyBindingContainer>
        
        <MenuOption onClick={handleQuit}>Quit to Main Menu</MenuOption>
      </PauseMenuContainer>
    </PauseOverlay>
  );
};

export default PauseMenu;
