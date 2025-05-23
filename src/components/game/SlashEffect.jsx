import React, { Component } from 'react';
import styled from 'styled-components';

// Import slash effect images
import slash1 from '../../assets/images/fx/slash/slash1.png';
import slash2 from '../../assets/images/fx/slash/slash2.png';
import slash3 from '../../assets/images/fx/slash/slash3.png';
import slash4 from '../../assets/images/fx/slash/slash4.png';

const SlashContainer = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  transform: translate(-50%, -50%);
  z-index: 999; // Very high to ensure it's on top of everything
  pointer-events: none; // Don't capture mouse events
`;

const SlashImage = styled.img`
  width: 100%;
  height: 100%;
`;

// Using class component for more reliable animation
class SlashEffect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlash: 0
    };
    this.timeouts = [];
    this.slashImages = [slash1, slash2, slash3, slash4];
  }
  
  componentDidMount() {
    this.startAnimation();
  }
  
  componentDidUpdate(prevProps) {
    // If position changed, restart animation
    if (prevProps.position.x !== this.props.position.x || 
        prevProps.position.y !== this.props.position.y) {
      this.clearTimeouts();
      this.setState({ currentSlash: 0 }, this.startAnimation);
    }
  }
  
  componentWillUnmount() {
    this.clearTimeouts();
  }
  
  clearTimeouts() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
  }
  
  startAnimation() {
    // Show first frame immediately
    this.setState({ currentSlash: 0 });
    
    // Schedule each subsequent frame
    const timeout1 = setTimeout(() => {
      this.setState({ currentSlash: 1 });
    }, 150);
    
    const timeout2 = setTimeout(() => {
      this.setState({ currentSlash: 2 });
    }, 300);
    
    const timeout3 = setTimeout(() => {
      this.setState({ currentSlash: 3 });
    }, 450);
    
    // End the animation
    const timeout4 = setTimeout(() => {
      if (this.props.onAnimationComplete) {
        this.props.onAnimationComplete();
      }
    }, 600);
    
    this.timeouts.push(timeout1, timeout2, timeout3, timeout4);
  }
  
  render() {
    const { position } = this.props;
    const { currentSlash } = this.state;
    
    console.log("Rendering slash frame:", currentSlash + 1); // Debug log
    
    return (
      <SlashContainer style={{ left: position.x, top: position.y }}>
        <SlashImage 
          src={this.slashImages[currentSlash]} 
          alt={`Slash effect ${currentSlash + 1}`} 
        />
      </SlashContainer>
    );
  }
}

export default SlashEffect;
