const gameboard = function () {
  const columns = 7;
  const rows = 6;
  const board = [];

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  resetBoard(); // initial board creation

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

  // methods to prepare different board states to test for win condition checker
  const upsideDownBoard = () => [...board].reverse();

  // flip board in order to verify vertical win condition  
  const flipBoard = function () {
    const flippedBoard = [];
    for (let i = 0; i < columns; i++) {
      flippedBoard[i] = [];
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        flippedBoard[j].push(board[i][j]);
      }
    }
    return flippedBoard;
  }

  // reverse the array (in order to verify from the top right corner
  const mirrorBoard = function (board) {
    return board.map(row => {
      return [...row].reverse(); 
    });
  }

  // create arrays from diagonals starting from top left corner and ending at the last row. 4 array needs to be created in order to cover the entire board
  const getDiagonals = function (board) {
    let diagonalsArray = [];
    let counter = 0;
    
    for (i = 0; i < rows; i++) {
      counter++;
      let reverseCounter = counter;
      diagonalsArray[i] = [];
      for (j = 0; j < counter; j++) {
        if (j < columns) {
          reverseCounter--;
          diagonalsArray[i].push(board[reverseCounter][j]);
        }
      }
    }
    return diagonalsArray;
  }

  return { printBoard, getBoard, dropToken, flipBoard, mirrorBoard, upsideDownBoard, getDiagonals}
};

function Cell() {
  let value = 0;
  let winnerCell = 0;

  const setWinnerCell = () => winnerCell = 1;
  const getWinnerCell = () => winnerCell;

  const getValue = () => value;
  const setValue = (playerToken) => {
    value = playerToken;
  }

  return { getValue, setValue, getWinnerCell, setWinnerCell };
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

  let winner = 0;
  const getWinner = () => winner;

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

  const playRound = (column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );
    board.dropToken(getActivePlayer().token, column);


    console.log(checkForWinner());

    if(checkForWinner()) {
      const winnerObj = checkForWinner();
      console.log("Player " + winnerObj.winner + ' wins!');
      winner = winnerObj.winner;

      winnerObj.winnerCellCombi.forEach(cell => {
        cell.setWinnerCell();
      });
    }

    switchPlayer();
    printNewRound();
  }  

  const checkForWinner = () => {
    const mirroredBoard = board.mirrorBoard(board.getBoard());
    const upsideDownMirrored = board.mirrorBoard(board.upsideDownBoard());

    if (runWinCondition(board.getBoard()).winner) {
      return runWinCondition(board.getBoard());
    } 
    else if (runWinCondition(board.flipBoard()).winner) {
      return runWinCondition(board.flipBoard());
    } else if (runWinCondition(board.getDiagonals(board.getBoard())).winner) {
      return runWinCondition(board.getDiagonals(board.getBoard()));
    } else if (runWinCondition(board.getDiagonals(mirroredBoard)).winner) {
      return runWinCondition(board.getDiagonals(mirroredBoard));
    } else if (runWinCondition(board.getDiagonals(board.upsideDownBoard())).winner) {
      return runWinCondition(board.getDiagonals(board.upsideDownBoard()));
    } else if (runWinCondition(board.getDiagonals(upsideDownMirrored)).winner) {
      return runWinCondition(board.getDiagonals(upsideDownMirrored));
    } else {
      return false;
    }
    
    // console.log(runWinCondition(board.getBoard()));
    // console.log(runWinCondition(board.flipBoard()));
    // console.log(runWinCondition(board.getDiagonals(board.getBoard())));
    // console.log(runWinCondition(board.getDiagonals(mirroredBoard)));
    // console.log(runWinCondition(board.getDiagonals(board.upsideDownBoard())));
    // console.log(runWinCondition(board.getDiagonals(upsideDownMirrored)));
  }

  const runWinCondition = function (passedBoard) {
    let winner = 0;
    let winnerCellCombi = [];
    passedBoard.forEach((row) => {
      let streak = 1;

      for (let i = 0; i < row.length; i++) {
        if (winner) break;
        let temp;
        if (row[i - 1]) {
          temp = row[i - 1];
          // temp = Cell(); // second variant
          // temp.setValue(row[i - 1].getValue());
        }
        if (row[i].getValue() && temp && temp.getValue() === row[i].getValue()) {
          streak++;
          
          if (streak === 4) {
            winner = row[i].getValue();
            winnerCellCombi.push(row[i]);
            winnerCellCombi.push(row[i - 1]);
            winnerCellCombi.push(row[i - 2]);
            winnerCellCombi.push(row[i - 3]);

          }
        } else {
          streak = 1;
        }
      }
    });
    //  const getWinner = () => winner;
    //  const getWinnerCellCombi = () => winnerCellCombi; // no need as these values are not modified post function call
     return { winner, winnerCellCombi };
  };

  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
};

