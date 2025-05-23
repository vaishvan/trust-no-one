import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Import fireSpirit sprites
import firespiritdown1 from '../../assets/images/enemies/fireSpirit/down/firespiritdown1.png';
import firespiritdown2 from '../../assets/images/enemies/fireSpirit/down/firespiritdown2.png';
import firespiritdown3 from '../../assets/images/enemies/fireSpirit/down/firespiritdown3.png';
import firespiritdown4 from '../../assets/images/enemies/fireSpirit/down/firespiritdown4.png';

import firespiritleft1 from '../../assets/images/enemies/fireSpirit/left/firespiritleft1.png';
import firespiritleft2 from '../../assets/images/enemies/fireSpirit/left/firespiritleft2.png';
import firespiritleft3 from '../../assets/images/enemies/fireSpirit/left/firespiritleft3.png';
import firespiritleft4 from '../../assets/images/enemies/fireSpirit/left/firespiritleft4.png';

import firespiritright1 from '../../assets/images/enemies/fireSpirit/right/firespiritright1.png';
import firespiritright2 from '../../assets/images/enemies/fireSpirit/right/firespiritright2.png';
import firespiritright3 from '../../assets/images/enemies/fireSpirit/right/firespiritright3.png';
import firespiritright4 from '../../assets/images/enemies/fireSpirit/right/firespiritright4.png';

import firespiritup1 from '../../assets/images/enemies/fireSpirit/up/firespiritup1.png';
import firespiritup2 from '../../assets/images/enemies/fireSpirit/up/firespiritup2.png';
import firespiritup3 from '../../assets/images/enemies/fireSpirit/up/firespiritup3.png';
import firespiritup4 from '../../assets/images/enemies/fireSpirit/up/firespiritup4.png';

// Import redSkull sprites
import redskulldown1 from '../../assets/images/enemies/redSkull/down/redskulldown1.png';
import redskulldown2 from '../../assets/images/enemies/redSkull/down/redskulldown2.png';
import redskulldown3 from '../../assets/images/enemies/redSkull/down/redskulldown3.png';
import redskulldown4 from '../../assets/images/enemies/redSkull/down/redskulldown4.png';

import redskullleft1 from '../../assets/images/enemies/redSkull/left/redskullleft1.png';
import redskullleft2 from '../../assets/images/enemies/redSkull/left/redskullleft2.png';
import redskullleft3 from '../../assets/images/enemies/redSkull/left/redskullleft3.png';
import redskullleft4 from '../../assets/images/enemies/redSkull/left/redskullleft4.png';

import redskullright1 from '../../assets/images/enemies/redSkull/right/redskullright1.png';
import redskullright2 from '../../assets/images/enemies/redSkull/right/redskullright2.png';
import redskullright3 from '../../assets/images/enemies/redSkull/right/redskullright3.png';
import redskullright4 from '../../assets/images/enemies/redSkull/right/redskullright4.png';

import redskullup1 from '../../assets/images/enemies/redSkull/up/redskullup1.png';
import redskullup2 from '../../assets/images/enemies/redSkull/up/redskullup2.png';
import redskullup3 from '../../assets/images/enemies/redSkull/up/redskullup3.png';
import redskullup4 from '../../assets/images/enemies/redSkull/up/redskullup4.png';

// Import blueSkull sprites (note the different naming pattern with parentheses)
import blueskulldown1 from '../../assets/images/enemies/blueSkull/down/blueskulldown1.png';
import blueskulldown2 from '../../assets/images/enemies/blueSkull/down/blueskulldown2.png';
import blueskulldown3 from '../../assets/images/enemies/blueSkull/down/blueskulldown3.png';
import blueskulldown4 from '../../assets/images/enemies/blueSkull/down/blueskulldown4.png';

