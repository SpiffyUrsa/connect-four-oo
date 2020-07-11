/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
// Creates the Game class which sets up the board, handles the progress of the game.
class Game {
  constructor(player1, player2, width = 7, height = 6) {
    this.width = width;
    this.height = height;
    this.board = [];
    this.players = [player1, player2];
    this.currPlayer = player1;
    this.makeBoard();
    this.makeHtmlBoard();
  }
  // method that makes the board inside of the instance of Game. 
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  // method that makes the HTML board.
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top);
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }
  // Finds the spot that the piece should drop down to.
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  // Places the piece in the table.
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = `${this.currPlayer.color}`;
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  // announce the end of the game  
  endGame(msg) {
    setTimeout(function() { alert(msg) }, 1000);
  }
  // handles a click to drop a piece down.
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color.toUpperCase()} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] 
        ? this.players[1] 
        : this.players[0];
  }
// checks to see if there is a winner.
  checkForWin() {
    
    let win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
          return true;
        }
      }
    }
  }
}

// Creates the player class with a color value.
class Player {
  constructor(color) {
    this.color = color;
  }
}

// Assigns players their color and starts a new game.
function startGame(event){
  event.preventDefault();
  let player1 = new Player();
  let player2 = new Player();
  player1.color = document.getElementById("player1Color").value;
  player2.color = document.getElementById("player2Color").value;
  new Game(player1, player2);
}

document.getElementById("playForm").addEventListener("submit", startGame);