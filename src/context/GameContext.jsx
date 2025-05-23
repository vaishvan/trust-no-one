import { createContext, useReducer, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GameContext = createContext();

// Function to generate randomized key bindings
const generateRandomKeyBindings = () => {
  // Available keys to use
  const availableKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'f', 'd', 'Enter', 'g'];
  
  // Shuffle the array
  const shuffledKeys = [...availableKeys].sort(() => 0.5 - Math.random());
  
  // Assign keys to actions
  return {
    up: shuffledKeys[0],
    down: shuffledKeys[1],
    left: shuffledKeys[2],
    right: shuffledKeys[3],
    attack: shuffledKeys[4],
    magic: shuffledKeys[5],
    pause: shuffledKeys[6],
    inventory: shuffledKeys[7],
  };
};

// Initial game state
const initialState = {
  screen: 'start', // 'start', 'game', 'pause', 'inventory'
  score: 0, // Track player score - explicitly a number
  player: {
    health: 3, // 3 hearts
    maxHealth: 3, // Maximum hearts the player can have
    position: { x: 400, y: 300 },
    direction: 'down', // 'up', 'down', 'left', 'right'
    isMoving: false,
    isAttacking: false,
    isUsingMagic: false,
    hunger: 100, // Hunger meter (0-100)
    lastEaten: Date.now(),
  },inventory: {
    foods: [], // Array of food objects {id, name, hunger, health, img, rarity}
    maxSlots: 12,  // Maximum food slots in inventory
  },currentScreen: { x: 0, y: 0 }, // Grid coordinates for the current screen
  screens: {}, // Will store screen data with enemies, obstacles, etc. keyed by 'x,y' coordinate
  worldMap: {}, // Maps screen coordinates to levels
  currentLevel: 1,  enemies: [], // Will be populated randomly for each level  projectiles: [], // Store active projectiles in the game
  befriendedEnemy: null,
  befriendedEnemyTimer: null,
  weaponStatus: 'normal', // normal, fire, ice, etc.
  magic: null, // Current active magic type (fire, ice, blast, grass, love)
  usedLoveMagic: false, // Track if love magic has been used (one-time use)
  keyBindings: generateRandomKeyBindings(), // Randomized key bindings
  settings: {
    volume: 0.5,
  },
};

// Enemy types - 12 kinds as mentioned in requirements
const enemyTypes = [
  { 
    id: 'fireSpirit', 
    name: 'Fire Spirit',
    pointValue: 50, // Points for defeating this enemy 
    damage: 1.0,
    speed: 2, 
    weaponEnhancement: 'fire', 
    foodDrop: 1,
    attackType: 'projectile',
    projectileSpeed: 5,
    projectileRange: 200,
    projectileDamage: 0.5,
    projectileColor: '#f63',
    attackCooldown: 3000, // ms
  },
  { 
    id: 'redSkull', 
    name: 'Red Skull',
    pointValue: 70, // Points for defeating this enemy 
    damage: 1.2,
    speed: 2, 
    weaponEnhancement: 'fire', 
    foodDrop: 2,
    attackType: 'projectile',
    projectileSpeed: 5,
    projectileRange: 180,
    projectileDamage: 0.7,
    projectileColor: '#f33',
    attackCooldown: 3200, // ms
  },
  { 
    id: 'blueSkull', 
    name: 'Blue Skull',
    pointValue: 65, // Points for defeating this enemy 
    damage: 0.8,
    speed: 3, 
    weaponEnhancement: 'ice', 
    foodDrop: 2,
    attackType: 'projectile',
    projectileSpeed: 6,
    projectileRange: 200,
    projectileDamage: 0.6,
    projectileColor: '#39f',
    attackCooldown: 2800, // ms
  },    { 
    id: 'iceSpirit', 
    name: 'Ice Spirit',
    pointValue: 60, // Points for defeating this enemy
    damage: 0.5, 
    speed: 3, 
    weaponEnhancement: 'ice', 
    foodDrop: 1,
    attackType: 'projectile',
    projectileSpeed: 4,
    projectileRange: 180,
    projectileDamage: 0.25,
    projectileColor: '#3cf',
    attackCooldown: 2500,
  },
  { 
    id: 'blueOcto', 
    name: 'Blue Octopus', 
    damage: 0.7, 
    speed: 2, 
    weaponEnhancement: 'water', 
    foodDrop: 2,
    attackType: 'melee',
    attackRange: 50,
    attackCooldown: 2000,
  },  { 
    id: 'redMushroom', 
    name: 'Red Mushroom', 
    damage: 0.6, 
    speed: 1, 
    weaponEnhancement: 'blast', 
    foodDrop: 2,
    attackType: 'melee',
    attackRange: 40,
    attackCooldown: 2500,
  },
  { 
    id: 'grassSlime', 
    name: 'Grass Slime', 
    damage: 0.4, 
    speed: 2, 
    weaponEnhancement: 'grass', 
    foodDrop: 1,
    attackType: 'melee',
    attackRange: 35,
    attackCooldown: 2000,
  },
  { 
    id: 'waterSlime', 
    name: 'Water Slime', 
    damage: 0.5, 
    speed: 2, 
    weaponEnhancement: 'water', 
    foodDrop: 1,
    attackType: 'projectile',
    projectileSpeed: 4,
    projectileRange: 150,
    projectileDamage: 0.4,
    projectileColor: '#39f',
    attackCooldown: 2500,
  },
  { 
    id: 'heartz', 
    name: 'Heartz', 
    damage: 0.3, 
    speed: 3, 
    weaponEnhancement: 'love', 
    foodDrop: 3,
    attackType: 'melee',
    attackRange: 30,
    attackCooldown: 1800,
  },
];

