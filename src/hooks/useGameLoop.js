import { useState, useEffect, useRef } from 'react';

// Custom hook for animation frame timing
const useGameLoop = (callback, active = true) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  // The animation loop
  const animate = time => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    if (active) {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [active]);
};

// Custom hook for fixed interval game updates
const useGameTick = (callback, interval = 16, active = true) => {
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  
  useGameLoop((deltaTime) => {
    if (!active) return;
    
    const newAccumulatedTime = accumulatedTime + deltaTime;
    
    if (newAccumulatedTime >= interval) {
      const numUpdates = Math.floor(newAccumulatedTime / interval);
      
      // Perform updates
      for (let i = 0; i < numUpdates; i++) {
        callback(interval);
      }
      
      // Store remaining time
      setAccumulatedTime(newAccumulatedTime % interval);
      setLastUpdateTime(Date.now());
    } else {
      setAccumulatedTime(newAccumulatedTime);
    }
  }, active);
  
  return lastUpdateTime;
};

export { useGameLoop, useGameTick };
