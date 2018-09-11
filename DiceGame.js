function bestRollDice(){
	return 4; // chosen by fair dice roll. guaranteed to be random.
}



function test(input){
	console.log(input);
}



class GameBoard{
	constructor(columnHeight, rowLength, spawnRow, powerUpFrequency){
		this.columnHeight = columnHeight;
		this.rowLength = rowLength;
		this.spawnRow = spawnRow;
		this.powerUpFrequency = powerUpFrequency;
		this.board = this.makeNewGameBoard();
	}
	
	
	//GameBoard.prototype.makeGameBoard = 
	makeNewGameBoard(){
		let output = "";
		for(let i = 0; i < this.columnHeight; i++){// Testing with 100
			output += "<tr>";
			for(let j = 0; j < this.rowLength; j++){// Testing with 21
				let rand = roll_dX(this.powerUpFrequency);
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
		document.getElementById("gameBoard").innerHTML = output;
		test(output);
	}
	
	// TODO: Everything lol
	gameAdvance(dieSize, direction){
	
	}
	
	// TODO: Everything lol
	arrayToHtmlTable(){
		
	}
	
	// Functions to make the game board into a 2D-array
	htmlTableToArray(){
		let output = this.board;
		output = withoutString(output, "<tbody>");
		output = withoutString(output, "</tbody>");
		output = withoutString(output, "<tr>");
		output = withoutString(output, "</tr>");
		output = withoutString(output, "<td>");
		output = withoutString(output, "</td>");
		//TODO: Convert string to 2D-array
	}
	static withoutString(base, remove){
	let output = "";
	for(let i = 0; i < base.length; i++){
		if(base[i] == remove[0]){
			if(!checkRestOfRemoveString(base, remove, i)){
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

	static roll_dX(dX){// roll a die with x sides
		let max = dX;
		let output = Math.floor((Math.random()*max) + 1);
		return output;
	}
}


// TODO: Should add a confirm box if a game is already in progress to avoid miss-clicks. Lazy sollution would be to put button below the game board.
function newGame(columnHeight, rowLength, spawnRow, powerUpFrequency){
	let board = new GameBoard(columnHeight, rowLength, spawnRow, powerUpFrequency);
	document.getElementById("welcomeMessage").style.display = "none";
}