// Magic types and their properties
const magicTypes = {
  fire: {
    damage: 1.5,
    projectileSpeed: 7,
    projectileRange: 280,
    color: '#f63',
    frames: 4, // Number of frames in the animation
  },
  ice: {
    damage: 1.0,
    projectileSpeed: 6,
    projectileRange: 250,
    color: '#3cf',
    frames: 8, // Number of frames in the animation
  },
  blast: {
    damage: 2.0,
    projectileSpeed: 5,
    projectileRange: 200,
    color: '#f00',
    frames: 4, // Number of frames in the animation
  },
  grass: {
    damage: 0.8,
    projectileSpeed: 5,
    projectileRange: 230,
    color: '#4c4',
    frames: 4, // Number of frames in the animation
  },
  love: {
    // Love is special - it heals the player to full hearts
    damage: 0,
    isHealing: true,
    oneTimeUse: true,
    color: '#f6a',
    frames: 10, // Number of frames in the animation
  }
};

export default magicTypes;
