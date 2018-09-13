"use strict";
function bestRollDice(){// The most important function in the program.
	return 4; // Chosen by fair dice roll. Guaranteed to be random.
}




function newGame(){
	gameInProgress = true;
	board = new GameBoard(20, 21, 10, 8);
	document.getElementById("welcomeMessage").style.display = "none";
	document.getElementById("gameBoard").innerHTML = board.htmlTableBoard;
	document.getElementById("gameComponents").style.display = "block";
		
	/* Old psuedocode for when there wasnt a global GameBoard variable
	 * Test to see if pseudoBoard == OG Board
	 * Test results:
	 * board != testBoard
	 * Probably due to spacing, and would likely still work
	 * Decided to go with global variable for now instead of re-creating the board every time
	 */

}
function checkCurrentGame(){
	if(gameInProgress){
		let restart = prompt("Are you sure you want to quit this game and start a new one? Please type: 'New Game' if you do.")
		if(restart == "New Game"){
			newGame();
		}
		else{
			let alertMessage = "You entered: '";
			alertMessage += restart;
			alertMessage += "'. If you wanted to start a new game, please click the button again and type 'New Game'.";
			alert(alertMessage);
		}
	}
	else{
		newGame();
	}
}

/*
 * Initial creation of page
 */
 function initial(){
	 
	document.getElementById("gameComponents").style.display = "none";
 }

// TODO: Make everything except welcome message and new game button invisible, then swap on new game button click. Ambitious things: Safety on new game button; more versatile Power Ups, would probably require an inventory; external file for high scores; different scoring categories (fastest to bottom, most stuff dug, maybe some * give points); make it look pretty -> bootstrap????