import blueskullleft1 from '../../assets/images/enemies/blueSkull/left/blueskullleft1.png';
import blueskullleft2 from '../../assets/images/enemies/blueSkull/left/blueskullleft2.png';
import blueskullleft3 from '../../assets/images/enemies/blueSkull/left/blueskullleft3.png';
import blueskullleft4 from '../../assets/images/enemies/blueSkull/left/blueskullleft4.png';

import blueskullright1 from '../../assets/images/enemies/blueSkull/right/blueskullright1.png';
import blueskullright2 from '../../assets/images/enemies/blueSkull/right/blueskullright2.png';
import blueskullright3 from '../../assets/images/enemies/blueSkull/right/blueskullright3.png';
import blueskullright4 from '../../assets/images/enemies/blueSkull/right/blueskullright4.png';

import blueskullup1 from '../../assets/images/enemies/blueSkull/up/blueskullup1.png';
import blueskullup2 from '../../assets/images/enemies/blueSkull/up/blueskullup2.png';
import blueskullup3 from '../../assets/images/enemies/blueSkull/up/blueskullup3.png';
import blueskullup4 from '../../assets/images/enemies/blueSkull/up/blueskullup4.png';

// Import blueOcto sprites
import blueoctodown1 from '../../assets/images/enemies/blueOcto/down/blueoctodown1.png';
import blueoctodown2 from '../../assets/images/enemies/blueOcto/down/blueoctodown2.png';
import blueoctodown3 from '../../assets/images/enemies/blueOcto/down/blueoctodown3.png';
import blueoctodown4 from '../../assets/images/enemies/blueOcto/down/blueoctodown4.png';

import blueoctoleft1 from '../../assets/images/enemies/blueOcto/left/blueoctoleft1.png';
import blueoctoleft2 from '../../assets/images/enemies/blueOcto/left/blueoctoleft2.png';
import blueoctoleft3 from '../../assets/images/enemies/blueOcto/left/blueoctoleft3.png';
import blueoctoleft4 from '../../assets/images/enemies/blueOcto/left/blueoctoleft4.png';

import blueoctoright1 from '../../assets/images/enemies/blueOcto/right/blueoctoright1.png';
import blueoctoright2 from '../../assets/images/enemies/blueOcto/right/blueoctoright2.png';
import blueoctoright3 from '../../assets/images/enemies/blueOcto/right/blueoctoright3.png';
import blueoctoright4 from '../../assets/images/enemies/blueOcto/right/blueoctoright4.png';

import blueoctoup1 from '../../assets/images/enemies/blueOcto/up/blueoctoup1.png';
import blueoctoup2 from '../../assets/images/enemies/blueOcto/up/blueoctoup2.png';
import blueoctoup3 from '../../assets/images/enemies/blueOcto/up/blueoctoup3.png';
import blueoctoup4 from '../../assets/images/enemies/blueOcto/up/blueoctoup4.png';

// Import iceSpirit sprites
import icespiritdown1 from '../../assets/images/enemies/iceSpirit/down/icespiritdown1.png';
import icespiritdown2 from '../../assets/images/enemies/iceSpirit/down/icespiritdown2.png';
import icespiritdown3 from '../../assets/images/enemies/iceSpirit/down/icespiritdown3.png';
import icespiritdown4 from '../../assets/images/enemies/iceSpirit/down/icespiritdown4.png';

import icespiritleft1 from '../../assets/images/enemies/iceSpirit/left/icespiritleft1.png';
import icespiritleft2 from '../../assets/images/enemies/iceSpirit/left/icespiritleft2.png';
import icespiritleft3 from '../../assets/images/enemies/iceSpirit/left/icespiritleft3.png';
import icespiritleft4 from '../../assets/images/enemies/iceSpirit/left/icespiritleft4.png';

import icespiritright1 from '../../assets/images/enemies/iceSpirit/right/icespiritright1.png';
import icespiritright2 from '../../assets/images/enemies/iceSpirit/right/icespiritright2.png';
import icespiritright3 from '../../assets/images/enemies/iceSpirit/right/icespiritright3.png';
import icespiritright4 from '../../assets/images/enemies/iceSpirit/right/icespiritright4.png';

