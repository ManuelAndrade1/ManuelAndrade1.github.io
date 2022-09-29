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
				"000000050030000080875006002700004803084060000063829000300000200200400035040250670",
				"047039006130027000900010000000086005250040890001090023600100309000078000009000002",
				"009070800000520904560400000200630509091800020000009000050700068000000090073905200",
				"000008007000231004000000800730482500004093000520007000060005400005000072800720605",
				"000800020006307004004000005000080207508000600009500003042003060007060042085420070",
				],
				[			
				"000400750008000000000006400047050000000300280025000300092700000000009006050063007",
				"070001200105000000000200506007000940000024007300070000003000008209640000080090001",
				"000062000027300000305090000200003006900050080070980500040000602030000007000700050",
				"000000005520000060008300709004070050000034608000080017003020000200500940060900000",
				"078000406000000000050020003007950000030700060000800090000006005080300020403500087",
				],
			],
	solvedGrids: 
			[
				[
				"794268153283541976516379284671984325425637819938125467359816742142753698867492531",
				"415387962928516374763492185284169753396754218157823496831275649672948531549631827",
				"483921657967345821251876493548132976729564138136798245372689514814253769695417382",
				"924715863815369742367284159578621394431957628692843571159478236283596417746132985",
				"327695184815473629946128753651842397439756812278319546563284971784931265192567438",
				],
				[			
				"491782356632945187875136492729514863184367529563829714357691248216478935948253671",
				"547839216138627954962514738793286145256341897481795623674152389325978461819463572",
				"429173856318526974567498132284637519791854623635219487952741368146382795873965241",
				"413958267678231954952674813736482591184593726529167348267315489395846172841729635",
				"731845926256397814894612735463189257578234691129576483942753168317968542685421379",
				],
				[			
				"269438751438517962571926438347852619916374285825691374692785143783149526154263897",
				"678451239125369874934287516867135942591824367342976185453712698219648753786593421",
				"194862375827345169365197248258473916913256784476981523749518632531624897682739451",
				"379462185521798364648351729814679253752134698936285417493826571287513946165947832",
				"278139456349675812156428973867954231934712568512863794791286345685347129423591687",
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
		this.speed = 30; 
		this.tries = 0;
	}
	reset() {
		this.tries = 0;
		for(let i = 0; i < N; i++){
			for(let j = 0; j < N; j++){
				let defValue = parseInt(game[N * i + j]);
				this.puzzle[i][j].element.value = '';
				this.puzzle[i][j].element.classList.remove('solution');
				this.puzzle[i][j].element.removeAttribute('disabled');
				this.puzzle[i][j].value = 0;
				if(!(defValue === 0)) {
					this.puzzle[i][j].element.setAttribute('disabled','');
					this.puzzle[i][j].element.value = defValue;
					this.puzzle[i][j].value = defValue;
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
				setTimeout(() =>{resolve(this.solve())}, this.speed);
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
// Disabled mommentarily:
// Updating cellArray value without user pressing ENTER interferes
// with algorithm resolution of the grid.
// function validateInput(obj) {
// 	//Validates user input
// 	obj.value = (parseInt(obj.element.value)) ? parseInt(obj.element.value) : 0;
// }
function reload(diff, num){
	let loading = [parseInt(diff.value), parseInt(num.value)];
	game = GRIDS.load(...loading);
	solution = GRIDS.loadSolve(...loading);
	for(let i = 0; i < N; i++) {
		for(let j = 0; j < N; j++){
			let cell = cellArray[i][j];
			cell.element.removeAttribute('disabled');
			cell.element.classList.remove('solution','temp-solution');
			let loadedValue = parseInt(game[i * N + j]);
			solutionArray[i][j] = parseInt(solution[i * N + j]);
			cell.value = loadedValue;
			if (loadedValue) {
				cell.element.value = loadedValue;
				cell.element.setAttribute('disabled', '');
			}
			else cell.element.value = '';
		}
	}
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
let selectDiff = document.getElementsByName('difficulty')[0];
let selectPuzzle = document.getElementsByName('puzzles')[0];
let selectSpeed = document.getElementsByName('speed')[0];
let menuButton = document.getElementsByClassName('menu-button')[0];
let nav = document.querySelector('nav');
menuButton.addEventListener('click', () => {
	nav.style.visibility = (nav.style.visibility === 'hidden') ? 'visible' : 'hidden';
})
container.style.width = (width > height) ? height : width;
container.style.height = (width > height) ? height : width;
// Creates repeating measure for inner cell size (width x height)
let standardMeasure = (width > height) ? height / N : width / N;

// Formats string to create rows and cols
let fString = `repeat(${N}, ${standardMeasure}px)`;
container.style.gridTemplateColumns = fString;
container.style.gridTemplateRows = fString;

// Creates array of Cells
let loadingParams = [parseInt(selectDiff.value), parseInt(selectPuzzle.value)];
let game = GRIDS.load(...loadingParams);
let solution = GRIDS.loadSolve(...loadingParams);
selectDiff.addEventListener('change', () => reload(selectDiff, selectPuzzle));
selectPuzzle.addEventListener('change', () => reload(selectDiff, selectPuzzle));
selectSpeed.addEventListener('change', () => handler.speed = parseInt(selectSpeed.value));

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
		// temp.addEventListener('focusout', () => validateInput(newCell));
		temp.addEventListener('keydown', (event) => {
			let notValid = (event.key === "0" || event.key === "e" || event.key === "-" || event.key === ".");
			if (notValid) event.preventDefault();
			if (temp.value !== "" && parseInt(event.key)) temp.value = '';
		});
		temp.addEventListener('keyup', (event) => {
			if (!(event.key === 'Enter' || event.keyCode === 13)) return;
			if (newCell.element.value == handler.solvedPuzzle[newCell.row][newCell.col]){
				newCell.element.setAttribute('disabled', '');
				newCell.element.classList.add('solution');
			}
			else {
				newCell.value = 0;
				newCell.element.value = '';
			}

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



