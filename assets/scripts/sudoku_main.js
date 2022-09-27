const GRIDS = {
	loadedGrids:
			[
				[
				"000208053080001970006300000601000320000007009930100000350810742002750000867490031",
				"000080962008510000060090100084169703300700210007020400001275640072900001540600800",
				"003020600900305001001806400008102900700000008006708200002609500800203009005010300",
				"024000000805060000300000159070020300001907600002040070159000006000090407000000980",
				"020005000015000000000008703051000000009700010000300046000080001700930060000000408",
				],
				[			
				"",
				"",
				"",
				"",
				"",
				],
				[			
				"",
				"",
				"",
				"",
				"",
				],
			],
	load: function(diff, num){return this.loadedGrids[diff][num]},
}
class Cell {
	constructor(element, row, col, value=0) {
		this.element = element;
		this.row = row;
		this.col = col;
		this.value = value;
	}
}

function validateInput(obj) {
	//Validates user input
	obj.value = (parseInt(obj.element.value)) ? parseInt(obj.element.value) : 0;
}
const SIZE = 81; // Total number of cells in the grid
const N = 9; // Amount of rows & cols
const H = .75; // Window height percentage to use
let height = document.body.clientHeight * H; // Gets 75% of client height
let width = document.body.clientWidth; // Gets the same amount of width as height

/*
The following comprehensive conditional assignments are made to allow responsiveness
in different screen sizes. If the width is larger than the height, then the standardMeasure
and subsequent calculations will be made considering height / N. If, however, the height is
larger than the width (case of mobile phones for instance), the standardMeasure and subsequent calculations
will be made considering width / N.
*/

let container = document.getElementsByClassName('container')[0];
container.style.width = (width > height) ? height : width;
container.style.height = (width > height) ? height : width;
// Creates repeating measure for inner cell size (width x height)
let standardMeasure = (width > height) ? height / N : width / N;

// Formats string to create rows and cols
let fString = `repeat(${N}, ${standardMeasure}px)`;
container.style.gridTemplateColumns = fString;
container.style.gridTemplateRows = fString;

// Creates array of Cells
let game = GRIDS.load(0, 4);
let cellArray = [];
for (let i = 0; i < N; i++) {
	let subArray = [];
	for (let j = 0; j < N; j++) {
		let temp = document.createElement('input');

		// Loads the Sudoku puzzle onto the screen
		let loadedValue = parseInt(game[i * N + j]);
		if (loadedValue) {
			temp.setAttribute('disabled', '');
			temp.value = loadedValue;
		}
		let newCell = new Cell(temp, i, j, loadedValue);
		// Sets common attrs and event listeners for cells
		temp.setAttribute('class', 'cell');
		temp.setAttribute('type', 'number');
		temp.setAttribute('max','9');
		temp.setAttribute('min', '1');
		temp.addEventListener('focusout', () => validateInput(newCell));
		temp.addEventListener('keydown', (event) => {
			if (event.key === "0" || event.key === "e" || event.key === "-") event.preventDefault();
			if (temp.value !== "" && parseInt(event.key)) temp.value = '';
		});
		temp.style.height = standardMeasure;
		temp.style.width = standardMeasure;
		temp.style.fontSize = `${standardMeasure * H}px`;
		container.appendChild(temp);
		subArray.push(newCell);
	}
	cellArray.push(subArray);
}
// Load grid
window.onresize = () => {
	height = document.body.clientHeight * H;
	width = document.body.clientWidth;
	standardMeasure = (width > height) ? height / N : width / N;
	fString = `repeat(${N}, ${standardMeasure}px)`;
	container.style.gridTemplateColumns = fString;
	container.style.gridTemplateRows = fString;
	container.style.width = (width > height) ? height : width;
	container.style.height = (width > height) ? height : width;
	for(let i = 0; i < N; i++) 
	{
		for (let j = 0; j < N; j ++)
		{
			cellArray[i][j].element.style.height = standardMeasure;
			cellArray[i][j].element.style.width = standardMeasure;
			cellArray[i][j].element.style.fontSize = `${standardMeasure * H}px`;
		};
	};
};