function bestRollDice(){
	return 4; // chosen by fair dice roll. guaranteed to be random.
}


function gameAdvance(dieSize, direction){
	
}
function test(input){
	console.log(input);
}

function roll_dX(dX){// roll a die with x sides
	let max = dX;
	let output = Math.floor((Math.random()*max) + 1);
	return output;
}

function makeGameBoard(columnHeight, rowLength, spawnRow, powerUpFrequency){
	let output = "";
	for(let i = 0; i < columnHeight; i++){// Testing with 100
		output += "<tr>";
		for(let j = 0; j < rowLength; j++){// Testing with 21
			let rand = roll_dX(powerUpFrequency);
			if(i == 0 && j == spawnRow){
				output += "<td>@</td>";
			}
			else{
				if(rand == 1 && j != spawnRow){ // if the random number is 1 (so 1 in x chance) make a power up block, unless we are on the starting space for the player.
					output += "<td>*</td>";
				}
				else{
					output += "<td>-</td>";
				}
			}			
		}
	}
	//test(output);
	document.getElementById("gameBoard").innerHTML = output;
	let a = document.getElementById("gameBoard").innerHTML;
	test("printing a");
	test(a);
}

function convertBoard(){
	let board = document.getElementById("gameBoard").innerHTML;
	board = withoutString(board, "<tbody>");
	board = withoutString(board, "</tbody>");
	board = withoutString(board, "<tr>");
	board = withoutString(board, "</tr>");
	board = withoutString(board, "<td>");
	board = withoutString(board, "</td>");
}
function withoutString(base, remove){
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
function checkRestOfRemoveString(base, remove, positionInBaseString){
	for(let j = 0; j < remove.length; j++){
		if(base[positionInBaseString + j] != remove[j]){
			return false;
		}
	}
	return true;
}









function changeOutputArea(input){
	document.getElementById("outputArea").innerHTML = input;
}
function appendOutputArea(input){
	document.getElementById("outputArea").innerHTML += input;
}
function changeRollHistory(input){
	document.getElementById("rollHistory").innerHTML += input;
}
function appendRollHistory(input){
	document.getElementById("rollHistory").innerHTML += ("<br>" + input);
}