// Reducer function to handle state changes
const gameReducer = (state, action) => {
  switch (action.type) {    case 'SET_SCREEN':
      // When switching between screens, preserve the current enemies
      // This prevents regeneration when opening/closing inventory or pause screens
      return { ...state, screen: action.payload };
    
    case 'MOVE_PLAYER':
      return { 
        ...state, 
        player: { 
          ...state.player, 
          position: action.payload.position,
          direction: action.payload.direction,
          isMoving: action.payload.isMoving,
        } 
      };
    
    case 'ATTACK':
      return { 
        ...state, 
        player: { 
          ...state.player, 
          isAttacking: action.payload 
        } 
      };
    
    case 'USE_MAGIC':
      return { 
        ...state, 
        player: { 
          ...state.player, 
          isUsingMagic: action.payload 
        } 
      };
    
    case 'TAKE_DAMAGE':
      return { 
        ...state, 
        player: { 
          ...state.player, 
          health: Math.max(0, state.player.health - action.payload) 
        } 
      };
    
    case 'HEAL':
      return { 
        ...state, 
        player: { 
          ...state.player, 
          health: Math.min(3, state.player.health + action.payload) 
        } 
      };
      case 'ADD_FOOD':
      // If numeric value, just add to food count (backwards compatibility)
      if (typeof action.payload === 'number') {
        return { 
          ...state, 
          player: { 
            ...state.player, 
            food: state.player.food + action.payload 
          } 
        };
      }
      
      // If it's a food object, add to inventory
      if (state.inventory.foods.length >= state.inventory.maxSlots) {
        // Inventory is full
        return state;
      }
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          foods: [...state.inventory.foods, {
            ...action.payload,
            id: action.payload.id + Date.now(), // Ensure unique ID
          }]
        }
      };
      case 'EAT_FOOD':
      // If no food specified, use old behavior
      if (!action.payload) {
        if (state.player.food <= 0) return state;
        return { 
          ...state, 
          player: { 
            ...state.player, 
            food: state.player.food - 1,
            hunger: 100,
            lastEaten: Date.now(),
          } 
        };
      }
        // Handle eating specific food from inventory
      const foodToEat = action.payload;
      // 10% chance of food being poisoned
      const isPoisoned = Math.random() < 0.1;
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          foods: state.inventory.foods.filter(f => f.id !== foodToEat.id)
        },
        player: {
          ...state.player,
          hunger: Math.min(100, state.player.hunger + (isPoisoned ? 0 : foodToEat.hunger)),
          health: isPoisoned 
            ? Math.max(0, state.player.health - 1) // Decrease health by 1 heart if poisoned
            : Math.min(state.player.maxHealth, state.player.health + foodToEat.health),
          lastEaten: Date.now(),
        }
      };
        case 'THROW_FOOD':
      // Handle throwing food to befriend enemies
      const foodToThrow = action.payload;
      return {
        ...state,
        inventory: {
          ...state.inventory,
          foods: state.inventory.foods.filter(f => f.id !== foodToThrow.id)
        }
      };
      
    case 'DROP_FOOD':
      // Handle dropping food on the ground
      const foodToDrop = action.payload;
      return {
        ...state,
        inventory: {
          ...state.inventory,
          foods: state.inventory.foods.filter(f => f.id !== foodToDrop.id)
        },
        // Could add a droppedFood array to state if we want to track dropped foods
      };
    
    case 'UPDATE_HUNGER':
      return { 
        ...state, 
        player: { 
          ...state.player, 
          hunger: action.payload 
        } 
      };
    
    case 'BEFRIEND_ENEMY':
      return { 
        ...state, 
        befriendedEnemy: action.payload.enemy,
        befriendedEnemyTimer: action.payload.timer,
        weaponStatus: action.payload.enemy?.weaponEnhancement || 'normal',
        player: {
          ...state.player,
          food: state.player.food - 1, // Use food to befriend
        }
      };
    
    case 'CLEAR_BEFRIENDED_ENEMY':
      return { 
        ...state, 
        befriendedEnemy: null,
        befriendedEnemyTimer: null,
        weaponStatus: 'normal',
      };
    
    case 'UPDATE_ENEMIES':
      return { 
        ...state, 
        enemies: action.payload
      };
    
    case 'UPDATE_KEY_BINDINGS':
      return { 
        ...state, 
        keyBindings: {
          ...state.keyBindings,
          ...action.payload
        } 
      };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: {
          ...state.settings,
          ...action.payload
        } 
      };
    
    case 'NEXT_LEVEL':
      return { 
        ...state, 
        currentLevel: state.currentLevel + 1,
        player: {
          ...state.player,
          position: { x: 400, y: 300 },
        }
      };        case 'SLEEP':
      // 20% chance of having a nightmare and losing a heart
      const hadNightmare = Math.random() < 0.2;
      
      return { 
        ...state, 
        player: { 
          ...state.player, 
          // If had nightmare, lose 1 heart, otherwise gain 2 hearts (up to max)
          health: hadNightmare 
            ? Math.max(0, state.player.health - 1) 
            : Math.min(state.player.maxHealth, state.player.health + 2),
        } 
      };
        case 'CHANGE_SCREEN':
      // Move to a different screen in the world
      const screenKey = `${action.payload.x},${action.payload.y}`;
      
      // Check if we already have this screen generated
      const existingScreen = state.screens[screenKey];
      let enemies = [];
      
      if (existingScreen) {
        // Use existing screen data
        enemies = existingScreen.enemies;
      } else {
        // First screen (0,0) should have no enemies
        if (action.payload.x === 0 && action.payload.y === 0) {
          enemies = []; // Empty array for the starting screen
        } else {
          // Generate new enemies for other screens
          enemies = generateEnemies(state.currentLevel + Math.abs(action.payload.x) + Math.abs(action.payload.y));
        }
      }
      
      // Update screens object with this screen's data
      const updatedScreens = {
        ...state.screens,
        [screenKey]: {
          enemies,
          visited: true,
        }
      };
      
      return {
        ...state,
        currentScreen: { ...action.payload },
        screens: updatedScreens,
        enemies,
      };
      case 'ADD_PROJECTILE':
      return {
        ...state,
        projectiles: [...(state.projectiles || []), action.payload]
      };
        case 'UPDATE_PROJECTILES':
      return {
        ...state,
        projectiles: action.payload
      };    case 'ADD_POINTS':
      return {
        ...state,
        score: Number(state.score || 0) + Number(action.payload || 0)
      };
      
    case 'SET_MAGIC':
      // If it's love magic and already used, don't set it
      if (action.payload === 'love' && state.usedLoveMagic) {
        return state;
      }
      
      return {
        ...state,
        magic: action.payload,
        // If it's a new magic type, it replaces the previous one
      };
    
    case 'USE_LOVE_MAGIC':
      // Mark love magic as used
      if (state.magic === 'love') {
        return {
          ...state,
          usedLoveMagic: true,
          magic: null, // Remove after use
          player: {
            ...state.player,
            health: state.player.maxHealth // Heal to full hearts
          }
        };
      }
      return state;
      
    case 'RESET_GAME':
      // Start a brand new game with randomized controls if newGame is true, otherwise just reset the game state
      return {
        ...initialState,
        screens: {}, // Clear all previously visited screens
        enemies: [], // Ensure empty enemies array
        keyBindings: action.payload?.keepControls ? state.keyBindings : generateRandomKeyBindings(), // Randomize only for new games
      };
      
    default:
      return state;
  }
};

