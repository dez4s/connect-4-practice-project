const gameboard = function () {
  const columns = 7;
  const rows = 6;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (playerToken, column) => {
    const availableCells = board.filter(row => row[column].getValue() === 0).map(row => row[column]);

    if (availableCells.length < 1) {
      console.log('Cannot place token there! Column is full');
      return;
    }
    
    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].setValue(playerToken);
  }

  const printBoard = () => {
    console.log(board.map(row => row.map(cell => cell.getValue())));
  }

  return { printBoard, getBoard, dropToken }
};

function Cell() {
  let value = 0;

  const getValue = () => value;
  const setValue = (playerToken) => {
    value = playerToken;
  }

  return { getValue, setValue };
}

const gameController = function (playerOneName = 'player1', playerTwoName = 'player2'){
 
  const board = gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    }
  ]

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayer = () => 
    activePlayer === players[0] ?
    activePlayer = players[1] :
    activePlayer = players[0];

  const printNewRound = function () {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn!`);
  }

  const playRound =  (column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );
    board.dropToken(getActivePlayer().token, column);

    switchPlayer();
    printNewRound();
  }  

  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
};

// console version
// const game = new gameController();
// console.log(game.playRound(5));


// UI VERSION
const screenController = (function () { 
    const game = new gameController();
    const playerTurnTextElem = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');



    const updateScreen = () => {
        boardDiv.replaceChildren();
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnTextElem.textContent = `It's ${activePlayer.name}'s turn!`;

        board.forEach((row) => row.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.textContent = cell.getValue();
            cellButton.dataset.column = index;
            cellButton.classList.add('cell');
            boardDiv.appendChild(cellButton);
          })
        );
    };

    function clickHandlerBoard(e) {
      const clickedColumn = e.target.dataset.column;
      if (!clickedColumn) return;

      game.playRound(clickedColumn);
    }

    boardDiv.addEventListener('click', (e) => {
      clickHandlerBoard(e);
      updateScreen();
    })

    updateScreen();
})();