import icespiritup1 from '../../assets/images/enemies/iceSpirit/up/icespiritup1.png';
import icespiritup2 from '../../assets/images/enemies/iceSpirit/up/icespiritup2.png';
import icespiritup3 from '../../assets/images/enemies/iceSpirit/up/icespiritup3.png';
import icespiritup4 from '../../assets/images/enemies/iceSpirit/up/icespiritup4.png';

// Import redMushroom sprites
import redmushroomdown1 from '../../assets/images/enemies/redMushroom/down/redmushroomdown1.png';
import redmushroomdown2 from '../../assets/images/enemies/redMushroom/down/redmushroomdown2.png';
import redmushroomdown3 from '../../assets/images/enemies/redMushroom/down/redmushroomdown3.png';
import redmushroomdown4 from '../../assets/images/enemies/redMushroom/down/redmushroomdown4.png';

import redmushroomleft1 from '../../assets/images/enemies/redMushroom/left/redmushroomleft1.png';
import redmushroomleft2 from '../../assets/images/enemies/redMushroom/left/redmushroomleft2.png';
import redmushroomleft3 from '../../assets/images/enemies/redMushroom/left/redmushroomleft3.png';
import redmushroomleft4 from '../../assets/images/enemies/redMushroom/left/redmushroomleft4.png';

import redmushroomright1 from '../../assets/images/enemies/redMushroom/right/redmushroomright1.png';
import redmushroomright2 from '../../assets/images/enemies/redMushroom/right/redmushroomright2.png';
import redmushroomright3 from '../../assets/images/enemies/redMushroom/right/redmushroomright3.png';
import redmushroomright4 from '../../assets/images/enemies/redMushroom/right/redmushroomright4.png';

import redmushroomup1 from '../../assets/images/enemies/redMushroom/up/redmushroomup1.png';
import redmushroomup2 from '../../assets/images/enemies/redMushroom/up/redmushroomup2.png';
import redmushroomup3 from '../../assets/images/enemies/redMushroom/up/redmushroomup3.png';
import redmushroomup4 from '../../assets/images/enemies/redMushroom/up/redmushroomup4.png';

// Import grassSlime sprites
import grassslimedown1 from '../../assets/images/enemies/grassSlime/down/greenslimedown1.png';
import grassslimedown2 from '../../assets/images/enemies/grassSlime/down/greenslimedown2.png';
import grassslimedown3 from '../../assets/images/enemies/grassSlime/down/greenslimedown3.png';
import grassslimedown4 from '../../assets/images/enemies/grassSlime/down/greenslimedown4.png';

import grassslimeleft1 from '../../assets/images/enemies/grassSlime/left/greenslimeleft1.png';
import grassslimeleft2 from '../../assets/images/enemies/grassSlime/left/greenslimeleft2.png';
import grassslimeleft3 from '../../assets/images/enemies/grassSlime/left/greenslimeleft3.png';
import grassslimeleft4 from '../../assets/images/enemies/grassSlime/left/greenslimeleft4.png';

import grassslimeright1 from '../../assets/images/enemies/grassSlime/right/greenslimeright1.png';
import grassslimeright2 from '../../assets/images/enemies/grassSlime/right/greenslimeright2.png';
import grassslimeright3 from '../../assets/images/enemies/grassSlime/right/greenslimeright3.png';
import grassslimeright4 from '../../assets/images/enemies/grassSlime/right/greenslimeright4.png';

import grassslimeup1 from '../../assets/images/enemies/grassSlime/up/greenslimeup1.png';
import grassslimeup2 from '../../assets/images/enemies/grassSlime/up/greenslimeup2.png';
import grassslimeup3 from '../../assets/images/enemies/grassSlime/up/greenslimeup3.png';
import grassslimeup4 from '../../assets/images/enemies/grassSlime/up/greenslimeup4.png';

