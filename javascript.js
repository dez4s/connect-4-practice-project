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
      return 'full';
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

  return { printBoard, resetBoard, getBoard, dropToken, flipBoard, mirrorBoard, upsideDownBoard, getDiagonals}
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

const gameController = function (playerOneName = 'Red', playerTwoName = 'Yellow'){
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
  ];

  let winner = 0;
  let tie;

  const getWinner = () => winner;
  const checkTie = () => tie;


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

    if (board.dropToken(getActivePlayer().token, column) === 'full') return;


    checkForWinner();
    if (checkForTie()) {
      console.log('It\'s a tie!'); //for console version
    }

    if(checkForWinner()) {
      const winnerObj = checkForWinner();
      winner = winnerObj.winner;

      winnerObj.winnerCellCombi.forEach(cell => {
        cell.setWinnerCell();
      });
      return;
    }

    switchPlayer();
    printNewRound();
  }  

  const resetGame = () => {
    board.resetBoard();
    winner = 0;
    activePlayer = players[0];
  }

  const checkForTie = () => {
    const currentBoard = board.getBoard();
    const availableCellsBoard = currentBoard.map(row => {
      return row.filter(cell => !cell.getValue());
    });

    const availableRows = availableCellsBoard.filter(row => row.length > 0);

    if (availableRows.length === 0) tie = 1;
    return tie;
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
     return { winner, winnerCellCombi };
  };

  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard, getWinner, resetGame, checkTie };
};

// console version
// const game = new gameController();
// game.playRound(5);
// game.playRound(2);


// UI VERSION
const screenController = (function () {   
    let boardDiv;
    const game = new gameController();
    const container = document.querySelector('.container');
    const playerTurnText = container.querySelector('#turn');
    const playerTurnName = container.querySelector('#player-name');
    const modal = container.querySelector('#newgame-modal');
    const newGameBtn = container.querySelector('#newgame-btn');
    const startGameBtn = container.querySelector('#start-game');
    

    const updateScreen = () => {
        if (!boardDiv) return;

        boardDiv.replaceChildren();
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnName.textContent = `${activePlayer.name.toUpperCase()}`;
        playerTurnText.textContent = `'s turn!`; 

        if (game.getWinner()) playerTurnText.textContent = ` wins!`;
        if (game.checkTie()) {
          playerTurnName.textContent = '';
          playerTurnText.textContent = 'It\'s a tie!';
        }
   
        if (activePlayer.token === 1) {
          playerTurnName.classList.remove('turn-p2');
          playerTurnName.classList.add('turn-p1');
        } else if (activePlayer.token === 2) {
          playerTurnName.classList.remove('turn-p1');
          playerTurnName.classList.add('turn-p2');
        } 

        board.forEach((row) => row.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            // cellButton.textContent = cell.getValue();

            cellButton.classList.add('cell');
            if (cell.getValue() === 1) {
              cellButton.classList.add('cell-p1');
            } else if (cell.getValue() === 2) {

              cellButton.classList.add('cell-p2');
            }
            cellButton.dataset.column = index;

            if (cell.getWinnerCell()) cellButton.classList.add('winner-cell');
            boardDiv.appendChild(cellButton);
          })
        );
    };

    const addResetModalOpener = () => {
      const resetModalBtn = document.createElement('button');
      resetModalBtn.textContent = 'RESTART';
      resetModalBtn.classList.add('btn');
      resetModalBtn.id = 'open-reset-modal-btn'
      container.appendChild(resetModalBtn);
      resetModalBtn.addEventListener('click', () => {
        modal.showModal();
      })
    }

    function clickHandlerBoard(e) {
      const clickedColumn = e.target.dataset.column;
      
      if (!clickedColumn) return;

      if (!container.querySelector('button#open-reset-modal-btn')) addResetModalOpener();

      game.playRound(clickedColumn);

      updateScreen();

      if (game.getWinner() || game.checkTie()) {
        boardDiv.removeEventListener('click', clickHandlerBoard);
        container.querySelector('#open-reset-modal-btn').classList.add('pulse');
      }
    }

    const clickHanderNewGameBtn = (e) => {
      container.removeChild(container.querySelector('button#open-reset-modal-btn'));
      game.resetGame();
      boardDiv.addEventListener('click', clickHandlerBoard);
      updateScreen();
    }

    const startGame = (e) => {
       container.removeChild(e.target);

       boardDiv = container.querySelector('.board');
       boardDiv.addEventListener('click', clickHandlerBoard);
       boardDiv.id = 'board-styles';

       updateScreen();
    };

    startGameBtn.addEventListener('click', startGame);
    newGameBtn.addEventListener('click', clickHanderNewGameBtn);
    modal.addEventListener("click", e => {
      const modalDimensions = modal.getBoundingClientRect();
      console.log(e.target.tagName);
      if 
        (
        e.clientX < modalDimensions.left ||
        e.clientX > modalDimensions.right ||
        e.clientY < modalDimensions.top ||
        e.clientY > modalDimensions.bottom
      ) {
        modal.close()
      }
    });
})();


