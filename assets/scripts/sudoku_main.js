class Cell {
	constructor(element, row, col) {
		this.element = element;
		this.row = row;
		this.col = col;
	}
}

function validateInput(obj) {
	let value = parseInt(obj.value);
	obj.value = (value > 0 && value <= 9) ? value : '';

}
const SIZE = 81; // Total number of cells in the grid
const N = 9; // Columns per row & vice-versa
let height = document.body.clientHeight * .75; // Gets 75% of client height
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

let standardMeasure = (width > height) ? height / N : width / N;
let fString = `repeat(${N}, ${standardMeasure}px)`;
container.style.gridTemplateColumns = fString;
container.style.gridTemplateRows = fString;

let cellArray = [];
for (let i = 0; i < N; i++) {
	for (let j = 0; j < N; j++) {
		let temp = document.createElement('input');
		temp.setAttribute('class', 'cell');
		temp.setAttribute('type', 'number');
		// temp.setAttribute('placeholder', '0');
		temp.setAttribute('max','9');
		temp.setAttribute('min', '1');
		temp.addEventListener('focusout', () => validateInput(temp));
		temp.addEventListener('keydown', (event) => {
			if (event.key === "0") event.preventDefault();
			if (temp.value !== "" && parseInt(event.key)) temp.value = '';
		});
		temp.style.height = standardMeasure;
		temp.style.width = standardMeasure;
		temp.style.fontSize = `${standardMeasure * .75}px`;
		container.appendChild(temp);
		cellArray.push(new Cell(temp, i, j));
	}
} 

if (!(window.matchMedia("only screen and min-width(400px)").matches))
{
	window.onresize = () => {
		height = document.body.clientHeight * .75;
		width = document.body.clientWidth;
		standardMeasure = (width > height) ? height / N : width / N;
		fString = `repeat(${N}, ${standardMeasure}px)`;
		container.style.gridTemplateColumns = fString;
		container.style.gridTemplateRows = fString;
		container.style.width = (width > height) ? height : width;
		container.style.height = (width > height) ? height : width;
		for(let i = 0; i < SIZE; i++) {
			cellArray[i].element.style.height = standardMeasure;
			cellArray[i].element.style.width = standardMeasure;
			cellArray[i].element.style.fontSize = `${standardMeasure * .75}px`;
		};
	};
}