"use strict";
function bestRollDice(){
	return 4; // chosen by fair dice roll. guaranteed to be random.
}

// Test functions
function test(input){
	console.log(input);
}
function test2(){
	let board = GameBoard.pseudoConstructor()
	test(board);
	
}
function iterate2DArray(input){
	for(let i = 0; i < input.length; i++){
		for(let j = 0; j < input[i].length; j++){
			test(input[i][j]);
		}
		console.log("next Line");
	}
}

// TODO: gameAdvance; Idk if radio buttons will work; Show what kind of die will be rolled next (d6, d8, etc...); Message box for what happened on a *; Ambitious things: safety on new game button; more versatile *, would probably require an inventory; external file for high scores; different scoring categories (fastest to bottom, most stuff dug, maybe some * give points); make it look pretty -> bootstrap????
// Cant create golobal variable board = new GameBoard here. Weird.
class GameBoard{
	constructor(columnHeight, rowLength, spawnRow, powerUpFrequency){
		if(columnHeight !== undefined){
			this.columnHeight = columnHeight;
			this.rowLength = rowLength;
			this.spawnRow = spawnRow;
			this.powerUpFrequency = powerUpFrequency;
			this.htmlTableBoard = this.makeNewGameBoard();
			this.arrayBoard = this.htmlTableToArray();
			this.nextRoll = 6;
			this.position = [0, spawnRow];
		}
	}
	static pseudoConstructor(){// Don't use this.
		let board = new GameBoard();
		// spawnRow doesn't matter after board has been made
		// powerUpFrequency doesn't matter after the board has been made
		board.htmlTableBoard = document.getElementById("gameBoard").innerHTML;
		board.arrayBoard = board.htmlTableToArray();
		board.nextRoll = GameBoard.dXtoNumber(document.getElementById("nextRoll").innerHTML);
		board.columnHeight = board.arrayBoard.length;
		board.rowLength = board.arrayBoard[0].length;
		return board;
	}
	
	static dXtoNumber(dX){// Probably dont need this either
		let output = GameBoard.withoutString(dX, "Next roll will be: d");
		output = parseInt(output, 10);
		return output;
	}

	makeNewGameBoard(){// Remove the test line before submitting!
		let output = "";
		for(let i = 0; i < this.columnHeight; i++){// Testing with 100
			output += "<tr>";
			for(let j = 0; j < this.rowLength; j++){// Testing with 21
				let rand = GameBoard.roll_dX(this.powerUpFrequency);
				if(i == 0 && j == this.spawnRow){
					output += "<td>@</td>";
				}
				else{
					if(rand == 1 && j != this.spawnRow){ // if the random number is 1 (so 1 in x chance) make a power up block, unless we are on the starting space for the player.
						output += "<td>*</td>";
					}
					else{
						output += "<td>-</td>";
					}
				}			
			}
		}
		
		return output;
		
	}
		
	/* Convert from array to table. If board is a GameBoard, probably use
	 * document.getElementById("gameBoard").innerHTML = board.arrayToHtmlTable;
	 * this method is NOT called in the constructor, unlike htmlTableToArray.
	 */
	arrayToHtmlTable(){
		let output = "";
		for(let i = 0; i < this.arrayBoard.length; i++){
			output += "<tr>";
			for(let j = 0; j < this.arrayBoard[i].length; j++){
				output += "<td>";
				output += this.arrayBoard[i][j];
				output += "</td>";
			}
			output += "</tr>";
		}
		return output;
	}
	
	htmlTableToArray(){
		let output = [];
		let boardAsString = this.htmlTableBoard;
		

		// Convert to a string of '-*-*@--*--'
		boardAsString = GameBoard.withoutString(boardAsString, "<tbody>");
		boardAsString = GameBoard.withoutString(boardAsString, "</tbody>");
		if(this.columnHeight === undefined || this.rowLength === undefined){
			let empericalColH = 0;
			let empericalRowL = 0;
			for(let k = 0; k < boardAsString.length; k++){
				if(boardAsString[k] == "r"){
					empericalColH ++;
				}
				if(boardAsString[k] == "d"){
					empericalRowL ++;
				}
			}
			empericalColH = empericalColH / 2;
			empericalRowL = empericalRowL /2;
			empericalRowL = empericalRowL/empericalColH;
			this.columnHeight = empericalColH;
			this.rowLength = empericalRowL;
		}
		boardAsString = GameBoard.withoutString(boardAsString, "<tr>");
		boardAsString = GameBoard.withoutString(boardAsString, "</tr>");
		boardAsString = GameBoard.withoutString(boardAsString, "<td>");
		boardAsString = GameBoard.withoutString(boardAsString, "</td>");
	
		// Convert to a 2D-array
		for(let i = 0; i < this.columnHeight; i++){
			let rowOutput = [];
			for(let j = 0; j < this.rowLength; j++){
				rowOutput.push(boardAsString[(i * this.rowLength) + j]);
			}
			output.push(rowOutput);
		}
		return output;
	}
	
	// TODO: Everything lol
	gameAdvance(){
		//Assume always move down for the moment
		this.position = [this.position[0] + GameBoard.roll_dX(GameBoard.dXtoNumber(document.getElementById("nextRoll").innerHTML)), this.position[1]];
		test(this.position);
	}
	
	static withoutString(base, remove){
	let output = "";
	for(let i = 0; i < base.length; i++){
		if(base[i] == remove[0]){
			if(!GameBoard.checkRestOfRemoveString(base, remove, i)){
				output += base[i];
			}
			else{// If remove string is found, don't add it to the output string and move i forward.
				i += remove.length-1; //literally just changed this line. added '-1'
			}
		}
		else{
			output += base[i];
		}
	}
	return output;
	}
	static checkRestOfRemoveString(base, remove, positionInBaseString){
		for(let j = 0; j < remove.length; j++){
			if(base[positionInBaseString + j] != remove[j]){
				return false;
			}
		}
		return true;
	}

	static roll_dX(dX){// Roll a die with x sides (a dX, if you will)
		let max = dX;
		let output = Math.floor((Math.random()*max) + 1);
		return output;
	}

}

let board = new GameBoard(100, 21, 10, 15); // Global variable


// TODO: Should add a confirm box if a game is already in progress to avoid miss-clicks. Lazy sollution would be to put button below the game board.
function newGame(){
	document.getElementById("welcomeMessage").style.display = "none";
	document.getElementById("gameBoard").innerHTML = board.htmlTableBoard;
	
	/* Test to see if pseudoBoard == OG Board
	 * Test results:
	 * board != testBoard
	 * Probably due to spacing, and would likely still work
	 * Decided to go with global variable for now instead of re-creating the board every time
	 */

}