import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import "./App.css";
import characters from "./Characters.json";
import Row from "./Components/row/Row.js";
import BottomNav from "./Components/BottomBar";

class App extends Component {
  // Define levels, card counts, and the score thresholds
  levels = [
    { cards: 4, threshold: 4 },
    { cards: 4, threshold: 8 },
    { cards: 9, threshold: 17 },
    { cards: 9, threshold: 26 },
    { cards: 9, threshold: 35 },
    { cards: 16, threshold: 51 },
    { cards: 16, threshold: 67 },
    { cards: 16, threshold: 83 },
    { cards: 16, threshold: 99 },
    { cards: 16, threshold: 115 }
];

  constructor(props) {
    super(props);
    this.state = {
      cards: this.shuffleArray(characters).slice(0, this.levels[0].cards),
      score: 0,
      topScore: 0,
      clicked: Array(this.levels[0].cards).fill(false),
      currentLevel: 0,
      usedCards: []
    };
  }

  //Fisher-Yates Shuffle on characters
  shuffleArray = (array) => {
    let shuffled = array.slice();  // make a copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  //Fisher-Yates Shuffle on cards, update state
  shuffle = () => {
    let c = this.state.cards;
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    this.setState({
      cards: [...c]
    })
  }
  // Check the clicked array for an id
  findId = id => {
    return this.state.clicked.includes(id);
  }
  // Return the index of where the first null(empty space in clicked array) is found
  returnFirstNull = () => {
    return this.state.clicked.indexOf(false);
  }
  // Insert id into clicked array
  insertId = (id, index) => {
    this.setState({
      clicked: this.state.clicked.map((elem, i) => {
      return i === index ? id : elem;
    })
    });
  }
  // Clear clicked array
  emptyClicked = () => {
    this.setState({
      clicked: Array(16).fill(false)
    });
  }
  // Reset the score
  resetScoreZero = () => {
    this.setState({
      score: 0
    });
  }
  // Increment both the scores (setState is async...)
  incrementBothScores = () => {
    this.setState({
      score: this.state.score + 1,
      topScore: this.state.topScore + 1
    });
  }
  // increment just the score
  incrementScore = () => {
    this.setState({
      score: this.state.score + 1
    });
  }

  // Get new cards each level
  getNewCards = (num) => {
    let newCards = [];
    // Fetch unique cards not used before in this game session
    while (newCards.length < num) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        if (!this.state.usedCards.includes(randomIndex) && !newCards.includes(characters[randomIndex])) {
            newCards.push(characters[randomIndex]);
            this.setState(prevState => ({
                usedCards: [...prevState.usedCards, randomIndex]
            }));
        }
    }
    return newCards;
  }


// Main game logic here
handleClick = event => {
  const id = event.target.id;

  if (this.findId(id)) {
      // It has already been clicked!
      alert('Sorry, You already clicked that one.');
      // Reset the counters...
      this.emptyClicked();
      this.resetScoreZero();
      // Reset the game to the start
      this.setState({
          cards: this.shuffleArray(characters).slice(0, this.levels[0].cards),
          clicked: Array(this.levels[0].cards).fill(false),
          currentLevel: 0,
          usedCards: []
      });
      // No need to shuffle here since we're using shuffleArray above
  } else {
      // Not already clicked...
      // Put the id in the clicked array
      this.insertId(id, this.returnFirstNull());
      
      let newScore = this.state.score + 1;
      let newTopScore = this.state.topScore;
      
      if (newScore > this.state.topScore) {
          newTopScore = newScore;
      }
      
      this.setState({
          score: newScore,
          topScore: newTopScore
      });
      
      this.shuffle();  // Shuffle the cards here after updating the score.
      
      // Check if all cards have been clicked for the current level
      if (newScore >= this.levels[this.state.currentLevel].threshold) {
        let newLevel = this.state.currentLevel + 1;

        // Logging the current state of the usedCards array
        console.log("Used Cards:", this.state.usedCards);
    
        // Logging the new level
        console.log("New Level:", newLevel);
    
        let fetchedNewCards = this.getNewCards(this.levels[newLevel].cards);
        console.log("New Cards:", fetchedNewCards);
        
        if (newLevel >= this.levels.length) {
            // If user completes the last level
            alert("Congratulations! You have beat the game.");
            this.setState({
                score: 0,
                currentLevel: 0,
                clicked: Array(this.levels[0].cards).fill(false),
                cards: this.shuffleArray(characters).slice(0, this.levels[0].cards),
                usedCards: []
            });
            return;
        }
      
        // If all cards have been clicked, proceed to the next level
        this.setState({
          cards: this.shuffleArray(fetchedNewCards).slice(0, this.levels[newLevel].cards),
          clicked: Array(this.levels[newLevel].cards).fill(false),
          currentLevel: newLevel
        });
      }
    }
  }

  render() {
    const totalCards = this.state.cards.length;
    const cardsPerRow = Math.min(4, Math.ceil(Math.sqrt(totalCards)));
    document.documentElement.style.setProperty('--cards-per-row', cardsPerRow);
    const numberOfRows = Math.ceil(totalCards / cardsPerRow);

    return (
      <>
        <AppBar position="fixed" color="secondary">
          <nav className="navbar navbar-default myNavColor">
            <div className="container-fluid">
              <div className="navbar-header">
                {/* <Typography variant="h4"  className="navbar-brand whiteText impactFont">
                  Spider-Click
                </Typography> */}
                <h2 className="whiteText impactFont">Memory Mix-Up</h2>
              </div>

              <ul className="nav navbar-nav whiteText">
                <li>
                  <h4>Current Score: {this.state.score} || High Score: {this.state.topScore}</h4>
                </li>
              </ul>
            </div>
          </nav>
        </AppBar>
        <div id="main-content" className="container">
        {Array.from({ length: numberOfRows }).map((_, rowIndex) => (
          <div className="row" key={rowIndex}>
            {this.state.cards
              .slice(rowIndex * cardsPerRow, (rowIndex + 1) * cardsPerRow)
              .map((card, index) => (
                <Row
                  {...card}
                  handleClick={this.handleClick}
                  key={index}
                />
              ))}
          </div>
        ))}
        </div>
        <BottomNav style={{ background: "#FFFFFF", marginTop: "17.5px", paddingTop: "15px", borderTop: "2.5px solid slategray" }}>
          
        </BottomNav>

      </>
    );
  }

}
export default App;