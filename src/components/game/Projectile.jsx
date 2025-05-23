import React from 'react';
import styled from 'styled-components';
import MagicAnimation from './MagicAnimation';

const ProjectileContainer = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  transform: translate(-50%, -50%);
  z-index: 5;
  filter: ${props => !['fire', 'ice', 'blast', 'grass', 'love'].includes(props.type) ? `drop-shadow(0 0 5px ${props.color || '#f00'})` : 'none'};
  
  &.default-projectile {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.color || '#f00'};
    filter: brightness(1.5) drop-shadow(0 0 5px ${props => props.color || '#f00'});
  }
`;

const Projectile = ({ position, color, type }) => {
  // For magic projectiles (fire, ice, blast, grass), use the MagicAnimation component
  const isMagicProjectile = ['fire', 'ice', 'blast', 'grass'].includes(type);
  
  // For non-magic projectiles, use the original styling with className
  return (
    <>
      {isMagicProjectile ? (
        <MagicAnimation 
          type={type} 
          position={position} 
        />
      ) : (
        <ProjectileContainer 
          className="default-projectile"
          style={{ 
            left: position.x, 
            top: position.y,
            ...getDefaultProjectileStyle(type)
          }}
          color={color}
          type={type}
        />
      )}
    </>
  );
};

// Get style for non-magic projectiles
const getDefaultProjectileStyle = (type) => {
  switch (type) {
    case 'thunder':
      return {
        boxShadow: '0 0 15px #ffff00',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        width: '12px',
        height: '15px',
        borderRadius: '0'
      };
    case 'bone':
      return {
        backgroundColor: '#ffffff',
        boxShadow: '0 0 5px #ffffff',
        width: '12px',
        height: '6px',
        borderRadius: '3px'
      };
    case 'dragon':
      return {
        background: 'radial-gradient(circle, #ff3300 0%, #990000 100%)',
        boxShadow: '0 0 15px #ff3300',
        width: '15px',
        height: '15px'
      };
    case 'water':
      return {
        background: 'radial-gradient(circle, #3399ff 0%, #0066cc 100%)',
        boxShadow: '0 0 10px #3399ff',
        width: '12px',
        height: '12px'
      };
    default:
      return {};
  }
};

export default Projectile;