// Generate random enemies for a level
const generateEnemies = (level) => {
  // Select 4 to 8 random enemy types for this level
  const numEnemiesTypes = Math.min(Math.floor(Math.random() * 4) + 4, 9);
  const shuffledEnemyTypes = [...enemyTypes].sort(() => 0.5 - Math.random());
  
  const selectedEnemyTypes = shuffledEnemyTypes.slice(0, numEnemiesTypes);
  
  // Create 5 to 10 enemies with random positions (increased from 3-6)
  const numEnemies = Math.floor(Math.random() * 6) + 5;
  const enemies = [];
  
  for (let i = 0; i < numEnemies; i++) {
    const enemyType = selectedEnemyTypes[Math.floor(Math.random() * selectedEnemyTypes.length)];
    const enemy = {
      id: uuidv4(),
      type: enemyType.id,
      name: enemyType.name,
      position: {
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50
      },      direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)],
      health: level * 2, // Enemies get stronger with each level
      damage: enemyType.damage,
      speed: enemyType.speed * 2.0, // Increased enemy speed by 100% (was 1.5)
      weaponEnhancement: enemyType.weaponEnhancement,
      foodDrop: enemyType.foodDrop,
      isBefriended: false,
      lastMoved: Date.now(),
    };
    enemies.push(enemy);
  }
  
  return enemies;
};

