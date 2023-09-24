import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import "./App.css";
import characters from "./Characters.json";
import Row from "./Components/row/Row.js";
import BottomNav from "./Components/BottomBar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: this.shuffleArray(characters).slice(0, 16),
      score: 0,
      topScore: 0,
      clicked: Array(16).fill(false)
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
  // Main game logic here
  handleClick = event => {
    const id = event.target.id;
    if (this.findId(id) !== undefined) {
      // It has already been clicked!
      alert("Sorry, You lost.");
      // Reset the counters...
      this.emptyClicked();
      this.resetScoreZero();
      // reshuffle
      this.setState({
        cards: this.shuffleArray(characters).slice(0, 16),
        clicked: Array(16).fill(false)  // Reinitialize the clicked array
      });
    }
    else {
      // Not already clicked...
      // Put the id in the clicked array
      this.insertId(id, this.returnFirstNull());
      // Is the top score bigger than the score?
      if (this.state.topScore > this.state.score) {
        // Update only the score
        this.incrementScore();
      }
      else {
        // Update both because they're the same
        this.incrementBothScores();
      }
      // Shuffle the array
      this.shuffle();
      // Check for success
      if (this.returnFirstNull() === 16) {
        // Reset board and continue
        this.setState({
          cards: this.shuffleArray(characters).slice(0, 16),
          // Reinitialize the clicked array
          clicked: Array(16).fill(false)  
        });        
      }
    }
  }

  render() {
    const totalCards = this.state.cards.length;
  
    // Ensure it doesn't exceed 4
    const cardsPerRow = Math.min(4, Math.ceil(Math.sqrt(totalCards))); 

    // Set the CSS variable
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