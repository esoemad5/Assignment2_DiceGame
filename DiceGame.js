"use strict";
function bestRollDice(){// The most important function in the program.
	return 4; // Chosen by fair dice roll. Guaranteed to be random.
}

/*
 * Known Bugs:
 * There is a dot at the top of the screen before the game starts, when the welcome message is visible.
 * This seems to be the border around the table, which is hidden.
 */
 
 /*
  * Fixed Bugs:
  * Touching the left and right walls in a single row would make it dissapear on moving down.
  * 	Fixed: Added 'white-space:pre;' on tables to the css.
  *
  * Getting an UNLUCKY Power-Up would make you move 1 space instead of zero
  * 	Fixed: Added if statement to GameBoard.roll_dX. If input is 0, returns 0. Previously, the method returned 1.
  *
  * Power-Up Bug. Getting a Power-Up sometimes does nothing.
  *		Fixed: Only happens when the user lands on a Power-Up exactly (ex. rolling a 3 when one is 3 spaces away).
  * 	Let the for loop when moving in 'gameAdvance' iterate once more.
  *		Changed the terminating parameter from 'i < roll' to 'i <= roll'
  */

  /*
   * For the grader: 
   * The static method roll_dX in GameBoard should fufill the 3rd user story:
   * "As a developer, I want to have one function capable of “rolling a die” (by generating a random number), regardless of the number of sides."
   *
   * The powerUp method of GameBoard should fulfil the 4th user story:
   * As a developer, I want to utilize six different dice within my game. (Recommended dice are 4-sided, 6-sided, 8-sided, 10-sided, 12-sided, and 20-sided. Different dice may be substituted. No 2-sided die.)
   */


/*
 * Initial creation of page
 */
function initial(){ 
	document.getElementById("gameComponents").style.display = "none";
	document.getElementById("winnerWinnerChickenDinner").style.display = "none";
 }
function newGame(columnHeight = 20, rowLength = 31, spawnRow = 15, powerUpFrequency = 8){
	gameInProgress = true;
	board = new GameBoard(columnHeight, rowLength, spawnRow, powerUpFrequency);
	document.getElementById("welcomeMessage").style.display = "none";
	document.getElementById("gameBoard").innerHTML = board.htmlTableBoard;
	document.getElementById("gameComponents").style.display = "block";
	document.getElementById("winnerWinnerChickenDinner").style.display = "none";
		
	/* Old psuedocode for when there wasnt a global GameBoard variable
	 * Test to see if pseudoBoard == OG Board
	 * Test results:
	 * board != testBoard
	 * Probably due to spacing, and would likely still work
	 * Decided to go with global variable for now instead of re-creating the board every time
	 */
}
function checkCurrentGame(isCustomGame){
	if(gameInProgress){
		let restart = prompt("Are you sure you want to quit this game and start a new one? Please type: 'New Game' if you do.")
		if(restart == "New Game"){
			if(isCustomGame){
				customGame();
			}
			else{
				newGame();
			}

		}
		else{
			let alertMessage = "You entered: '";
			alertMessage += restart;
			alertMessage += "'. If you wanted to start a new game, please click the button again and type 'New Game'.";
			alert(alertMessage);
		}
	}
	else{
		if(isCustomGame){
			customGame();
		}
		else{
			newGame();
		}		
	}
}
function customGame(){
			
	let customGameParameters = [];
	let parameterNames = ["height", "width", "spawnRow", "powerUpFrequency"];
	
	//For ensuring spawnRow < width
	let spawnRow;
	let width;
	let haveSpawnRow = false;
	let haveWidth = false;
	for(let i = 0; i < parameterNames.length; i++){
		
		customGameParameters[i] = document.getElementById(parameterNames[i]).value;
		
		if(parameterNames[i]== "spawnRow"){
			spawnRow = customGameParameters[i];
			haveSpawnRow = true;
		}
		if(parameterNames[i]== "width"){
			width = customGameParameters[i];
			haveWidth = true;
		}

		if(haveWidth && haveSpawnRow && spawnRow >= width){
			alert("Please enter a Starting Column that is at least 1 less than the Width.");
			return;
		}

		if(Number.isNaN(customGameParameters[i]) || customGameParameters[i] < 0 || Math.floor(customGameParameters[i]) != customGameParameters[i]){
			alert("Please enter ONLY POSITIVE INTEGERS for a custom game.");
			return;
		}
		
		//Debugging code
		console.log("----------------------------------");
		console.log("New run.");
		console.log("----------------------------------");
		console.log(customGameParameters[i]);
		console.log("Input is NaN: ", Number.isNaN(customGameParameters[i]));
		//console.log("Input is non-decimal: "Math.floor(customGameParameters[i]) != customGameParameters[i]);
		console.log("----------------------------------");
		
		//This message will repeat a few times because I am a novice programmer. Thats what you get for giving me bad inputs though.
		//End debugging code

	}
	
	newGame(customGameParameters[0], customGameParameters[1], customGameParameters[2], customGameParameters[3]);
			
			
}

// Cant create golobal variable board = new GameBoard() here (before the GameBoard class is created). Weird. All global vairables are declared at the bottom of the file.