// Import waterSlime sprites
import waterslimedown1 from '../../assets/images/enemies/waterSlime/down/blueslimedown1.png';
import waterslimedown2 from '../../assets/images/enemies/waterSlime/down/blueslimedown2.png';
import waterslimedown3 from '../../assets/images/enemies/waterSlime/down/blueslimedown3.png';
import waterslimedown4 from '../../assets/images/enemies/waterSlime/down/blueslimedown4.png';

import waterslimeleft1 from '../../assets/images/enemies/waterSlime/left/blueslimeleft1.png';
import waterslimeleft2 from '../../assets/images/enemies/waterSlime/left/blueslimeleft2.png';
import waterslimeleft3 from '../../assets/images/enemies/waterSlime/left/blueslimeleft3.png';
import waterslimeleft4 from '../../assets/images/enemies/waterSlime/left/blueslimeleft4.png';

import waterslimeright1 from '../../assets/images/enemies/waterSlime/right/blueslimeright1.png';
import waterslimeright2 from '../../assets/images/enemies/waterSlime/right/blueslimeright2.png';
import waterslimeright3 from '../../assets/images/enemies/waterSlime/right/blueslimeright3.png';
import waterslimeright4 from '../../assets/images/enemies/waterSlime/right/blueslimeright4.png';

import waterslimeup1 from '../../assets/images/enemies/waterSlime/up/blueslimeup1.png';
import waterslimeup2 from '../../assets/images/enemies/waterSlime/up/blueslimeup2.png';
import waterslimeup3 from '../../assets/images/enemies/waterSlime/up/blueslimeup3.png';
import waterslimeup4 from '../../assets/images/enemies/waterSlime/up/blueslimeup4.png';

// Import heartz sprites
import heartzdown1 from '../../assets/images/enemies/heartz/down/heartzdown1.png';
import heartzdown2 from '../../assets/images/enemies/heartz/down/heartzdown2.png';
import heartzdown3 from '../../assets/images/enemies/heartz/down/heartzdown3.png';
import heartzdown4 from '../../assets/images/enemies/heartz/down/heartzdown4.png';

import heartzleft1 from '../../assets/images/enemies/heartz/left/heartzleft1.png';
import heartzleft2 from '../../assets/images/enemies/heartz/left/heartzleft2.png';
import heartzleft3 from '../../assets/images/enemies/heartz/left/heartzleft3.png';
import heartzleft4 from '../../assets/images/enemies/heartz/left/heartzleft4.png';

import heartzright1 from '../../assets/images/enemies/heartz/right/heartzright1.png';
import heartzright2 from '../../assets/images/enemies/heartz/right/heartzright2.png';
import heartzright3 from '../../assets/images/enemies/heartz/right/heartzright3.png';
import heartzright4 from '../../assets/images/enemies/heartz/right/heartzright4.png';

import heartzup1 from '../../assets/images/enemies/heartz/up/heartzup1.png';
import heartzup2 from '../../assets/images/enemies/heartz/up/heartzup2.png';
import heartzup3 from '../../assets/images/enemies/heartz/up/heartzup3.png';
import heartzup4 from '../../assets/images/enemies/heartz/up/heartzup4.png';

// Container for the enemy
const EnemyContainer = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  transform: translate(-50%, -50%);
  transition: left 0.3s ease, top 0.3s ease;
