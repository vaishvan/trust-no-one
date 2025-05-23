import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Import sprites for each direction
import walkUp1 from '../../assets/images/player/up/Walkup1.png';
import walkUp2 from '../../assets/images/player/up/Walkup2.png';
import walkUp3 from '../../assets/images/player/up/Walkup3.png';
import walkUp4 from '../../assets/images/player/up/Walkup4.png';

import walkDown1 from '../../assets/images/player/down/Walkdown1.png';
import walkDown2 from '../../assets/images/player/down/Walkdown2.png';
import walkDown3 from '../../assets/images/player/down/Walkdown3.png';
import walkDown4 from '../../assets/images/player/down/Walkdown4.png';

import walkLeft1 from '../../assets/images/player/left/Walkleft1.png';
import walkLeft2 from '../../assets/images/player/left/Walkleft2.png';
import walkLeft3 from '../../assets/images/player/left/Walkleft3.png';
import walkLeft4 from '../../assets/images/player/left/Walkleft4.png';

import walkRight1 from '../../assets/images/player/right/Walkright1.png';
import walkRight2 from '../../assets/images/player/right/Walkright2.png';
import walkRight3 from '../../assets/images/player/right/Walkright3.png';
import walkRight4 from '../../assets/images/player/right/Walkright4.png';

// Container for the player character
const PlayerContainer = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease-in-out;
`;

// Sprite-based player component
const PlayerSprite = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.spriteImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

// Attack effect
const AttackEffect = styled.div`
  position: absolute;
  width: 0; /* Changed from 60px to 0 to hide the bar */
  height: 0; /* Changed from 10px to 0 to hide the bar */
  background-color: #fff;
  border-radius: 5px;
  opacity: 0; /* Changed from 0.7 to 0 to hide the bar */
  transform-origin: left center;
  animation: swing 0.3s ease-out;
  
  @keyframes swing {
    0% { transform: rotate(-45deg); }
    100% { transform: rotate(45deg); }
  }
`;

// Magic effect
const MagicEffect = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: ${props => props.color || '#69f'};
  border-radius: 50%;
  opacity: 0.7;
  animation: expand 0.5s ease-out;
  
  @keyframes expand {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(5); opacity: 0; }
  }
`;

const Player = ({ 
  position, 
  direction, 
  isMoving, 
  isAttacking, 
  isUsingMagic,
  weaponStatus 
}) => {
  // State for animation frame
  const [frame, setFrame] = useState(0);
  
  // Effect for handling animation frames
  useEffect(() => {
    if (!isMoving) {
      // Reset to the default stance (frame 0) when not moving
      setFrame(0);
      return;
    }
    
    // Create animation interval when moving
    const animationInterval = setInterval(() => {
      // Cycle through frames 0-3 (corresponding to sprites 1-4)
      setFrame((prevFrame) => (prevFrame + 1) % 4);
    }, 150); // Adjust speed as needed
    
    return () => clearInterval(animationInterval);
  }, [isMoving]);
  
  // Get the current sprite based on direction and frame
  const getPlayerSprite = () => {
    // Each direction has an array of 4 sprites
    const sprites = {
      up: [walkUp1, walkUp2, walkUp3, walkUp4],
      down: [walkDown1, walkDown2, walkDown3, walkDown4],
      left: [walkLeft1, walkLeft2, walkLeft3, walkLeft4],
      right: [walkRight1, walkRight2, walkRight3, walkRight4]
    };
    
    // Return the correct sprite based on direction and current frame
    return sprites[direction][frame];
  };
  
  // Determine magic color based on weapon status
  const getMagicColor = () => {
    switch (weaponStatus) {
      case 'fire': return '#f63';
      case 'ice': return '#3cf';
      case 'thunder': return '#ff3';
      case 'earth': return '#a82';
      case 'spirit': return '#c6f';
      case 'poison': return '#6c2';
      case 'dark': return '#636';
      case 'bone': return '#fff';
      case 'decay': return '#686';
      case 'stone': return '#888';
      case 'light': return '#ff9';
      case 'dragon': return '#f33';
      default: return '#69f';
    }
  };
  
  // Calculate attack effect position and rotation based on direction
  const getAttackEffectStyle = () => {
    switch (direction) {
      case 'up':
        return { 
          top: '-5px', 
          left: '24px', 
          transform: 'rotate(-90deg) translateY(-30px)'
        };
      case 'down':
        return { 
          bottom: '-5px', 
          left: '24px', 
          transform: 'rotate(90deg) translateY(30px)'
        };
      case 'left':
        return { 
          left: '-30px', 
          top: '24px', 
          transform: 'rotate(180deg) translateX(-30px)'
        };
      case 'right':
        return { 
          right: '-30px', 
          top: '24px', 
          transform: 'translateX(30px)'
        };
      default:
        return { right: '-30px', top: '24px' };
    }
  };
  
  // Return the player component
  return (
    <PlayerContainer style={{ left: position.x, top: position.y }}>
      <PlayerSprite spriteImage={getPlayerSprite()} />
      
      {isAttacking && (
        <AttackEffect style={getAttackEffectStyle()} />
      )}
      
      {isUsingMagic && (
        <MagicEffect 
          color={getMagicColor()}
          style={{ 
            left: '24px', 
            top: '24px',
          }} 
        />
      )}
    </PlayerContainer>
  );
};

export default Player;
