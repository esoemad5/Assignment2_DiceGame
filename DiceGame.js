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

function makeGameBoard(){
	let output = "";
	let chanceForPowerUpBlock = 15; // 1 in 20 chance to 
	for(let i = 0; i < 100; i++){// Column height: 100
		output += "<tr>";
		for(let j = 0; j < 21; j++){// Row length: 21
			let rand = roll_dX(chanceForPowerUpBlock);
			if(i == 0 && j == 10){
				output += "<td>@</td>";
			}
			else{
			if(rand == 1 && j != 10){ // if the random number is 1 (so 1 in x chance) make a power up block
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
//	board = withoutString(board, "<tbody>");
//	board = withoutString(board, "</tbody>");
	board = withoutString(board, "<tr>");
	board = withoutString(board, "</tr>");
	board = withoutString(board, "<td>");
	//board = withoutString(board, "</td>");
	test(board);
}
function withoutString(base, remove){
	let output = "";
	for(let i = 0; i < base.length; i++){
		if(base[i] == remove[0]){
			if(!checkRestOfRemoveString(base, remove, i)){
				output += base[i];
			}
			else{// If remove string is found, don't add it to the output string and move i forward.
				i += remove.length;
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