'use client';
import React, { useState, useEffect } from 'react';

const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const generateCards = () => {
  const cardNumbers = Array.from({ length: 12 }, (_, index) => index + 1);
  const initialCards = cardNumbers.concat(cardNumbers);
  return shuffleArray(initialCards);
};

const Home = ({ serializedCards }) => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (serializedCards) {
      setCards(JSON.parse(serializedCards));
    } else {
      setCards(generateCards());
    }
  }, [serializedCards]);

  useEffect(() => {
    if (timerRunning && matchedPairs.length < cards.length / 2) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newSeconds = prevTimer.seconds + 1;
          if (newSeconds === 60) {
            return { minutes: prevTimer.minutes + 1, seconds: 0 };
          }
          return { ...prevTimer, seconds: newSeconds };
        });
      }, 1000);
  
      return () => clearInterval(interval);
    } else if (matchedPairs.length === cards.length / 2) {
      setTimerRunning(false); // Ferma il timer quando tutte le coppie sono state trovate
    }
  }, [timerRunning, timer, matchedPairs, cards]);
  

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedPairs((prev) => [...prev, cards[firstIndex]]);
      }
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  }, [flippedIndices, cards]);

  const handleCardClick = (index) => {
    if (
      flippedIndices.length < 2 &&
      !flippedIndices.includes(index) &&
      !matchedPairs.includes(cards[index])
    ) {
      setFlippedIndices((prev) => [...prev, index]);

      if (!timerRunning) {
        setTimerRunning(true);
      }
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMatchedPairs([]);
    setTimer({ minutes: 0, seconds: 0 });
    setTimerRunning(false);
  };

  return (
    <div className="memory-game-container">
      <div className="game-title">Memory Game</div>
      <div id="game-container">
        {cards.map((cardNumber, index) => (
          <div
            key={index}
            className={`card ${flippedIndices.includes(index) || matchedPairs.includes(cardNumber) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className={`card-front ${flippedIndices.includes(index) || matchedPairs.includes(cardNumber) ? 'hidden' : ''}`}>
                <img src="/images/carte/card_back.png" alt="Card Back" />
              </div>
              <div className={`card-back ${flippedIndices.includes(index) || matchedPairs.includes(cardNumber) ? 'visible' : ''}`}>
                <img src={`/images/carte/skull_card_${String(cardNumber).padStart(2, '0')}.png`} alt={`Card ${cardNumber}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button id="reset-button" onClick={resetGame}>Reset Game</button>
      <div className="timer">
        Timer: {`${String(timer.minutes).padStart(2, '0')}:${timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}`}
      </div>
      <div className="completato">
        Coppie trovate: {matchedPairs.length}/{cards.length / 2}
      </div>
      {matchedPairs.length === cards.length / 2 && (
      <div className="completato">
        Complimenti! Hai trovato tutte le coppie! 
      </div>
)}
    </div>
  );
};

export default Home;
