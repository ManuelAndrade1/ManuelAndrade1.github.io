// Iphone visual impediment
// Numbers look cut
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
				"483921657967345821251876493548132976729564138136798245372689514814253769695417382",
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
	solvedGrids: 
			[
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
				[			
				"",
				"",
				"",
				"",
				"",
				],
			],
	load: function(diff, num){return this.loadedGrids[diff][num]},
	loadSolve: function (diff, num) {return this.solvedGrids[diff][num]},
};
const HELPER = {
	findGroup: function(cord) {
		let group1 = [0, 1 , 2];
		let group2 = [3, 4, 5];
		let group3 = [6, 7, 8];
		if (group1.includes(cord)) return group1;
		else if (group2.includes(cord)) return group2;
		else return group3;
	},
	numsTaken: function(puzzle, row, col, groupRow, groupCol){
		let nums = new Set();
		for(let i = 0; i < N; i++) {
			nums.add(puzzle[i][col].value);
			nums.add(puzzle[row][i].value);
		}
		for(i of groupRow) {
			for(j of groupCol) {
				nums.add(puzzle[i][j].value);
				if (i === row && j === col)
					nums.delete(puzzle[i][j].value);
			}
		}
		nums.delete(0);
		return nums;
	},
	numsAvailable: function(unavailable) {
		let available = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		for (n of unavailable) {
			available.delete(n);
		}
		return available;
	},
	cellValidation: function(cell, unavailable){
		return (unavailable.has(cell.value)) ? false : true;
	},
	puzzleSolved: function(puzzle) {
		for(let i = 0; i < N; i++){
			for(let j = 0; j < N; j++) {
				let cell = puzzle[i][j];
				if (cell.value === 0) return false;
				let valid = HELPER.cellValidation(cell, 
					HELPER.numsTaken(puzzle, i, j,
					 HELPER.findGroup(i), HELPER.findGroup(j)));
				if (valid) continue;
				else return false;
			}
		}
		return true;
	},
	getCell: function(puzzle) {
		// Returns most suitable empty cell
		let empty = [];
		let emptyNumsTaken = [];
		for(let i = 0; i < N; i++){
			for(let j=0; j < N; j++) {
				if (puzzle[i][j].value === 0){
					let knownNums = HELPER.numsTaken(puzzle, i, j,
						HELPER.findGroup(i), HELPER.findGroup(j));
					empty.push(puzzle[i][j]);
					emptyNumsTaken.push(knownNums.size);
				}
			}
		}
		let transform = [...emptyNumsTaken];
		let max = Math.max(...transform);
		let index = transform.indexOf(max);
		return empty[index];
	},
	createEmpty: function() {
		let arr = [];
		for(let i = 0; i < N; i++) {
			let subArr = [];
			for(let j = 0; j < N; j++) {
				subArr.push(0);
			}
			arr.push(subArr);
		}
	return arr;
	}
}
class AI {
	constructor(puzzle, solvedPuzzle) {
		this.puzzle = puzzle;
		this.solvedPuzzle = solvedPuzzle;
		this.tries = 0;
	}
	reset() {
		this.tries = 0;
		for(let i = 0; i < N; i++){
			for(let j = 0; j < N; j++){
				let list = [...this.puzzle[i][j].element.classList];
				if(list.includes('solution')){
					this.puzzle[i][j].element.value = '';
					this.puzzle[i][j].element.classList.remove('solution');
					this.puzzle[i][j].element.removeAttribute('disabled');
					this.puzzle[i][j].value = 0;
				}
			}
		}		
	}
	async solve() {
		this.tries++;
		// Recursive Function
		if (HELPER.puzzleSolved(this.puzzle)) {
			return true;
		}
		let cell = HELPER.getCell(this.puzzle);
		let available = HELPER.numsAvailable(HELPER.numsTaken(
						this.puzzle, cell.row, cell.col,
						HELPER.findGroup(cell.row), HELPER.findGroup(cell.col)));
		for(let a of available) {
			cell.value = a;
			cell.element.value = a;
			cell.element.classList.add('temp-solution');
			/*
			The following code is based on the example here
			https://thewebdev.info/2022/05/15/how-to-get-return-value-from-settimeout-with-javascript/ 
			*/
			let promise = new Promise((resolve, reject) => {
				setTimeout(() =>{resolve(this.solve())}, 20);
			});
			let results = await(promise);
			if (results) {
				cell.element.classList.remove('temp-solution');
				cell.element.classList.add('solution');
				return true;
			}
			else {
				cell.value = 0;
				cell.element.value = '';
				cell.element.classList.remove('temp-solution');
				continue;
			}
		}
		return false;
	}
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
	obj.value = (parseInt(obj.element.value)) ? parseInt(obj.element.value) : '';
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
let solution = GRIDS.loadSolve(0, 4);
let solutionArray = [];
let cellArray = [];
let handler = new AI(cellArray, solutionArray);
for (let i = 0; i < N; i++) {
	let subArray = [];
	let subSol = [];
	for (let j = 0; j < N; j++) {
		let temp = document.createElement('input');
		let solValue = parseInt(solution[i * N + j]);
		subSol.push(solValue);
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
			let notValid = (event.key === "0" || event.key === "e" || event.key === "-" || event.key === ".");
			if (notValid) event.preventDefault();
			if (temp.value !== "" && parseInt(event.key)) temp.value = '';
		});
		temp.addEventListener('keyup', (event) => {
			if (!(event.key === 'Enter' || event.keyCode === 13)) return;
		});
		temp.style.height = standardMeasure;
		temp.style.width = standardMeasure;
		temp.style.fontSize = `${standardMeasure * H}px`;
		container.appendChild(temp);
		subArray.push(newCell);
	}
	cellArray.push(subArray);
	solutionArray.push(subSol);
}
// Load grid

let start = document.body.getElementsByClassName('start')[0];
start.addEventListener('click', () => {
	handler.solve()
	for(let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			cellArray[i][j].element.setAttribute('disabled', '');
		}
	}
});
let reset = document.body.getElementsByClassName('reset')[0];
reset.addEventListener('click', () => handler.reset());
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



