const gameboard = (function () {
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
})();

function Cell() {
  let value = 0;

  const getValue = () => value;
  const setValue = (playerToken) => {
    value = playerToken;
  }

  return { getValue, setValue };
}

const gameManagerCreator = function (playerOneName = 'player1', playerTwoName = 'player2'){

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
    gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn!`);
  }

  const playRound =  (column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );
    gameboard.dropToken(getActivePlayer().token, column);

    switchPlayer();
    printNewRound();
  }  

  printNewRound();

  return { playRound };
};

const gameManager = gameManagerCreator();

gameManager.playRound(0);
gameManager.playRound(0);
gameManager.playRound(0);
gameManager.playRound(0);

gameManager.playRound(0);
gameManager.playRound(0);
gameManager.playRound(0);

