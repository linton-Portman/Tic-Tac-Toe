import React, { Component } from 'react';
import './App.css';


import Button from '../node_modules/react-bootstrap/lib/Button';
import Navbar from '../node_modules/react-bootstrap/lib/Navbar';

import Modal from '../node_modules/react-bootstrap/lib/Modal';
import ModalHeader from '../node_modules/react-bootstrap/lib/ModalHeader';
import ModalBody from '../node_modules/react-bootstrap/lib/ModalBody';
import ModalTitle from '../node_modules/react-bootstrap/lib/ModalTitle';

class Board extends Component {


    constructor(){
        super();
        this.state = {
            grid:[" "," "," ",
                  " "," "," ",
                  " "," "," ",], 
            minPlayer : 'o',
            maxPlayer : 'x',
            gameOver : false,
            player : 'x',
            buttonVisible : false,
            message : null,
          
        }


       this.gameLoop = this.gameLoop.bind(this);
       this.winner = this.winner.bind(this);
       this.validMove = this.validMove.bind(this);
       this.tie = this.tie.bind(this);
       this.copyBoard = this.copyBoard.bind(this);
       this.minScore = this.minScore.bind(this);
       this.maxScore = this.maxScore.bind(this);
       this.findAiMove = this.findAiMove.bind(this);
       this.reset = this.reset.bind(this);
       this.playerChooseX = this.playerChooseX.bind(this);
       this.playerChooseO = this.playerChooseO.bind(this);
       
    }

gameLoop(event){
    // On Start of play disable the player choice buttons
    this.setState({
        buttonVisible : true
    });
    
    // Only make a move if the game is not over 
    if(this.state.gameOver === false){
        // get id of box clicked , to use as a move position on board
         let id = event.target.id;
         let player = this.state.player;
   

 
      // *************HUMAN PLAYER LOOP******************
     let currentGameBoard = this.validMove( id, player ,this.state.grid);
    
        if(this.winner(currentGameBoard, player)){
           
            this.setState({
                grid: currentGameBoard,
                gameOver : true,
                message : player.toUpperCase() +' wins'
            });
            return;
        }
        if (this.tie(currentGameBoard)){
           
            this.setState({
                grid: currentGameBoard,
                gameOver : true,
                message: 'Draw'
            });
            return;
        }
        
     //***********AI PLAYER*******************/
     player = this.state.player === 'x' ? 'o' : 'x';

     currentGameBoard = this.validMove( this.findAiMove(currentGameBoard), player , currentGameBoard);

        if(this.winner(currentGameBoard, player)){
            this.setState({
                    grid: currentGameBoard,
                    gameOver : true,
                    message : 'You Lose!'
                });
                return;
        }
        if(this.tie(currentGameBoard)){
            this.setState({
                    grid: currentGameBoard,
                    gameOver : true,
                    message: 'Draw'
                });
                return;
        }

        this.setState({
            grid: currentGameBoard,

        });
    }
}

// MAKE MOVE FUNCTION .. TAKES IN A BOARD ,MOVE POSITION AND PLAYER
// CHECKS IF MOVE POSITION IS BLANK 
// IF BLANK , COPIES BOARD AND PUTS PLAYER IN NEW POSTION
// RETURNS NEW BOARD
// IF NOT BLANK , THEN JUST EXITS FUNCTION
validMove(move, player, board){
  var newBoard = this.copyBoard(board);
  if(newBoard[move] === " "){
    newBoard[move] = player;
    return newBoard;
  } else
    return null;
}

// CHECK FOR WINNER.. TAKES A BOARD AND PLAYER 
// FOR LOOP THAT TAKES EACH ARRAY IN WINS ARRAY, THEN USE EACH NUMBER A POSITION TO CHECK ON OUR BOARD
// IF PLAYER SYMBOL MATCHES THEN RETURN TRUE IF (WINNER)
winner(board, player){
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]];

    for(let i = 0; i < wins.length; i++){
        let win = wins[i];
        if(board[win[0]] === player && board[win[1]] === player && board[win[2]] === player) 
           
           {
            return true;
        }
      
    }
}