// console version
// const game = new gameController();
// game.playRound(5);
// game.playRound(2);
// game.playRound(5);
// game.playRound(2);
// game.playRound(5);
// game.playRound(2);
// game.playRound(5);



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
            if (cell.getWinnerCell()) cellButton.classList.add('winner-cell');
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




let board = [
  [2, 2, 2, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];


// flip board in order to verify vertical win condition  
function flipBoard(board) {
  const flippedBoard = [];
  let rows = 6;
  let columns = 7;
  for (let i = 0; i < columns; i++) {
    flippedBoard[i] = [];
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      flippedBoard[j].push(board[i][j]);
    }
  }
  return flippedBoard;
}



// diagonal win condition

// reverse the array (in order to verify from the top right corner) before passing to create arrays from diagonals
function mirrorBoard(board) {
  return board.map(row => {
    return [...row].reverse(); // spread operator to create shallow copies of the array for each rows
  });
}

const flippedBoard = flipBoard(board);

const upsideDownBoard = [...board].reverse();
const boardMirror = mirrorBoard(board);
const upsideDownMirror = mirrorBoard(upsideDownBoard);


// create arrays from diagonals starting from top left corner as default in order to pass to win condition verifier 
function createDiagonalsArr(board) {
  let rows = 6;
  let columns = 7;
  let counter = 0;
  let diagonalsArray = [];
  for (i = 0; i < rows; i++) {
    counter++;
    let reverseCounter = counter;
    diagonalsArray[i] = [];

    for (j = 0; j < counter; j++) {
      if (j < columns) {
        reverseCounter--;
        // console.log({i}, {j}, {counter}, {reverseCounter}, board[reverseCounter][j]);
        diagonalsArray[i].push(board[reverseCounter][j]);
      }
    }
  }
  return diagonalsArray;
}

// const topLeftDiags = createDiagonalsArr(board);
// const topRightDiags = createDiagonalsArr(boardMirror);
// const bottomLeftDiags = createDiagonalsArr(upsideDownBoard);
// const bottomRightDiags = createDiagonalsArr(upsideDownMirror);

// console.log({ board });
// console.log({flippedBoard});
// console.log({topLeftDiags});
// console.log({topRightDiags});
// console.log({bottomLeftDiags});
// console.log({bottomRightDiags});


// row win condition
const arr = [0, 1, 1, 1, 2];
// const res = arr.reduce((acc, currValue) => {
//     if (acc && acc === currValue) {
//       // increase counter on consecutive repeating tokens
//       counter++;
//     } else {
//       // reset counter if consecutive streak is broken
//       counter = 1;
//     }
//     return acc = currValue;
// });

function runWinCondition(board) {
  let winner = 0;
  board.forEach((row) => {
    let streak = 1;
    for (let i = 0; i < row.length; i++) {
      if (winner) break;
      let temp;
      if (row[i-1]) temp = row[i - 1];
      if (row[i] && temp && temp === row[i]) {
        streak++;
        if (streak === 4) {
          winner = row[i];
        }
      } else {
        streak = 1;
      }
    }
  });
  return winner;
}
function checkForWinner(){
  // console.log(runWinCondition(board));

  // flippedBoard.forEach(row => {
  //   runWinCondition(row);
  // });
  // topLeftDiags.forEach(row => {
  //   runWinCondition(row);
  // });
  // topRightDiags.forEach(row => {
  //   runWinCondition(row);
  // });
  // bottomLeftDiags.forEach(row => {
  //   runWinCondition(row);
  // });
  // bottomRightDiags.forEach(row => {
  //   runWinCondition(row);
  // });
}

checkForWinner();



// [0][0] 
// [1][0] + [0][1] /
// [2][0] + [1][1] + [0][2] 
// [3][0] + [2][1] + [1][2] + [0][3] 
// [4][0] + [3][1] + [2][2] + [1][3] + [0][4] 
// [5][0] + [4][1] + [3][2] + [2][3] + [1][4] + [0][5]

