import React from 'react';
import styled from 'styled-components';

const DialogBoxContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  border: 4px solid #964B00;
  width: 80%;
  max-width: 800px;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

const DialogContent = styled.div`
  display: flex;
  align-items: center;
`;

const CharacterImage = styled.div`
  width: 64px;
  height: 64px;
  background-color: #555;
  border-radius: 5px;
  margin-right: 15px;
  flex-shrink: 0;
`;

const DialogText = styled.div`
  color: white;
  font-family: 'Press Start 2P', cursive, sans-serif;
  font-size: 16px;
  line-height: 1.5;
`;

const CharacterName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #ff9;
`;

const DialogOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const DialogOption = styled.button`
  background-color: #964B00;
  border: 2px solid #c97840;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  font-family: 'Press Start 2P', cursive, sans-serif;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #c97840;
  }
`;

const DialogBox = ({ character, text, imageUrl, onClose, options = [] }) => {
  return (
    <DialogBoxContainer>
      <DialogContent>
        <CharacterImage style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}} />
        <DialogText>
          <CharacterName>{character}</CharacterName>
          {text}
        </DialogText>
      </DialogContent>
      
      <DialogOptions>
        {options.length > 0 ? (
          options.map((option, index) => (
            <DialogOption 
              key={index}
              onClick={() => {
                option.action();
                if (onClose) onClose();
              }}
            >
              {option.text}
            </DialogOption>
          ))
        ) : (
          <DialogOption onClick={onClose}>Continue</DialogOption>
        )}
      </DialogOptions>
    </DialogBoxContainer>
  );
};

export default DialogBox;