class GameBoard{
	constructor(columnHeight, rowLength, spawnRow, powerUpFrequency){
		/*
		 * This is another if statment for pseudoConstructor.
		 * Makes no functional difference if it is or isn't here.
		 * Keeping it in case pseudoConstructor becomes relevant again
		 */
		if(columnHeight !== undefined){
			this.columnHeight = columnHeight;
			this.rowLength = rowLength;
			this.spawnRow = spawnRow;
			this.powerUpFrequency = powerUpFrequency;
			this.htmlTableBoard = this.makeNewGameBoard();
			this.arrayBoard = this.htmlTableToArray();
			this.nextRoll = 6; // Dont need this. Only keeping it so pseudoConstructor works, but that function is also obsolete.
			this.position = [0, spawnRow];
			this.numberOfMoves = 0;
			this.numberOfPowerUpsCollected = 0;
			this.numberOfTimesUnlucky = 0;
		}
	}

	
	static dXtoNumber(dX){
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
	 * This method is NOT called in the constructor, unlike htmlTableToArray.
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
		if(this.columnHeight === undefined || this.rowLength === undefined){// Only if using pseudoConstructor. At the moment, code should never reach here.
			console.log("Code should not reach here. See  if statement in DiceGame.htmlTableToArray");
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
		this.numberOfMoves++;
		let roll = GameBoard.roll_dX(GameBoard.dXtoNumber(document.getElementById("nextRoll").innerHTML));
		let direction;
		let radios = document.getElementsByName("direction");
		
		// Reset messages
		document.getElementById("nextRoll").innerHTML = "Next roll will be: d6";
		document.getElementById("outputArea").innerHTML = "No Power-Ups right now.";
			
		// Get which direction the user wants to go in.	
		for(let i = 0; i < radios.length; i++){
			if(radios[i].checked == true){
				direction = radios[i].value;
			}
		}
		switch (direction){
			case "down":
			// "Dig out' array spots the player dug through. Also, check for power ups.
			for (let i = 0; i <= roll && this.position[0] + i < this.columnHeight; i++){
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
				
				for(let i = 0; i <= roll && this.position[1] - i > 0; i++){
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
				for(let i = 0; i <= roll && this.position[1] +i < this.rowLength; i++){
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
				console.log("Reached default case of movement. Should not be possible.");
		}

		// Show new board (happens no matter what direction player moves)
		this.arrayBoard[this.position[0]][this.position[1]] = "@";
		this.htmlTableBoard = this.arrayToHtmlTable();
		document.getElementById("gameBoard").innerHTML = this.htmlTableBoard;
	}
	
	youWin(){
		let finalMessage = "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
		finalMessage +="<br>!!"
		finalMessage += addRightBorder(38);
		
		finalMessage +="<br>!!		You Win!!!";
		finalMessage += addRightBorder(14);
		finalMessage += "<br>!!"; 
		finalMessage += addRightBorder(38);
		finalMessage += "<br>!! Number of moves: ";
		finalMessage += this.numberOfMoves;
		finalMessage += addRightBorder(20 - this.numberOfMoves.toString().length);
		finalMessage += "<br>!! Number of Power-Ups collected: ";
		finalMessage += this.numberOfPowerUpsCollected;
		finalMessage += addRightBorder(6 - this.numberOfPowerUpsCollected.toString().length);
		finalMessage += "<br>!! Number of times Unlucky D: ";
		finalMessage += this.numberOfTimesUnlucky;
		finalMessage += addRightBorder(10 - this.numberOfTimesUnlucky.toString().length);
		finalMessage += "<br>!!"; 
		finalMessage += addRightBorder(38);
		finalMessage += "<br>!!        Thank you for playing!!"
		finalMessage += addRightBorder(7);
		finalMessage += "<br>!!"
		finalMessage += addRightBorder(38);
		finalMessage += "<br>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
		document.getElementById("gameComponents").style.display = "none";
		document.getElementById("winnerWinnerChickenDinner").innerHTML = finalMessage;
		document.getElementById("winnerWinnerChickenDinner").style.display = "block";
		 
		function addRightBorder(numberOfSpacesNeeded){
			let output = "";
			for (let i = 0; i < numberOfSpacesNeeded; i++){
				output += " ";
			}
			output += "!!";
			return output;
		 }
	}
	
	powerUp(){// Roll a result = d20 and then roll a resultCeption = d(result). Your next roll will be d(resultCeption)
		this.numberOfPowerUpsCollected++;
		let result = GameBoard.roll_dX(20);
		if(result == 2){
			document.getElementById("nextRoll").innerHTML = "Next roll will be: d0";
			document.getElementById("outputArea").innerHTML = "UNLUCKY!!!";
			this.numberOfTimesUnlucky++
			
		}
		else{
			let resultCeption = GameBoard.roll_dX(result);

			let output = "Next roll will be: d";
			output += resultCeption;
			document.getElementById("nextRoll").innerHTML = output;
			document.getElementById("outputArea").innerHTML = "Power-Up: Dice Get!";
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
		if(dX == 0){
			return 0;
		}
		let max = dX;
		let output = Math.floor((Math.random()*max) + 1);
		return output;
	}

	static pseudoConstructor(){// Don't use this. Keeping it around just in case.
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
}

let board = new GameBoard(); // Global variable. Works better to store the game state in global than to re-make an identical GameBoard for every iteration. Note to change game board properties (size, power up spawn rate, spawn column etc...) edit function newGame.
let gameInProgress = false;

// Test functions.
function test(input){
	console.log(input);
}
function test2(){
	let a = 5;
	let b = 12345;
	console.log(a.toString().length);
	console.log(b.toString().length);
	
}
function iterate2DArray(input){
	for(let i = 0; i < input.length; i++){
		for(let j = 0; j < input[i].length; j++){
			test(input[i][j]);
		}
		console.log("next Line");
	}
}