`;

// Base enemy sprite
const EnemySprite = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.3s ease;
  background-image: ${props => props.spriteUrl ? `url(${props.spriteUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  
  &.using-placeholder {
    border-radius: 24px;
    background-color: ${props => props.placeholderColor || '#f00'};
  }
`;

// Befriended state indicator
const BefriendedIndicator = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: #6f6;
  border-radius: 50%;
  animation: pulse 1s infinite alternate;
  
  @keyframes pulse {
    0% { transform: translateX(-50%) scale(0.8); opacity: 0.7; }
    100% { transform: translateX(-50%) scale(1.2); opacity: 1; }
  }
`;

// Eating indicator
const EatingIndicator = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 10px;
  font-size: 10px;
  white-space: nowrap;
`;

const Enemy = ({ 
  position, 
  direction, 
  type,
  isBefriended,
  isEating = false,
  isMoving = false
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // Animation frames logic
  useEffect(() => {
    if (!isMoving) return;
    
    const animationInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 4); // 4 frames per direction
    }, 150);
    
    return () => clearInterval(animationInterval);
  }, [isMoving]);
  
  // Get enemy sprite based on type, direction and frame
  const getEnemySpriteUrl = () => {
    // For the 3 enemy types we have sprites for, return the appropriate sprite
    // For other enemy types, return the placeholder URL
    
    // Sprite mapping for fireSpirit
    const fireSpiritSprites = {
      up: [firespiritup1, firespiritup2, firespiritup3, firespiritup4],
      down: [firespiritdown1, firespiritdown2, firespiritdown3, firespiritdown4],
      left: [firespiritleft1, firespiritleft2, firespiritleft3, firespiritleft4],
      right: [firespiritright1, firespiritright2, firespiritright3, firespiritright4]
    };
    
    // Sprite mapping for redSkull
    const redSkullSprites = {
      up: [redskullup1, redskullup2, redskullup3, redskullup4],
      down: [redskulldown1, redskulldown2, redskulldown3, redskulldown4],
      left: [redskullleft1, redskullleft2, redskullleft3, redskullleft4],
      right: [redskullright1, redskullright2, redskullright3, redskullright4]
    };
    
    // Sprite mapping for blueSkull
    const blueSkullSprites = {
      up: [blueskullup1, blueskullup2, blueskullup3, blueskullup4],
      down: [blueskulldown1, blueskulldown2, blueskulldown3, blueskulldown4],
      left: [blueskullleft1, blueskullleft2, blueskullleft3, blueskullleft4],
      right: [blueskullright1, blueskullright2, blueskullright3, blueskullright4]
    };
    
    // Sprite mapping for blueOcto
    const blueOctoSprites = {
      up: [blueoctoup1, blueoctoup2, blueoctoup3, blueoctoup4],
      down: [blueoctodown1, blueoctodown2, blueoctodown3, blueoctodown4],
      left: [blueoctoleft1, blueoctoleft2, blueoctoleft3, blueoctoleft4],
      right: [blueoctoright1, blueoctoright2, blueoctoright3, blueoctoright4]
    };
      // Sprite mapping for iceSpirit
    const iceSpiritSprites = {
      up: [icespiritup1, icespiritup2, icespiritup3, icespiritup4],
      down: [icespiritdown1, icespiritdown2, icespiritdown3, icespiritdown4],
      left: [icespiritleft1, icespiritleft2, icespiritleft3, icespiritleft4],
      right: [icespiritright1, icespiritright2, icespiritright3, icespiritright4]
    };
    
    // Sprite mapping for redMushroom
    const redMushroomSprites = {
      up: [redmushroomup1, redmushroomup2, redmushroomup3, redmushroomup4],
      down: [redmushroomdown1, redmushroomdown2, redmushroomdown3, redmushroomdown4],
      left: [redmushroomleft1, redmushroomleft2, redmushroomleft3, redmushroomleft4],
      right: [redmushroomright1, redmushroomright2, redmushroomright3, redmushroomright4]
    };

    // Sprite mapping for grassSlime
    const grassSlimeSprites = {
      up: [grassslimeup1, grassslimeup2, grassslimeup3, grassslimeup4],
      down: [grassslimedown1, grassslimedown2, grassslimedown3, grassslimedown4],
      left: [grassslimeleft1, grassslimeleft2, grassslimeleft3, grassslimeleft4],
      right: [grassslimeright1, grassslimeright2, grassslimeright3, grassslimeright4]
    };

    // Sprite mapping for waterSlime
    const waterSlimeSprites = {
      up: [waterslimeup1, waterslimeup2, waterslimeup3, waterslimeup4],
      down: [waterslimedown1, waterslimedown2, waterslimedown3, waterslimedown4],
      left: [waterslimeleft1, waterslimeleft2, waterslimeleft3, waterslimeleft4],
      right: [waterslimeright1, waterslimeright2, waterslimeright3, waterslimeright4]
    };

    // Sprite mapping for heartz
    const heartzSprites = {
      up: [heartzup1, heartzup2, heartzup3, heartzup4],
      down: [heartzdown1, heartzdown2, heartzdown3, heartzdown4],
      left: [heartzleft1, heartzleft2, heartzleft3, heartzleft4],
      right: [heartzright1, heartzright2, heartzright3, heartzright4]
    };
    
    // Get the current frame (use frame 0 if not moving)
    const frame = isMoving ? currentFrame : 0;
    
    // Return the appropriate sprite based on enemy type
    switch (type) {
      case 'fireSpirit':
        return fireSpiritSprites[direction][frame];
      case 'redSkull':
        return redSkullSprites[direction][frame];
      case 'blueSkull':
        return blueSkullSprites[direction][frame];
      case 'blueOcto':
        return blueOctoSprites[direction][frame];
      case 'iceSpirit':
        return iceSpiritSprites[direction][frame];
      case 'redMushroom':
        return redMushroomSprites[direction][frame];
      case 'grassSlime':
        return grassSlimeSprites[direction][frame];
      case 'waterSlime':
        return waterSlimeSprites[direction][frame];
      case 'heartz':
        return heartzSprites[direction][frame];
      default:
        // For other enemy types, return placeholder URL structure
        const directionMap = {
          up: 0,
          right: 1,
          down: 2,
          left: 3
        };
        
        const dirIndex = directionMap[direction] || 0;
        const frameOffset = currentFrame;
        
        // Each sprite sheet would have 16 frames (4 directions × 4 frames)
        return `/path/to/sprites/enemies/${type}_${dirIndex}_${frameOffset}.png`;
    }
  };
  
  // Get enemy color based on type (for placeholder coloring)
  const getEnemyColor = () => {
    switch (type) {
      case 'fireSpirit': return '#f63';
      case 'iceSpirit': return '#3cf';
      case 'redMushroom': return '#f33';
      case 'blueMushroom': return '#3af';
      case 'greenOcto': return '#4c4';
      case 'blueOcto': return '#39f';
      case 'redSkull': return '#f33';
      case 'blueSkull': return '#39f';
      case 'heartz': return '#f6a';
      case 'furiousFireSpirit': return '#f00';
      case 'waterSlime': return '#39f';
      case 'grassSlime': return '#4c4';
      default: return '#f00';
    }
  };
    // Determine if we should use sprites or placeholders
  const hasSprites = ['fireSpirit', 'redSkull', 'blueSkull', 'blueOcto', 'iceSpirit', 'redMushroom', 'grassSlime', 'waterSlime', 'heartz'].includes(type);
  const spriteUrl = getEnemySpriteUrl();
  const placeholderColor = getEnemyColor();
  
  return (
    <EnemyContainer style={{ left: position.x, top: position.y }}>
      <EnemySprite 
        className={!hasSprites ? 'using-placeholder' : ''}
        spriteUrl={hasSprites ? spriteUrl : null}
        placeholderColor={placeholderColor}
      />
      
      {isBefriended && <BefriendedIndicator />}
      
      {isEating && <EatingIndicator>Eating...</EatingIndicator>}
    </EnemyContainer>
  );
};

export default Enemy;
