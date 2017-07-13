import React, { Component } from 'react';
import './App.css';


import Button from '../node_modules/react-bootstrap/lib/Button';
import Navbar from '../node_modules/react-bootstrap/lib/Navbar';



class Board extends Component {


    constructor(){
        super();
        this.state = {
            grid:["","","O",
                  "","","",
                  "X","","",], 
            winner: null,
            minPlayer : 'O',
            maxPlayer : 'X'
        }


       this.gameLoop = this.gameLoop.bind(this);
       this.checkWinner = this.checkWinner.bind(this);
       this.isMoveValid = this.isMoveValid.bind(this);
       this.draw = this.draw.bind(this);
       this.reset = this.reset.bind(this);
       this.copyBoard = this.copyBoard.bind(this);
       this.minScore = this.minScore.bind(this);
       this.maxScore = this.maxScore.bind(this);
       this.findAIMove = this.findAIMove.bind(this);
    }

    

gameLoop(event){
 let id = event.target.id;
 let player = 'X'
   

 if(this.state.winner === null){
      // *************HUMAN PLAYER LOOP******************
     let currentGameBoard = this.isMoveValid(this.state.grid ,id, player);
    
        if(this.checkWinner(currentGameBoard, player)){
           
            this.setState({
                grid: currentGameBoard,
                winner : player
            });
            return;
        }
        if (this.draw(currentGameBoard)){
           
            this.setState({
                grid: currentGameBoard,
                winner : 'Draw'
            });
            return;
        }
        
    //***********AI PLAYER*******************/

    player = 'O';
    currentGameBoard = this.isMoveValid(currentGameBoard, this.findAIMove(currentGameBoard), player);

    if(this.checkWinner(currentGameBoard, player)){
         this.setState({
                grid: currentGameBoard,
                winner : player
            });
            return;
    }
    if(this.draw(currentGameBoard)){
         this.setState({
                grid: currentGameBoard,
                winner : 'Draw'
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
 isMoveValid(board, position, player){
    let newBoard = this.copyBoard(board);
    if(board[position] === ""){
        
        newBoard[position] = player;
        return newBoard;
        }
    else{
        return null;
        }
    }

// CHECK FOR WINNER.. TAKES A BOARD AND PLAYER 
// FOR LOOP THAT TAKES EACH ARRAY IN WINS ARRAY, THEN USE EACH NUMBER A POSITION TO CHECK ON OUR BOARD
// IF PLAYER SYMBOL MATCHES THEN RETURN TRUE IF (WINNER)
checkWinner(board, player){
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]];

    for(let i = 0; i < wins.length; i++){
        let win = wins[i];
        if(board[win[0]] === player && board[win[1]] === player && board[win[2]] === player) 
           
           {
            return true;
        }
        
    }
   
}

// CHECK FOR DRAW FUNCTION , TAKES A COUNTER OF ALL MOVES MADE SO FAR, BOARD , PLAYER
// IF COUNTER EQUALLS 8 AND CHECKWNNER FUNCTION RETURNS UNDEFINED THEN RETURN TRUE (DRAW)
draw(board){
    let counter = 0 ;

    for(let i = 0 ; i < board.length; i++){
        if(board[i] === ''){
            counter++;
        }

        if(counter === 9){
            return true;
        }
        else{
            return false;
        }
    }

}
// RESET STATE TO DEFAULT
reset(){
    this.setState(  {
            grid:["","","","","","","","","",], 
            movesCounter : 0,
            winner : null
        });
}

copyBoard(board){
   return board.slice(0);  
}


findAIMove(board){
        let bestMoveScore = 100;
        let move = null;

        if(this.checkWinner(board , 'X') || this.checkWinner(board, 'O') || this.draw(board)){
            return null;
        }

        for(let i = 0; i < board.length; i++){
            // newBoard will equal the board returned from valid move, which makes the move..
            let newBoard = this.isMoveValid(board, i, this.state.minPlayer);
            if(newBoard){
                let moveScore = this.minScore(newBoard);
                if(moveScore < bestMoveScore){
                    bestMoveScore = moveScore;
                    move = i;
                }
            }

        }

       return move;
}

minScore(board){
        if(this.checkWinner(board, 'X')){
            return 10;
        }
         if(this.checkWinner(board, 'O')){
                return -10;
        }
         if(this.draw(board)){
            return 0;
        }
        else{
           let bestMoveValue = 100;
           let move = 0;
            for(let i =0; i < board.length; i++){
                let newBoard = this.isMoveValid(board, i,this.state.minPlayer);
                if(newBoard){
                    let predictedMoveValue = this.maxScore(newBoard);
                    if(predictedMoveValue < bestMoveValue){
                        bestMoveValue = predictedMoveValue;
                        move = i;
                    }
                }
            }
            //console.log("Best Move Value(minScore):", bestMoveValue);
            return bestMoveValue;
        }
    }

maxScore(board){
        if(this.checkWinner(board, 'X')){
            return 10;
        }
         if(this.checkWinner(board, 'O')){
                return -10;
        }
         if(this.draw(board)){
            return 0;
        }
        else{
           let bestMoveValue = -100;
           let move= 0;
            for(let i =0; i < board.length; i++){
                let newBoard = this.isMoveValid(board, i,this.state.maxPlayer);
                if(newBoard){
                    let predictedMoveValue = this.minScore(newBoard);
                    if(predictedMoveValue > bestMoveValue){
                        bestMoveValue = predictedMoveValue;
                        move = i;
                    }
                }
            }
            //console.log("Best Move Value(maxScore):", bestMoveValue);
            return bestMoveValue;
        }
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
            
            <div className="boxcontainer">
                {drawBoard}
            </div>
            <div><Button bsStyle="success"  id="resetBtn" onClick={this.reset}>Reset</Button></div>

           
           
        </div>
           
      
    );
  }
}

export default Board;
