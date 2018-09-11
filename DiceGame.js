function d6Button(){
	console.log("here");
	let roll = rollDice();
	console.log(roll);
	changeOutputArea("You Rolled: ");
	appendOutputArea(roll);
	appendRollHistory(roll);
	
}



function rollDice(){
	let min = 1;
	let max = 7; // number will be < max
	let output = Math.floor(Math.random()*(max - min) + min);
	console.log("rollDice rolled:", output);
	return output;
}
function roll_dX(dX){// roll a die with x sides
	let min = 1;
	let max = dX;
	let output = Math.floor(Math.random()*(max - min) + min);
	return output;
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