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
            grid:["","","","","","","","","",], 
            _PLAYER : 'X',
            movesCounter : 0,
            gameOver : false,
            choosePlayer : true,
            message : ''
        }


       this.gameLoop = this.gameLoop.bind(this);
       this.checkWinner = this.checkWinner.bind(this);
       this.isMoveValid = this.isMoveValid.bind(this);
       this.draw = this.draw.bind(this);
       this.reset = this.reset.bind(this);
       this.choosePlayerO = this.choosePlayerO.bind(this);
       this.choosePlayerX = this.choosePlayerX.bind(this);
       this.startGame = this.startGame.bind(this);
    }

    

gameLoop(event){
 let id = event.target.id;
 let board = this.state.grid.slice(0);
 let player = this.state._PLAYER;
 let moves = this.state.movesCounter;


    if(this.state.gameOver === false){

            if(this.isMoveValid(board,id)){
            board[id] = player;
            this.setState({grid: board , movesCounter: moves + 1});
            
            
            
            if(this.checkWinner(board, player)){
                
                this.setState({
                    gameOver: true,
                    message : 'Player ' + player + ' wins'
                });
                return;
            }
            else if(this.draw(this.state.movesCounter, board, player)){
                   
                    this.setState({
                    gameOver: true,
                    message : 'Draw'
                });
                    return;
            }
            else{
                this.setState({
                    _PLAYER : this.state._PLAYER === 'X' ? 'O' : 'X'
                });
            
            }
        
        }

    }


}

 isMoveValid(board, id){
    if(board[id] === ""){
        return true;
        }
    else{
        return false;
        }
    }

checkWinner(board, player){
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]];

    for(let i = 0; i < wins.length; i++){
        let win = wins[i];
        if(board[win[0]] === player && board[win[1]] === player && board[win[2]] === player){
            
            return true;
        }
       
        
    }
   
}

draw(counter, board, player){
    if(counter === 8 && this.checkWinner(board,player) === undefined ){
        return true;
    }

}

reset(){
    this.setState(  {
            grid:["","","","","","","","","",], 
            _PLAYER : 'X',
            movesCounter : 0,
            gameOver : false,
            choosePlayer : true
        });
}

choosePlayerX(){
    this.setState({
        _PLAYER : 'X'
    });
}

choosePlayerO(){
    this.setState({
        _PLAYER : 'O'
    });
}

startGame(){
    this.setState({
        choosePlayer : false
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
            
            <div className="boxcontainer">
                {drawBoard}
            </div>
            <div><Button bsStyle="success"  id="resetBtn" onClick={this.reset}>Reset</Button></div>

            <div className="static-modal">
            <Modal show={this.state.choosePlayer}>
                <ModalHeader >
                    <ModalTitle>Choose X or O</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Button className="xButton" bsStyle= "danger" onClick={this.choosePlayerX}>X</Button>
                    <Button className="oButton" bsStyle="primary" onClick={this.choosePlayerO}>O</Button>
                    <Button className="startButton" bsStyle="success" onClick={this.startGame}>Start Game</Button>
                </ModalBody>
            </Modal>
             <Modal show={this.state.gameOver} onHide = {this.reset}>
                <ModalHeader closeButton = "true">
                    <ModalTitle>Game Over</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  {this.state.message}
                </ModalBody>
            </Modal>
  </div>
           
      </div>
    );
  }
}

export default Board;
