import React, { useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useGame } from '../../context/GameContext';
import Player from '../game/Player';
import Enemy from '../game/Enemy';
import Projectile from '../game/Projectile';
import SlashEffect from '../game/SlashEffect';
import PauseMenu from './PauseMenu';
import InventoryScreen from './InventoryScreen';
import DialogBox from '../ui/DialogBox';
import { getRandomFoodDrop } from '../../utils/foodItems';

// Import background images
import bg1 from '../../assets/images/background/bg1.png';
import bg2 from '../../assets/images/background/bg2.png';
import bg3 from '../../assets/images/background/bg3.png';

// Import heart images
import emptyHeart from '../../assets/images/ui/hearts/emptyheart.png';
import fullHeart from '../../assets/images/ui/hearts/fullheart.png';
import halfHeart from '../../assets/images/ui/hearts/halfheart.png';
import quarterHeart from '../../assets/images/ui/hearts/quarterheart.png';
import threeQuarterHeart from '../../assets/images/ui/hearts/threequarterheart.png';

// Import our new components and utilities
import MagicAnimation from '../game/MagicAnimation';
import magicTypes from '../../utils/magicTypes';

const GameContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const GameCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ScreenTransition = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
  z-index: 20;
  pointer-events: ${props => props.active ? 'auto' : 'none'};
`;

// Screen transition indicators that show when player is near edge
const EdgeIndicator = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 3;
  
  ${props => props.position === 'top' && `
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 10px;
  `}
  
  ${props => props.position === 'right' && `
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 10px;
    height: 100px;
  `}
  
  ${props => props.position === 'bottom' && `
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 10px;
  `}
  
  ${props => props.position === 'left' && `
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 10px;
    height: 100px;
  `}
`;

const HealthContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 5px;
`;

const HeartContainer = styled.div`
  width: 32px;
  height: 32px;
`;

const HeartImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const FoodCount = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
`;

const PointsCounter = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  font-size: 24px;
  color: gold;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  text-shadow: 0 0 5px gold;
`;

const WeaponStatus = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 18px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
`;

const MagicStatus = styled.div`
  position: absolute;
  bottom: 60px;
  left: 20px;
  font-size: 18px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  
  ${props => props.type === 'fire' && `
    color: #ff8833;
    text-shadow: 0 0 3px #ff5500;
  `}
  
  ${props => props.type === 'ice' && `
    color: #99ddff;
    text-shadow: 0 0 3px #00aaff;
  `}
  
  ${props => props.type === 'blast' && `
    color: #ff5555;
    text-shadow: 0 0 3px #dd0000;
  `}
  
  ${props => props.type === 'grass' && `
    color: #77dd77;
    text-shadow: 0 0 3px #44aa44;
  `}
  
  ${props => props.type === 'love' && `
    color: #ff88cc;
    text-shadow: 0 0 3px #ff44aa;
  `}
`;

// Hunger meter components removed

// Sleep button - added for the sleep feature
const SleepButton = styled.button`
  position: absolute;
  bottom: 60px;
  left: 20px;
  padding: 8px 16px;
  background-color: #336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #448;
  }
`;

// Helper function to determine direction from angle
const getDirectionFromAngle = (angle) => {
  // Convert angle from radians to degrees, normalize to 0-360
  const degrees = ((angle * 180 / Math.PI) + 360) % 360;
  
  // Determine direction based on angle
  if (degrees >= 315 || degrees < 45) return 'right';
  if (degrees >= 45 && degrees < 135) return 'down';
  if (degrees >= 135 && degrees < 225) return 'left';
  return 'up';
};

// Helper function to get angle from direction
const getAngleFromDirection = (direction) => {
  switch (direction) {
    case 'up': return -Math.PI / 2; // -90 degrees
    case 'right': return 0; // 0 degrees
    case 'down': return Math.PI / 2; // 90 degrees
    case 'left': return Math.PI; // 180 degrees
    default: return 0;
  }
};