// Cant create golobal variable board = new GameBoard here (before the GameBoard class is created). Weird.
class GameBoard{
	constructor(columnHeight, rowLength, spawnRow, powerUpFrequency){
		if(columnHeight !== undefined){
			this.columnHeight = columnHeight;
			this.rowLength = rowLength;
			this.spawnRow = spawnRow;
			this.powerUpFrequency = powerUpFrequency;
			this.htmlTableBoard = this.makeNewGameBoard();
			this.arrayBoard = this.htmlTableToArray();
			this.nextRoll = 6; // Dont need this. Only keeping it so pseudoConstructor works, but that function is also obsolete.
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
	
	static dXtoNumber(dX){// This doesnt need to be static. It would make member variablenextRoll useful again
		let output = GameBoard.withoutString(dX, "Next roll will be: d");
		output = parseInt(output, 10);
		return output;
	}

	/*
	 * Make the game board as a string containing an html table.
	 * It's simpler than it looks. Just 2 nested for loops (for making a 2D object).
	 * Table elements can be 1 of 3 characters: @ * -
	 * - is the default symbol, so we check for the special ones first.
	 */
	makeNewGameBoard(){
		let output = "";
		for(let i = 0; i < this.columnHeight; i++){// <tr>'s
			output += "<tr>";
			for(let j = 0; j < this.rowLength; j++){// <td>'s
				if(i == 0 && j == this.spawnRow){ // Should only happens once.
					output += "<td>@</td>";
				}
				else{
					/* 
					 * If the random number is 1 (so 1 in x chance) make a power up block,
					 * unless we are on the starting column for the player or the last row.
					 */
					let rand = GameBoard.roll_dX(this.powerUpFrequency);
					if(rand == 1 && j != this.spawnRow && i != this.columnHeight - 1){ 
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
		
	/* 
	 * Convert from array to table. If board is a GameBoard, probably use
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
	
	gameAdvance(){
		let roll = GameBoard.roll_dX(GameBoard.dXtoNumber(document.getElementById("nextRoll").innerHTML));
		let direction;
		let radios = document.getElementsByName("direction");
		
		// Reset messages
		document.getElementById("nextRoll").innerHTML = "Next roll will be: d6";
		document.getElementById("outputArea").innerHTML = "No Power-Ups right now.";
			
			
		for(let i = 0; i < radios.length; i++){
			if(radios[i].checked == true){
				direction = radios[i].value;
			}
		}
		switch (direction){
			case "down":
			// "Dig out' array spots the player dug through. Also, check for power ups.
			for (let i = 0; i < roll && this.position[0] + i < this.columnHeight; i++){
				if(this.arrayBoard[this.position[0] + i][this.position[1]] == "*"){
					roll = i;
					this.powerUp();					
				}
				this.arrayBoard[this.position[0] + i] [this.position[1]] = " ";
			}
			
			// Change position
			this.position = [this.position[0] + roll, this.position[1]];
			
			// Check if win TODO: what happens when player wins?
			if(this.position[0] > this.columnHeight -1){// If out of bounds
				this.position[0] = this.columnHeight - 1;// Push back in bounds
				this.youWin();
			}
			
				break;
				
			case "left":
				// "Dig out' array spots the player dug through. Also, check for power ups.
				
				for(let i = 0; i < roll && this.position[1] - i > 0; i++){
					if(this.arrayBoard[this.position[0]][this.position[1] - i] == "*"){
						roll = i;
						this.powerUp();
					}
					
					this.arrayBoard[this.position[0]] [this.position[1] - i] = " ";
	
				}
				// Change position
				this.position = [this.position[0], this.position[1] - roll];
				
				// Check if out of bounds
				if(this.position[1] < 0){
					this.position[1] = 0;
				}
				
				break;
				
			case "right":
				// "Dig out' array spots the player dug through. Also, check for power ups.
				for(let i = 0; i < roll && this.position[1] +i < this.rowLength; i++){
					if(this.arrayBoard[this.position[0]][this.position[1] + i] == "*"){
						roll = i;
						this.powerUp();					
					}
					
					this.arrayBoard[this.position[0]] [this.position[1] + i] = " ";
				}
				// Change position
				this.position = [this.position[0], this.position[1] + roll];
			
				// Check if out of bounds
				if(this.position[1] > this.rowLength - 1){
					this.position[1] = this.rowLength - 1;
				}
				
				break;
				
			default:
				console.log("THIS IS A PROBLEM");
		}

		// Show new board (happens no matter what direction player moves)
		this.arrayBoard[this.position[0]][this.position[1]] = "@";
		this.htmlTableBoard = this.arrayToHtmlTable();
		document.getElementById("gameBoard").innerHTML = this.htmlTableBoard;
	}
	
	youWin(){
		/* 
		 * Make Go! button do nothing.
		 * Make new game button visible again.
		 * Final score table update.
		 * Score table:
		 *	Number of moves(or time to bottom):
		 *	Number of Power-Ups collected:
		 *	Number of times Unlucky:
		 */
	}
	powerUp(){// Roll a result = d20 and then roll a resultCeption d(result). Your next roll will be d(resultCeption)
		let result = GameBoard.roll_dX(20);
		if(result == 2){
			document.getElementById("nextRoll").innerHTML = "Next roll will be: d0";
			document.getElementById("outputArea").innerHTML = "UNLUCKY!!!";
			
		}
		else{
			let resultCeption = GameBoard.roll_dX(result);
			test(resultCeption); // test line
			let output = "Next roll will be: d";
			output += resultCeption;
			document.getElementById("nextRoll").innerHTML = output;
			document.getElementById("outputArea").innerHTML = "Power-Up dice get!";
		}
		// Power ups: next roll becomes a d(4, 8, 10, 12, 14) [d20 is too op]{changed to random dX where X is from 1-20} miss X turns (turn counter just increments), points? have a seperate score at end of game
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

let board = new GameBoard(20, 21, 10, 8); // Global variable. Works better to store the game state in global than to re-make an identical GameBoard for every iteration.
let gameInProgress = false;

// Test functions.
function test(input){
	console.log(input);
}
function test2(){
	let direction;
	let radios = document.getElementsByName("direction");
	for(let i = 0; i < radios.length; i++){
		if(radios[i].checked == true){
			direction = radios[i].value;
		}
	}
	test(direction);
	
}
function iterate2DArray(input){
	for(let i = 0; i < input.length; i++){
		for(let j = 0; j < input[i].length; j++){
			test(input[i][j]);
		}
		console.log("next Line");
	}
}
