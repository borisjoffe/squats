var DEBUG = 1;

function round(x) {
	const lowestPlate = 2.5;
	var roundTo = lowestPlate * 2;
	return Math.round(x / roundTo) * roundTo;
}

function warn() {
	debugger;
	console.warn(...arguments);
}