tie(board) {
  var moves = board.join('').replace(/ /g, ''); 

    
  if (moves.length === 9) {
    return true;
  }
  return false;
}

copyBoard(board) {
  //This returns a new copy of the Board and ensures that you're only
  //manipulating the copies and not the primary board.
  return board.slice(0);
}

findAiMove(board) {
    var bestMoveScore = 100;
    let move = null;
     //Test Every Possible Move if the game is not already over.
        if(this.winner(board, 'x') || this.winner(board, 'o') || this.tie(board)) {
            return null;
        }
            for(var i = 0; i < board.length; i++){
                let newBoard = this.validMove(i, this.state.minPlayer, board);
                //If validMove returned a valid game board
                if(newBoard) {
                var moveScore = this.maxScore(newBoard);
                if (moveScore < bestMoveScore) {
                    bestMoveScore = moveScore;
                    move = i;
                }
                }
            }
            return move;
}

minScore(board) {
  if (this.winner(board, this.state.maxPlayer)) {
    return 10;
  } else if (this.winner(board, this.state.minPlayer)) {
    return -10;
  } else if (this.tie(board)) {
    return 0;
  } else {
        var bestMoveValue = 100;
            for (var i = 0; i < board.length; i++) {
            var newBoard = this.validMove(i, this.state.minPlayer, board);
            if (newBoard) {
                var predictedMoveValue = this.maxScore(newBoard);
                if (predictedMoveValue < bestMoveValue) {
                bestMoveValue = predictedMoveValue;
                }
            }
            }
        return bestMoveValue;
  }
}

maxScore(board) {
   if(this.winner(board, this.state.maxPlayer)) {
    return 10;
  } else if(this.winner(board, this.state.minPlayer)) {
    return -10;
  } else if(this.tie(board)) {
    return 0;
  } else {
 var bestMoveValue = -100;
        for (var i = 0; i < board.length; i++) {
            var newBoard = this.validMove(i, this.state.maxPlayer, board);
                if (newBoard) {
                    var predictedMoveValue = this.minScore(newBoard);
                    if (predictedMoveValue > bestMoveValue) {
                        bestMoveValue = predictedMoveValue;
                    }
                }
        }
        return bestMoveValue;
  }
}

reset(){
    this.setState({
         grid:[" "," "," ",
                  " "," "," ",
                  " "," "," ",], 
            minPlayer : 'o',
            maxPlayer : 'x',
            gameOver : false,
            player : 'x',
            buttonVisible : false
    });
}

playerChooseX(){
  this.setState({
      player : 'x',
      minPlayer: 'o',
      maxPlayer : 'x'
  });;
}

playerChooseO(){
 this.setState({
     player : 'o',
     minPlayer : 'x',
     maxPlayer: 'o'
 });
}



  render() {

       let drawBoard = this.state.grid.map((item, index) => {
    return (
            <div id= {index} key= {index} className="box" onClick = {this.gameLoop}>{this.state.grid[index]}</div>
            
    )
});




    return (
        <div>

                <Navbar>
                    <Navbar.Header>
                    <Navbar.Brand>
                        <a>Tic-Tac_Toe</a>
                    </Navbar.Brand>
                    </Navbar.Header>
                </Navbar>

            <h4>You are : {this.state.player.toUpperCase()}</h4>
            
            <div className="boxcontainer">
                {drawBoard}
            </div>
            <div><Button bsStyle="success"  id="resetBtn" onClick={this.reset}>Reset</Button></div>
            <h4>Choose X or O</h4>
            <div><Button disabled={this.state.buttonVisible} bsStyle="success"  id="xButton" onClick={this.playerChooseX}>X</Button>
                 <Button disabled={this.state.buttonVisible} bsStyle="primary"  id="xButton" onClick={this.playerChooseO}>O</Button>
            </div>
                
                <Modal show={this.state.gameOver} onHide = {this.reset}>
                    <ModalHeader closeButton = "true">
                        <ModalTitle>Game Over</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                    {this.state.message}
                    </ModalBody>
                 </Modal>
           
           
           
        </div>
           
      
    );
  }
}

export default Board;
