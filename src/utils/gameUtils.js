// Utility function to handle level transitions
export const generateLevel = (levelNumber) => {
  // Basic level structure
  const level = {
    id: levelNumber,
    width: 800,
    height: 600,
    obstacles: [],
    exits: []
  };
  
  // Add obstacles based on level number
  switch (levelNumber % 5) {
    case 0: // Boss level
      // Fewer obstacles, more open space for boss fight
      level.obstacles = [
        { x: 200, y: 100, width: 100, height: 20 },
        { x: 500, y: 100, width: 100, height: 20 },
        { x: 200, y: 400, width: 100, height: 20 },
        { x: 500, y: 400, width: 100, height: 20 },
      ];
      break;
    case 1: // Forest level
      level.obstacles = [
        { x: 100, y: 100, width: 50, height: 50 }, // Tree
        { x: 300, y: 150, width: 50, height: 50 }, // Tree
        { x: 500, y: 100, width: 50, height: 50 }, // Tree
        { x: 200, y: 300, width: 50, height: 50 }, // Tree
        { x: 400, y: 350, width: 50, height: 50 }, // Tree
        { x: 600, y: 300, width: 50, height: 50 }, // Tree
        { x: 150, y: 450, width: 50, height: 50 }, // Tree
        { x: 350, y: 500, width: 50, height: 50 }, // Tree
        { x: 550, y: 450, width: 50, height: 50 }, // Tree
      ];
      break;
    case 2: // Cave level
      level.obstacles = [
        { x: 100, y: 100, width: 600, height: 20 }, // Top wall
        { x: 100, y: 100, width: 20, height: 400 }, // Left wall
        { x: 680, y: 100, width: 20, height: 400 }, // Right wall
        { x: 100, y: 500, width: 600, height: 20 }, // Bottom wall
        { x: 300, y: 250, width: 200, height: 100 }, // Center obstacle
      ];
      break;
    case 3: // Desert level
      level.obstacles = [
        { x: 150, y: 150, width: 100, height: 100 }, // Sand dune
        { x: 550, y: 150, width: 100, height: 100 }, // Sand dune
        { x: 150, y: 350, width: 100, height: 100 }, // Sand dune
        { x: 550, y: 350, width: 100, height: 100 }, // Sand dune
        { x: 350, y: 250, width: 100, height: 100 }, // Sand dune
      ];
      break;
    case 4: // Dungeon level
      level.obstacles = [
        { x: 100, y: 100, width: 50, height: 250 }, // Left wall
        { x: 100, y: 100, width: 600, height: 50 }, // Top wall
        { x: 650, y: 100, width: 50, height: 250 }, // Right wall 1
        { x: 100, y: 350, width: 50, height: 150 }, // Left wall 2
        { x: 650, y: 350, width: 50, height: 150 }, // Right wall 2
        { x: 100, y: 500, width: 600, height: 50 }, // Bottom wall
        { x: 200, y: 200, width: 50, height: 200 }, // Inner wall 1
        { x: 350, y: 100, width: 50, height: 200 }, // Inner wall 2
        { x: 500, y: 300, width: 50, height: 200 }, // Inner wall 3
      ];
      break;
  }
  
  // Add exits to adjacent levels
  level.exits = [
    { x: 400, y: 50, width: 100, height: 10, targetLevel: levelNumber + 1, spawnPosition: { x: 400, y: 500 } }, // North exit
    { x: 400, y: 550, width: 100, height: 10, targetLevel: Math.max(1, levelNumber - 1), spawnPosition: { x: 400, y: 100 } }, // South exit
    { x: 50, y: 300, width: 10, height: 100, targetLevel: levelNumber + 2, spawnPosition: { x: 700, y: 300 } }, // West exit
    { x: 750, y: 300, width: 10, height: 100, targetLevel: Math.max(1, levelNumber - 2), spawnPosition: { x: 100, y: 300 } }, // East exit
  ];
  
  return level;
};

// Function to check if two objects are colliding
export const checkCollision = (object1, object2) => {
  return (
    object1.x < object2.x + object2.width &&
    object1.x + object1.width > object2.x &&
    object1.y < object2.y + object2.height &&
    object1.y + object1.height > object2.y
  );
};

// Function to check if point is in rectangle
export const pointInRect = (point, rect) => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

// Random utility functions
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Calculate distance between two points
export const distance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};

// Function to get direction from angle
export const getDirectionFromAngle = (angle) => {
  const directions = ['right', 'down', 'left', 'up'];
  const normalized = (angle + (Math.PI / 4)) % (Math.PI * 2);
  const index = Math.floor(normalized / (Math.PI / 2));
  return directions[index];
};

// Function to get angle from direction
export const getAngleFromDirection = (direction) => {
  switch(direction) {
    case 'right': return 0;
    case 'down': return Math.PI / 2;
    case 'left': return Math.PI;
    case 'up': return Math.PI * 1.5;
    default: return 0;
  }
};
