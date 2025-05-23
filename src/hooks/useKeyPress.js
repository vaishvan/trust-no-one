import { useState, useEffect } from 'react';

const useKeyPress = (targetKeys) => {
  const [keysPressed, setKeysPressed] = useState({});

  // Function to set a key as pressed
  const downHandler = ({ key }) => {
    if (targetKeys.includes(key)) {
      setKeysPressed(prev => ({ ...prev, [key]: true }));
    }
  };

  // Function to set a key as not pressed
  const upHandler = ({ key }) => {
    if (targetKeys.includes(key)) {
      setKeysPressed(prev => ({ ...prev, [key]: false }));
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKeys]);

  return keysPressed;
};

export default useKeyPress;
