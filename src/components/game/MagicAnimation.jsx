import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Import fire sprites
import fireTile000 from '../../assets/images/fx/magic/fire/tile000.png';
import fireTile001 from '../../assets/images/fx/magic/fire/tile001.png';
import fireTile002 from '../../assets/images/fx/magic/fire/tile002.png';
import fireTile003 from '../../assets/images/fx/magic/fire/tile003.png';

// Import ice sprites
import iceTile000 from '../../assets/images/fx/magic/ice/tile000.png';
import iceTile001 from '../../assets/images/fx/magic/ice/tile001.png';
import iceTile002 from '../../assets/images/fx/magic/ice/tile002.png';
import iceTile003 from '../../assets/images/fx/magic/ice/tile003.png';
import iceTile004 from '../../assets/images/fx/magic/ice/tile004.png';
import iceTile005 from '../../assets/images/fx/magic/ice/tile005.png';
import iceTile006 from '../../assets/images/fx/magic/ice/tile006.png';
import iceTile007 from '../../assets/images/fx/magic/ice/tile007.png';

// Import blast sprites
import blastTile000 from '../../assets/images/fx/magic/blast/tile000.png';
import blastTile001 from '../../assets/images/fx/magic/blast/tile001.png';
import blastTile002 from '../../assets/images/fx/magic/blast/tile002.png';
import blastTile003 from '../../assets/images/fx/magic/blast/tile003.png';

// Import grass sprites
import grassTile000 from '../../assets/images/fx/magic/grass/tile000.png';
import grassTile001 from '../../assets/images/fx/magic/grass/tile001.png';
import grassTile002 from '../../assets/images/fx/magic/grass/tile002.png';
import grassTile003 from '../../assets/images/fx/magic/grass/tile003.png';

// Import love sprites
import loveTile000 from '../../assets/images/fx/magic/love/tile000.png';
import loveTile001 from '../../assets/images/fx/magic/love/tile001.png';
import loveTile002 from '../../assets/images/fx/magic/love/tile002.png';
import loveTile003 from '../../assets/images/fx/magic/love/tile003.png';
import loveTile004 from '../../assets/images/fx/magic/love/tile004.png';
import loveTile005 from '../../assets/images/fx/magic/love/tile005.png';
import loveTile006 from '../../assets/images/fx/magic/love/tile006.png';
import loveTile007 from '../../assets/images/fx/magic/love/tile007.png';
import loveTile008 from '../../assets/images/fx/magic/love/tile008.png';
import loveTile009 from '../../assets/images/fx/magic/love/tile009.png';

const MagicAnimationContainer = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const MagicAnimation = ({ type, position, onComplete, isCentered = false }) => {
  const [frame, setFrame] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  // Define frames for each magic type
  const frames = {
    fire: [fireTile000, fireTile001, fireTile002, fireTile003],
    ice: [iceTile000, iceTile001, iceTile002, iceTile003, iceTile004, iceTile005, iceTile006, iceTile007],
    blast: [blastTile000, blastTile001, blastTile002, blastTile003],
    grass: [grassTile000, grassTile001, grassTile002, grassTile003],
    love: [loveTile000, loveTile001, loveTile002, loveTile003, loveTile004, 
           loveTile005, loveTile006, loveTile007, loveTile008, loveTile009]
  };
  
  // Get frames for current type
  const currentFrames = frames[type] || frames.fire;
  
  // Effect for animation
  useEffect(() => {
    if (completed) return;
    
    const animationSpeed = type === 'love' ? 150 : 100; // Love animation is slower
    
    const animationInterval = setInterval(() => {
      setFrame(prev => {
        const nextFrame = prev + 1;
        
        // Check if animation is complete
        if (nextFrame >= currentFrames.length) {
          if (type === 'love' || isCentered) {
            // For love animation, or centered magic effects, stop after one cycle
            setCompleted(true);
            if (onComplete) onComplete();
            return 0;
          }
          // For projectiles, loop the animation
          return 0;
        }
        
        return nextFrame;
      });
    }, animationSpeed);
    
    return () => clearInterval(animationInterval);
  }, [currentFrames.length, type, completed, onComplete, isCentered]);
  
  return (
    <MagicAnimationContainer
      style={{
        left: position.x,
        top: position.y,
        backgroundImage: `url(${currentFrames[frame]})`,
        opacity: completed ? 0 : 1,
        transition: completed ? 'opacity 0.3s' : 'none'
      }}
    />
  );
};

export default MagicAnimation;
