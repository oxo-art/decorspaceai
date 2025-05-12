
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingAnimation = () => {
  const [isHouse, setIsHouse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsHouse(prev => !prev);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <SVGContainer>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Base shapes that stay constant */}
          <rect x="30" y="60" width="60" height="30" stroke="black" strokeWidth="2" fill="none" />

          {/* Animated elements */}
          {isHouse ? (
            <>
              {/* House roof */}
              <polygon 
                points="30,60 60,30 90,60" 
                stroke="black" 
                strokeWidth="2" 
                fill="none"
              />
              {/* House door */}
              <rect x="50" y="70" width="20" height="20" stroke="black" strokeWidth="2" fill="none" />
            </>
          ) : (
            <>
              {/* Sofa back */}
              <rect x="30" y="50" width="60" height="10" stroke="black" strokeWidth="2" fill="none" />
              {/* Sofa armrests */}
              <rect x="25" y="60" width="5" height="20" stroke="black" strokeWidth="2" fill="none" />
              <rect x="90" y="60" width="5" height="20" stroke="black" strokeWidth="2" fill="none" />
              {/* Sofa cushions */}
              <line x1="45" y1="60" x2="45" y2="90" stroke="black" strokeWidth="2" />
              <line x1="75" y1="60" x2="75" y2="90" stroke="black" strokeWidth="2" />
            </>
          )}
        </svg>
      </SVGContainer>
      <LoadingText>Loading...</LoadingText>
    </Container>
  );
};

// Animations
const morph = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const fade = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const SVGContainer = styled.div`
  animation: ${morph} 1.5s ease-in-out infinite;
  
  svg {
    animation: ${fade} 1.5s ease-in-out infinite;
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  font-family: sans-serif;
  color: #333;
  animation: ${fade} 1.5s ease-in-out infinite;
`;

export default LoadingAnimation;