const GameScreen = () => {
  const { state, dispatch, enemyTypes } = useGame();
  const gameContainerRef = useRef(null);
  const [dialog, setDialog] = useState(null);
  const [playerPosition, setPlayerPosition] = useState(state.player.position);
  const [keysPressed, setKeysPressed] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState(null);
  const [showSleepConfirm, setShowSleepConfirm] = useState(false);
  const [showLoveMagicAnimation, setShowLoveMagicAnimation] = useState(false);
  // Track enemies that are being hit with slash effects
  const [hitEnemies, setHitEnemies] = useState([]);
  
  // Track when dialog is showing to pause game mechanics
  const isDialogActive = dialog !== null || showSleepConfirm;
  
  // Determine background image based on level coordinates
  const backgroundImage = useMemo(() => {
    // Create a deterministic but seemingly random selection for each screen
    // Using the sum of x and y coordinates plus level number as a seed
    const seed = state.currentScreen.x + state.currentScreen.y + state.currentLevel;
    const backgroundImages = [bg1, bg2, bg3];
    
    // Use the seed to pick one of the backgrounds (consistent for the same screen)
    const index = Math.abs(seed) % backgroundImages.length;
    return backgroundImages[index];
  }, [state.currentScreen.x, state.currentScreen.y, state.currentLevel]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { keyBindings } = state;

      // Don't handle keyboard during transition
      if (isTransitioning) return;

      // Map keys to actions
      if (Object.values(keyBindings).includes(e.key)) {
        setKeysPressed(prev => ({ ...prev, [e.key]: true }));
        
        // Handle pause
        if (e.key === keyBindings.pause && state.screen === 'game') {
          dispatch({ type: 'SET_SCREEN', payload: 'pause' });
        } else if (e.key === keyBindings.pause && state.screen === 'pause') {
          dispatch({ type: 'SET_SCREEN', payload: 'game' });
        }
        
        // Handle inventory
        if (e.key === keyBindings.inventory && state.screen === 'game') {
          dispatch({ type: 'SET_SCREEN', payload: 'inventory' });
        } else if (e.key === keyBindings.inventory && state.screen === 'inventory') {
          dispatch({ type: 'SET_SCREEN', payload: 'game' });
        }
        
        // Handle attack
        if (e.key === keyBindings.attack && state.screen === 'game') {
          dispatch({ type: 'ATTACK', payload: true });
          // Reset attack after animation completes
          setTimeout(() => {
            dispatch({ type: 'ATTACK', payload: false });
          }, 300);
        }
          // Handle magic
        if (e.key === keyBindings.magic && state.screen === 'game') {
          if (state.magic) {
            dispatch({ type: 'USE_MAGIC', payload: true });
            
            // Handle different magic types
            if (state.magic === 'love') {
              // Love magic is a special case - heals player to full hearts
              setShowLoveMagicAnimation(true);
              dispatch({ type: 'USE_LOVE_MAGIC' });
              
              // Reset magic usage after animation completes
              setTimeout(() => {
                dispatch({ type: 'USE_MAGIC', payload: false });
              }, 1500);
            } else {
              // Handle projectile-based magic
              const angle = getAngleFromDirection(state.player.direction);
              const magicConfig = magicTypes[state.magic] || magicTypes.fire;
              
              // Create projectile
              const projectile = {
                id: Date.now().toString(),
                position: { ...state.player.position },
                origin: { ...state.player.position },
                velocity: {
                  x: Math.cos(angle) * magicConfig.projectileSpeed,
                  y: Math.sin(angle) * magicConfig.projectileSpeed
                },
                range: magicConfig.projectileRange,
                damage: magicConfig.damage,
                color: magicConfig.color,
                fromEnemy: false,
                createdAt: Date.now(),
                type: state.magic
              };
              
              dispatch({ type: 'ADD_PROJECTILE', payload: projectile });
              
              // Reset magic after animation completes
              setTimeout(() => {
                dispatch({ type: 'USE_MAGIC', payload: false });
              }, 500);
            }
          } else {
            // No magic available
            dispatch({ type: 'USE_MAGIC', payload: true });
            setTimeout(() => {
              dispatch({ type: 'USE_MAGIC', payload: false });
            }, 300);
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      const { keyBindings } = state;
      if (Object.values(keyBindings).includes(e.key)) {
        setKeysPressed(prev => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.keyBindings, state.screen, isTransitioning, dispatch]);  // Handle player movement
  useEffect(() => {
    if (state.screen !== 'game') return;
    
    const movePlayer = () => {
      const { keyBindings } = state;
      let dx = 0;
      let dy = 0;
      let direction = state.player.direction;
      const speed = 5;
      
      // Prevent diagonal movement and ensure only one direction works if multiple keys are pressed
      // Using a priority order: up, down, left, right
      // This means if multiple keys are pressed, only the highest priority one will work
      if (keysPressed[keyBindings.up]) {
        dy -= speed;
        direction = 'up';
      } else if (keysPressed[keyBindings.down]) {
        dy += speed;
        direction = 'down';
      } else if (keysPressed[keyBindings.left]) {
        dx -= speed;
        direction = 'left';
      } else if (keysPressed[keyBindings.right]) {
        dx += speed;
        direction = 'right';
      }
      
      // Only update if there's actual movement
      if (dx !== 0 || dy !== 0) {
        // Calculate new position
        let newX = state.player.position.x + dx;
        let newY = state.player.position.y + dy;
        
        // Check screen boundaries for transitions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Check if player is going to next screen
        if (newX < 0) {
          // Left screen transition
          setIsTransitioning(true);
          setTransitionDirection('left');
          
          // After transition animation completes, change screen
          setTimeout(() => {
            dispatch({
              type: 'CHANGE_SCREEN',
              payload: {
                x: state.currentScreen.x - 1,
                y: state.currentScreen.y
              }
            });
            
            // Reset player position to right edge
            dispatch({
              type: 'MOVE_PLAYER',
              payload: {
                position: { x: screenWidth - 50, y: newY },
                direction,
                isMoving: false
              }
            });
            
            setIsTransitioning(false);
          }, 300);
          
          return;
        } else if (newX > screenWidth) {
          // Right screen transition
          setIsTransitioning(true);
          setTransitionDirection('right');
          
          setTimeout(() => {
            dispatch({
              type: 'CHANGE_SCREEN',
              payload: {
                x: state.currentScreen.x + 1,
                y: state.currentScreen.y
              }
            });
            
            // Reset player position to left edge
            dispatch({
              type: 'MOVE_PLAYER',
              payload: {
                position: { x: 50, y: newY },
                direction,
                isMoving: false
              }
            });
            
            setIsTransitioning(false);
          }, 300);
          
          return;
        } else if (newY < 0) {
          // Top screen transition
          setIsTransitioning(true);
          setTransitionDirection('up');
          
          setTimeout(() => {
            dispatch({
              type: 'CHANGE_SCREEN',
              payload: {
                x: state.currentScreen.x,
                y: state.currentScreen.y - 1
              }
            });
            
            // Reset player position to bottom edge
            dispatch({
              type: 'MOVE_PLAYER',
              payload: {
                position: { x: newX, y: screenHeight - 50 },
                direction,
                isMoving: false
              }
            });
            
            setIsTransitioning(false);
          }, 300);
          
          return;
        } else if (newY > screenHeight) {
          // Bottom screen transition
          setIsTransitioning(true);
          setTransitionDirection('down');
          
          setTimeout(() => {
            dispatch({
              type: 'CHANGE_SCREEN',
              payload: {
                x: state.currentScreen.x,
                y: state.currentScreen.y + 1
              }
            });
            
            // Reset player position to top edge
            dispatch({
              type: 'MOVE_PLAYER',
              payload: {
                position: { x: newX, y: 50 },
                direction,
                isMoving: false
              }
            });
            
            setIsTransitioning(false);
          }, 300);
          
          return;
        }
        
        // Normal movement within screen
        dispatch({
          type: 'MOVE_PLAYER',
          payload: {
            position: { x: newX, y: newY },
            direction,
            isMoving: true
          }
        });
      } else {
        // Player stopped moving
        if (state.player.isMoving) {
          dispatch({
            type: 'MOVE_PLAYER',
            payload: {
              position: state.player.position,
              direction,
              isMoving: false
            }
          });
        }
      }
    };
    
    const movementInterval = setInterval(movePlayer, 16);
    return () => clearInterval(movementInterval);
  }, [keysPressed, state.screen, state.player, state.currentScreen, dispatch, isTransitioning]);

  // Show transition indicators when player is near screen edges
  const [edgeIndicators, setEdgeIndicators] = useState({
    top: false,
    right: false,
    bottom: false,
    left: false
  });
  
  useEffect(() => {
    if (state.screen !== 'game') return;
    
    const checkEdges = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const edgeThreshold = 100; // How close to edge before showing indicator
      const pos = state.player.position;
      
      setEdgeIndicators({
        top: pos.y < edgeThreshold,
        right: pos.x > screenWidth - edgeThreshold,
        bottom: pos.y > screenHeight - edgeThreshold,
        left: pos.x < edgeThreshold
      });
    };
      const edgeCheckInterval = setInterval(checkEdges, 100);
    return () => clearInterval(edgeCheckInterval);  
  }, [state.screen, state.player.position]);
    // Enemy movement and AI  
  useEffect(() => {
    if (state.screen !== 'game' || isTransitioning || isDialogActive) return;
    
    const enemyMovementInterval = setInterval(() => {
      // Each enemy moves independently regardless of player's movement state
      const updatedEnemies = state.enemies.map(enemy => {
        // Skip befriended enemies for now (they move differently)
        if (enemy.isBefriended) return enemy;
        
        // Enemy type data
        const enemyType = enemyTypes.find(type => type.id === enemy.type);
        if (!enemyType) return enemy;
        
        // Calculate distance to player
        const distToPlayer = Math.sqrt(
          Math.pow(state.player.position.x - enemy.position.x, 2) +
          Math.pow(state.player.position.y - enemy.position.y, 2)
        );
        
        // Random movement or follow player
        let newPosition = { ...enemy.position };
        let newDirection = enemy.direction;
        
        const now = Date.now();
        const moveTime = now - (enemy.lastMoved || 0);
          // Enemies can attack with projectiles regardless of player movement state
        if (enemyType.attackType === 'projectile' && distToPlayer < enemyType.projectileRange) {
          // Check attack cooldown - making attacks more frequent and consistent
          if (!enemy.lastAttack || now - enemy.lastAttack > enemyType.attackCooldown) {
            // Calculate angle to player
            const angle = Math.atan2(
              state.player.position.y - enemy.position.y,
              state.player.position.x - enemy.position.x
            );
              // Create projectile
            const projectile = {
              id: Date.now().toString(),
              position: { ...enemy.position },
              origin: { ...enemy.position },
              velocity: {
                x: Math.cos(angle) * enemyType.projectileSpeed,
                y: Math.sin(angle) * enemyType.projectileSpeed
              },
              range: enemyType.projectileRange,
              damage: enemyType.projectileDamage,
              color: enemyType.projectileColor,
              fromEnemy: true,
              createdAt: Date.now(),
              type: enemyType.weaponEnhancement // Use the weaponEnhancement property for accurate typing
            };
            
            dispatch({ type: 'ADD_PROJECTILE', payload: projectile });
            
            // Update enemy with attack time
            return {
              ...enemy,
              lastMoved: now,
              lastAttack: now,
              direction: getDirectionFromAngle(angle)
            };
          }
        }        // Enemy movement AI - ensure movement happens regardless of player state
        // Lower the time threshold to make movement more frequent
        if (moveTime > 500 / enemy.speed) { // Adjusted movement time interval for more responsive enemies
          if (distToPlayer < 200 && !enemy.isBefriended) {
            // Follow player when close
            const angle = Math.atan2(
              state.player.position.y - enemy.position.y,
              state.player.position.x - enemy.position.x
            );
            
            newDirection = getDirectionFromAngle(angle);
            // Move in only one direction (no diagonals) based on the predominant axis
            const xDiff = Math.abs(state.player.position.x - enemy.position.x);
            const yDiff = Math.abs(state.player.position.y - enemy.position.y);
            
            newPosition = { ...enemy.position };
            
            if (xDiff > yDiff) {
              // Move horizontally
              if (state.player.position.x > enemy.position.x) {
                newPosition.x = enemy.position.x + enemy.speed;
                newDirection = 'right';
              } else {
                newPosition.x = enemy.position.x - enemy.speed;
                newDirection = 'left';
              }
            } else {
              // Move vertically
              if (state.player.position.y > enemy.position.y) {
                newPosition.y = enemy.position.y + enemy.speed;
                newDirection = 'down';
              } else {
                newPosition.y = enemy.position.y - enemy.speed;
                newDirection = 'up';
              }
            }          } else {
            // Random movement
            if (Math.random() < 0.12) { // Reduced probability (was 0.3) so enemies continue longer in same direction
              // Change direction occasionally
              const directions = ['up', 'down', 'left', 'right'];
              newDirection = directions[Math.floor(Math.random() * 4)];
            }
            
            // Move in current direction
            switch (newDirection) {
              case 'up':
                newPosition.y -= enemy.speed;
                break;
              case 'down':
                newPosition.y += enemy.speed;
                break;
              case 'left':
                newPosition.x -= enemy.speed;
                break;
              case 'right':
                newPosition.x += enemy.speed;
                break;
              default:
                break;
            }
          }
          
          // Keep enemy on screen
          newPosition.x = Math.max(20, Math.min(window.innerWidth - 20, newPosition.x));
          newPosition.y = Math.max(20, Math.min(window.innerHeight - 20, newPosition.y));
          
          // Update enemy position
          return {
            ...enemy,
            position: newPosition,
            direction: newDirection,
            lastMoved: now
          };
        }
        
        return enemy;
      });
      
      dispatch({ type: 'UPDATE_ENEMIES', payload: updatedEnemies });      
      // Check for collisions between player and enemies
      checkCollisions();
    }, 50); // Reduced from 100ms to 50ms for more responsive enemies
    
    return () => clearInterval(enemyMovementInterval);}, [state.screen, state.enemies, enemyTypes, dispatch, isTransitioning, isDialogActive]); // Removed state.player.position from dependencies so enemies keep moving during player movement
    // Handle projectile movement and collisions
  useEffect(() => {
    if (state.screen !== 'game' || !state.projectiles || isTransitioning || isDialogActive) return;
    
    const projectileInterval = setInterval(() => {
      // Update each projectile's position
      const now = Date.now();
      let updatedProjectiles = state.projectiles.map(projectile => {
        // Calculate new position
        const newPosition = {
          x: projectile.position.x + projectile.velocity.x,
          y: projectile.position.y + projectile.velocity.y
        };
        
        // Check if projectile is out of bounds or reached max range
        const distTraveled = Math.sqrt(
          Math.pow(newPosition.x - projectile.origin.x, 2) +
          Math.pow(newPosition.y - projectile.origin.y, 2)
        );
        
        if (
          newPosition.x < 0 ||
          newPosition.x > window.innerWidth ||
          newPosition.y < 0 ||
          newPosition.y > window.innerHeight ||
          distTraveled > projectile.range ||
          now - projectile.createdAt > 10000 // safety timeout of 10 seconds
        ) {
          return null; // Remove projectile
        }
        
        // Check for collision with player
        if (projectile.fromEnemy) {
          const distToPlayer = Math.sqrt(
            Math.pow(state.player.position.x - newPosition.x, 2) +
            Math.pow(state.player.position.y - newPosition.y, 2)
          );
          
          if (distToPlayer < 30) { // Player hit radius
            // Player takes damage from projectile
            dispatch({ type: 'TAKE_DAMAGE', payload: projectile.damage });
            return null; // Remove projectile
          }
        }
        
        // Check for collision with enemies (if player projectile)
        if (!projectile.fromEnemy) {
          for (const enemy of state.enemies) {
            if (enemy.isBefriended) continue;
            
            const distToEnemy = Math.sqrt(
              Math.pow(enemy.position.x - newPosition.x, 2) +
              Math.pow(enemy.position.y - newPosition.y, 2)
            );
            
            if (distToEnemy < 30) { // Enemy hit radius
              // Update enemy health in a separate dispatch
              const newHealth = enemy.health - 1;              if (newHealth <= 0) {
                // Give points when enemy is defeated
                const enemyType = enemyTypes.find(et => et.id === enemy.type);
                if (enemyType && enemyType.pointValue) {
                  dispatch({ type: 'ADD_POINTS', payload: enemyType.pointValue });
                }
                
                // Give food when enemy is defeated - randomly select food from possible drops
                const foodDrop = getRandomFoodDrop(enemy.type);
                if (foodDrop) {
                  dispatch({ type: 'ADD_FOOD', payload: foodDrop });
                }
                
                // Random chance (20%) to get magic power from the defeated enemy
                if (Math.random() < 0.2) {
                  const enemyTypeData = enemyTypes.find(et => et.id === enemy.type);
                  if (enemyTypeData && enemyTypeData.weaponEnhancement) {
                    dispatch({ type: 'SET_MAGIC', payload: enemyTypeData.weaponEnhancement });
                  }
                }
                
                // Remove enemy
                dispatch({ 
                  type: 'UPDATE_ENEMIES', 
                  payload: state.enemies.filter(e => e.id !== enemy.id) 
                });
              } else {
                // Update enemy health
                dispatch({
                  type: 'UPDATE_ENEMIES',
                  payload: state.enemies.map(e => 
                    e.id === enemy.id ? { ...e, health: newHealth } : e
                  )
                });
              }
              
              return null; // Remove projectile
            }
          }
        }
        
        // Update projectile position
        return {
          ...projectile,
          position: newPosition
        };
      }).filter(Boolean); // Remove null projectiles
      
      // Update projectiles in state
      dispatch({ type: 'UPDATE_PROJECTILES', payload: updatedProjectiles });
    }, 16); // 60 FPS
      return () => clearInterval(projectileInterval);  
  }, [state.screen, state.projectiles, state.player.position, state.enemies, dispatch]);
  
  // Check for collisions between player and enemies
  const checkCollisions = () => {
    if (isTransitioning || isDialogActive) return;
    
    if (state.player.isAttacking) {
      // Check if attacking enemies
      const updatedEnemies = state.enemies.map(enemy => {
        if (enemy.isBefriended) return enemy;
        
        // Check collision with player's attack
        const distance = Math.sqrt(
          Math.pow(state.player.position.x - enemy.position.x, 2) +
          Math.pow(state.player.position.y - enemy.position.y, 2)
        );
        
        // Attack range is 60px
        if (distance < 60) {
          // Add slash effect to this enemy
          setHitEnemies(prev => {
            // If this enemy already has a slash effect, return the current list
            if (prev.some(e => e.id === enemy.id)) {
              // Reset the existing slash effect by removing and re-adding it
              return prev.filter(e => e.id !== enemy.id).concat({
                id: enemy.id,
                position: { x: enemy.position.x, y: enemy.position.y }
              });
            }
            // Otherwise, add this enemy to the hit list
            return [...prev, { 
              id: enemy.id, 
              position: { x: enemy.position.x, y: enemy.position.y }
            }];
          });
          
          // Enemy takes damage
          const newHealth = enemy.health - 1;
            // If enemy is defeated
          if (newHealth <= 0) {
            // Give random food drop based on enemy type
            const foodDrop = getRandomFoodDrop(enemy.type);
            if (foodDrop) {
              dispatch({ type: 'ADD_FOOD', payload: foodDrop });
            }
            
            // Find enemy type data to get point value
            const enemyTypeData = enemyTypes.find(type => type.id === enemy.type);
            if (enemyTypeData) {
              // Add points based on enemy type
              dispatch({ type: 'ADD_POINTS', payload: enemyTypeData.pointValue });
            }
            
            // Remove enemy (and its slash effect if present)
            setHitEnemies(prev => prev.filter(e => e.id !== enemy.id));
            return null;
          }
          
          return { ...enemy, health: newHealth };
        }
        
        return enemy;
      }).filter(Boolean);
      
      dispatch({ type: 'UPDATE_ENEMIES', payload: updatedEnemies });
    } else {
      // Check if enemies are hitting player
      state.enemies.forEach(enemy => {
        if (enemy.isBefriended) return;
        
        // Check collision with player
        const distance = Math.sqrt(
          Math.pow(state.player.position.x - enemy.position.x, 2) +
          Math.pow(state.player.position.y - enemy.position.y, 2)
        );
        
        // Collision range is 40px
        if (distance < 40) {
          // Player takes damage
          dispatch({ type: 'TAKE_DAMAGE', payload: enemy.damage });
        }
      });
    }
  };

  // Handle giving food to an enemy to befriend them
  const handleThrowFood = (food) => {
    if (!food || state.inventory.foods.length === 0) {
      setDialog({
        character: 'Player',
        text: "I don't have any food to give."
      });
      return;
    }
    
    // Find the closest enemy
    let closestEnemy = null;
    let closestDistance = Infinity;
    
    state.enemies.forEach(enemy => {
      if (enemy.isBefriended) return;
      
      const distance = Math.sqrt(
        Math.pow(state.player.position.x - enemy.position.x, 2) +
        Math.pow(state.player.position.y - enemy.position.y, 2)
      );
      
      // Within range to feed (80px)
      if (distance < 80 && distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    });
    
    if (!closestEnemy) {
      setDialog({
        character: 'Player',
        text: "There's no one close enough to give food to."
      });
      return;
    }
    
    // Befriend the enemy
    const updatedEnemies = state.enemies.map(enemy => {
      if (enemy.id === closestEnemy.id) {
        // 70% chance of befriending, increased by food quality
        const foodQuality = food.rarity === 'rare' ? 0.2 : 
                           food.rarity === 'uncommon' ? 0.1 : 0;
        
        const befriendChance = 0.7 + foodQuality;
        
        if (Math.random() < befriendChance) {
          setDialog({
            character: enemy.name,
            text: "Thanks for the food! I'll be your friend for a while."
          });
          
          const befriendedTimer = Date.now() + (30000 + Math.random() * 30000); // 30-60 seconds
          
          // Update weapon enhancement based on befriended enemy
          const enemyType = enemyTypes.find(type => type.id === enemy.type);
          if (enemyType) {
            dispatch({ 
              type: 'BEFRIEND_ENEMY', 
              payload: { 
                enemy, 
                timer: befriendedTimer,
                weaponEnhancement: enemyType.weaponEnhancement
              } 
            });
          }
          
          return { ...enemy, isBefriended: true };
        } else {
          setDialog({
            character: enemy.name,
            text: "Thanks for the food, but I'm not interested in friendship."
          });
        }
      }
      return enemy;
    });
    
    // Use the food
    dispatch({ type: 'THROW_FOOD', payload: food });
    dispatch({ type: 'UPDATE_ENEMIES', payload: updatedEnemies });  };
  
  // Handle sleeping functionality  
  const handleSleep = () => {
    // Check if there are enemies in the room
    if (state.enemies.length > 0) {
      setDialog({
        character: 'Player',
        text: "I can't sleep while there are enemies nearby. I must clear the room first."
      });
      return;
    }
    
    // First show confirmation
    setShowSleepConfirm(true);
  };
  
  const confirmSleep = () => {
    // Create screen dimming effect
    setIsTransitioning(true); // Reusing the transition state for the dimming effect
    
    // After 2 seconds, restore health and show dialog
    setTimeout(() => {
      // Implement sleeping to restore health
      dispatch({ type: 'SLEEP' });
        setDialog({
        character: 'Player',
        text: "That was a good sleep. My health is restored!"
      });
        // End dimming effect
      setIsTransitioning(false);
      setShowSleepConfirm(false);
    }, 2000);
  };
  
  // Render health as hearts
  const renderHearts = () => {
    const hearts = [];
    const fullHearts = Math.floor(state.player.health);
    const remainder = state.player.health % 1; // Get decimal part for partial hearts
    
    for (let i = 0; i < state.player.maxHealth; i++) {
      if (i < fullHearts) {
        // Full heart
        hearts.push(
          <HeartContainer key={`heart-${i}`}>
            <HeartImage src={fullHeart} alt="Full Heart" />
          </HeartContainer>
        );
      } else if (i === fullHearts && remainder > 0) {
        // Partial heart based on remainder value
        let heartImage;
        if (remainder >= 0.75) {
          heartImage = threeQuarterHeart;
        } else if (remainder >= 0.5) {
          heartImage = halfHeart;
        } else if (remainder >= 0.25) {
          heartImage = quarterHeart;
        } else {
          heartImage = emptyHeart;
        }
        
        hearts.push(
          <HeartContainer key={`heart-${i}`}>
            <HeartImage src={heartImage} alt="Partial Heart" />
          </HeartContainer>
        );
      } else {
        // Empty heart
        hearts.push(
          <HeartContainer key={`heart-${i}`}>
            <HeartImage src={emptyHeart} alt="Empty Heart" />
          </HeartContainer>
        );
      }
    }
    
    return hearts;
  };
  // Return to start menu when player dies
  useEffect(() => {
    if (state.player.health <= 0) {
      // Create a detailed game over message with final score
      setDialog({
        character: 'Game Over',
        text: `You have died. Final score: ${state.score} points. Press F to return to menu.`,
        isGameOver: true
      });
      
      // Add event listener for F key to return to menu
      const handleGameOverKeyPress = (e) => {
        if (e.key === 'f' || e.key === 'F') {
          window.removeEventListener('keydown', handleGameOverKeyPress);
          dispatch({ type: 'RESET_GAME' });
          dispatch({ type: 'SET_SCREEN', payload: 'start' });
        }
      };
      
      window.addEventListener('keydown', handleGameOverKeyPress);
      
      // Fallback timer (will be cleared if user presses F)
      const timerId = setTimeout(() => {
        window.removeEventListener('keydown', handleGameOverKeyPress);
        dispatch({ type: 'RESET_GAME' });
        dispatch({ type: 'SET_SCREEN', payload: 'start' });
      }, 5000); // Reduced from 10000 to 5000 for faster return to menu
      
      return () => {
        clearTimeout(timerId);
        window.removeEventListener('keydown', handleGameOverKeyPress);
      };
    }
  }, [state.player.health, state.score, dispatch]);

  if (state.screen === 'pause') {
    return <PauseMenu />;
  }

  if (state.screen === 'inventory') {
    return <InventoryScreen onThrowFood={handleThrowFood} />;
  }
  return (
    <GameContainer ref={gameContainerRef} backgroundImage={backgroundImage}>
      <GameCanvas>
        {state.enemies.map(enemy => (
          <Enemy 
            key={enemy.id}
            position={enemy.position}
            direction={enemy.direction}
            type={enemy.type}
            isBefriended={enemy.isBefriended}
          />
        ))}
        
        <Player 
          position={state.player.position}
          direction={state.player.direction}
          isMoving={state.player.isMoving}
          isAttacking={state.player.isAttacking}
          isUsingMagic={state.player.isUsingMagic}
          weaponStatus={state.weaponStatus}        />
        
        {state.projectiles && state.projectiles.map(projectile => (
          <Projectile 
            key={projectile.id}
            position={projectile.position}
            color={projectile.color}
            type={projectile.type}
          />
        ))}
        
        {/* Slash effects on hit enemies */}
        {hitEnemies.map(enemy => (
          <SlashEffect
            key={`slash-${enemy.id}`}
            position={enemy.position}
            onAnimationComplete={() => {
              // Remove this enemy from the hit list when animation is done
              setHitEnemies(current => current.filter(e => e.id !== enemy.id));
            }}
          />
        ))}
        
        {/* Edge indicators for screen transitions */}
        {edgeIndicators.top && <EdgeIndicator position="top" />}
        {edgeIndicators.right && <EdgeIndicator position="right" />}
        {edgeIndicators.bottom && <EdgeIndicator position="bottom" />}        {edgeIndicators.left && <EdgeIndicator position="left" />}
          {/* Health display */}
        <HealthContainer>
          {renderHearts()}
        </HealthContainer>
          {/* Points counter */}
        <PointsCounter>
          Points: {state.score}
        </PointsCounter>
        
        {/* Weapon status */}
        {state.weaponStatus !== 'normal' && (
          <WeaponStatus>
            Weapon: {state.weaponStatus.charAt(0).toUpperCase() + state.weaponStatus.slice(1)}
          </WeaponStatus>
        )}

        
        {/* Sleep button */}
        <SleepButton onClick={handleSleep}>Sleep</SleepButton>
        
        {/* Screen transition effect */}
        <ScreenTransition active={isTransitioning} />
          {/* Dialog box */}
        {dialog && (
          <DialogBox
            character={dialog.character}
            text={dialog.text}
            onClose={() => setDialog(null)}
            isGameOver={dialog.isGameOver}
          />
        )}
          {/* Sleep confirmation */}        {showSleepConfirm && (
          <DialogBox
            character="Sleep"
            text="Are you sure you want to sleep? You'll recover some health but might be vulnerable while resting."
            onClose={() => setShowSleepConfirm(false)}
            options={[
              { text: "Yes, sleep", action: confirmSleep },
              { text: "No, stay awake", action: () => setShowSleepConfirm(false) }
            ]}
          />
        )}
        
        {/* Love magic animation when used */}
        {showLoveMagicAnimation && (
          <MagicAnimation 
            type="love" 
            position={state.player.position} 
            isCentered={true}
            onComplete={() => setShowLoveMagicAnimation(false)} 
          />
        )}
      </GameCanvas>
    </GameContainer>
  );
};

export default GameScreen;
