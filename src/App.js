import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import "./app.css";
import characters from "./characters.json";
import Row from "./components/row/Row";
import BottomNav from "./components/BottomBar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: characters,
      score: 0,
      topScore: 0,
      clicked: Array(12).fill(false)
    };
  }

  // Fisher-Yates shuffle on cards, update state
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
    return this.state.clicked.find(elem => {
      return elem === id && true;
    });
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
      clicked: Array(12).fill(false)
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
      alert("You lose");
      // Reset the counters...
      this.emptyClicked();
      this.resetScoreZero();
      // reshuffle
      this.shuffle();
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
      // Check for win
      if (this.returnFirstNull() === 11) {
        // You win! Reset stuff
        alert("You win!");
        this.emptyClicked();
        this.resetScoreZero();
      }
    }
  }

  render() {

    return (
      <>
        <AppBar position="fixed" color="secondary">
          <nav className="navbar navbar-default myNavColor">
            <div className="container-fluid">
              <div className="navbar-header">
                {/* <Typography variant="h4"  className="navbar-brand whiteText impactFont">
                  Spider-Click
                </Typography> */}
                <h2 className="whiteText impactFont">Toy Story Click</h2>
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
          <div className="row">
            {
              this.state.cards.map((card, i) => (
                i < 4 && <Row {...card} handleClick={this.handleClick} key={i} />
              ))
            }
          </div>
          <div className="row">
            {
              this.state.cards.map((card, i) => (
                i > 3 && i < 8 && <Row {...card} handleClick={this.handleClick} key={i} />
              ))
            }
          </div>
          <div className="row">
            {
              this.state.cards.map((card, i) => (
                i > 7 && <Row {...card} handleClick={this.handleClick} key={i} />
              ))
            }
          </div>
        </div>
        <BottomNav style={{ background: "#FFFFFF", marginTop: "17.5px", paddingTop: "15px", borderTop: "2.5px solid slategray" }}>
          
        </BottomNav>

      </>
    );
  }

}
export default App;