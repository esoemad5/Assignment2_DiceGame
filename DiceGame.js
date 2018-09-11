function bestRollDice(){
	return 4; // chosen by fair dice roll. guaranteed to be random.
}

function gameAdvance(){
	
}

function roll_dX(dX){// roll a die with x sides
	let max = dX;
	let output = Math.floor((Math.random()*max) + 1);
	return output;
}

function makeGameBoard(){
	console.log("here");
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
	document.getElementById("gameBoard").innerHTML = output;
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