const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
    // Generate enemies only when level changes or when going from start to game for the first time
  useEffect(() => {
    // Only generate enemies when the screen changes to 'game' from something other than 'pause' or 'inventory'
    // This prevents regenerating enemies when returning from inventory or pause screens
    if (state.screen === 'game' && !state.screens[`${state.currentScreen.x},${state.currentScreen.y}`]) {
      // For the starting screen (0,0), we don't want to generate enemies
      if (state.currentScreen.x === 0 && state.currentScreen.y === 0) {
        dispatch({ type: 'UPDATE_ENEMIES', payload: [] });
      } else {
        const enemies = generateEnemies(state.currentLevel);
        dispatch({ type: 'UPDATE_ENEMIES', payload: enemies });
      }
    }
  }, [state.currentLevel, state.screen, state.currentScreen.x, state.currentScreen.y]);
  
  // Handle hunger mechanics
  useEffect(() => {
    if (state.screen !== 'game') return;
    
    const hungerTimer = setInterval(() => {
      // Decrease hunger over time
      const newHunger = Math.max(0, state.player.hunger - 0.1);
      dispatch({ type: 'UPDATE_HUNGER', payload: newHunger });
      
      // If player is very hungry, start taking damage
      if (newHunger === 0) {
        // Take damage every 10 seconds when hunger is at 0
        const timeWithoutFood = Date.now() - state.player.lastEaten;
        if (timeWithoutFood > 10000) {
          dispatch({ type: 'TAKE_DAMAGE', payload: 0.25 });
        }
      }
    }, 1000);
    
    return () => clearInterval(hungerTimer);
  }, [state.screen, state.player.hunger, state.player.lastEaten]);
  
  // Clear befriended enemy after timer expires
  useEffect(() => {
    if (!state.befriendedEnemyTimer) return;
    
    const timeLeft = state.befriendedEnemyTimer - Date.now();
    
    if (timeLeft <= 0) {
      dispatch({ type: 'CLEAR_BEFRIENDED_ENEMY' });
      return;
    }
    
    const timerId = setTimeout(() => {
      dispatch({ type: 'CLEAR_BEFRIENDED_ENEMY' });
    }, timeLeft);
    
    return () => clearTimeout(timerId);
  }, [state.befriendedEnemyTimer]);

  return (
    <GameContext.Provider value={{ state, dispatch, enemyTypes }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the game context
const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { GameProvider, useGame, GameContext };
