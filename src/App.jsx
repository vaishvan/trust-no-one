import React, { useEffect } from 'react'
import { useGame } from './context/GameContext'
import StartScreen from './components/screens/StartScreen'
import GameScreen from './components/screens/GameScreen'
import './App.css'

// Load custom font
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

function App() {
  const { state } = useGame()
  
  // Set up global styles
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflow = 'hidden'
    document.body.style.fontFamily = '"Press Start 2P", cursive, sans-serif'
    
    // Prevent arrow key scrolling
    const preventArrowScroll = (e) => {
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
    }
    
    window.addEventListener('keydown', preventArrowScroll)
    
    return () => {
      window.removeEventListener('keydown', preventArrowScroll)
    }
  }, [])
  
  // Render the current screen based on state
  const renderScreen = () => {
    switch(state.screen) {
      case 'start':
        return <StartScreen />
      case 'game':
      case 'pause':
      case 'inventory':
        return <GameScreen />
      default:
        return <StartScreen />
    }
  }

  return (
    <div className="game-container">
      {renderScreen()}
    </div>
  )
}

export default App
