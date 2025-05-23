// Food items that can be collected from enemies
// Helper to get the correct path for food images in both dev and prod
const getFoodImagePath = (imageName) => {
  // Check if base URL is defined in vite config
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}food/${imageName}`;
};

const foodItems = [
  {
    id: 'beef',
    name: 'Beef',
    hunger: 35,
    health: 0.75,
    description: 'Tender beef. High in protein and very filling.',
    rarity: 'uncommon',
    img: getFoodImagePath('Beef.png')
  },  {
    id: 'calamari',
    name: 'Calamari',
    hunger: 25,
    health: 0.5,
    description: 'Fried squid rings. Delicious and nutritious seafood.',
    rarity: 'uncommon',
    img: getFoodImagePath('Calamari.png')
  },  {
    id: 'fish',
    name: 'Fish',
    hunger: 30,
    health: 0.5,
    description: 'Freshly caught and prepared fish. Rich in nutrients.',
    rarity: 'uncommon',
    img: getFoodImagePath('Fish.png')
  },  {
    id: 'fortuneCookie',
    name: 'Fortune Cookie',
    hunger: 10,
    health: 0.25,
    description: 'A crunchy cookie with a fortune inside. Light but satisfying.',
    rarity: 'common',
    img: getFoodImagePath('FortuneCookie.png')
  },  {
    id: 'honey',
    name: 'Honey',
    hunger: 15,
    health: 1.0,
    description: 'Sweet golden honey with healing properties. Energy boost!',
    rarity: 'rare',
    img: getFoodImagePath('Honey.png')
  },  {
    id: 'meat',
    name: 'Meat',
    hunger: 40,
    health: 0.75,
    description: 'A large chunk of cooked meat. Very filling and nutritious.',
    rarity: 'uncommon',
    img: getFoodImagePath('Meat.png')
  },  {
    id: 'noodle',
    name: 'Noodle',
    hunger: 20,
    health: 0.5,
    description: 'A bowl of tasty noodles. Satisfying and energizing.',
    rarity: 'common',
    img: getFoodImagePath('Noodle.png')
  },  {
    id: 'shrimp',
    name: 'Shrimp',
    hunger: 15,
    health: 0.25,
    description: 'Grilled shrimp. Light but tasty seafood.',
    rarity: 'common',
    img: getFoodImagePath('Shrimp.png')
  },  {
    id: 'sushi',
    name: 'Sushi',
    hunger: 25,
    health: 0.5,
    description: 'Fresh sushi rolls. Delicate balance of flavors.',
    rarity: 'uncommon',
    img: getFoodImagePath('Sushi.png')
  },  {
    id: 'yakitori',
    name: 'Yakitori',
    hunger: 20,
    health: 2.0,
    description: 'Grilled skewered chicken. Rare and exceptionally refreshing.',
    rarity: 'rare',
    img: getFoodImagePath('Yakitori.png')
  }
];

// Function to get random food drop based on enemy type
export const getRandomFoodDrop = (enemyType, dropChance = 0.7) => {
  // Determine if food drops
  if (Math.random() > dropChance) {
    return null;
  }

  // Determine rarity based on enemy type
  let rarityChance;
  
  // Stronger enemies have better drops
  switch (enemyType) {
    // Higher tier enemies have better drops
    case 'redSkull':
    case 'blueSkull':
      rarityChance = Math.random();
      if (rarityChance < 0.2) return getRandomFoodByRarity('rare');
      if (rarityChance < 0.6) return getRandomFoodByRarity('uncommon');
      return getRandomFoodByRarity('common');
      
    // Medium tier enemies have decent drops
    case 'iceSpirit':
    case 'fireSpirit':
    case 'blueOcto':
      rarityChance = Math.random();
      if (rarityChance < 0.1) return getRandomFoodByRarity('rare');
      if (rarityChance < 0.4) return getRandomFoodByRarity('uncommon');
      return getRandomFoodByRarity('common');
    
    // Default for other enemies
    default:
      rarityChance = Math.random();
      if (rarityChance < 0.05) return getRandomFoodByRarity('rare');
      if (rarityChance < 0.3) return getRandomFoodByRarity('uncommon');
      return getRandomFoodByRarity('common');
  }
};

// Helper function to get random food by rarity
const getRandomFoodByRarity = (rarity) => {
  const foodsOfRarity = foodItems.filter(item => item.rarity === rarity);
  return {...foodsOfRarity[Math.floor(Math.random() * foodsOfRarity.length)]};
};

export default foodItems;
