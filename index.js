import { searchTerms, extras } from './sources.json';
import autoComplete, { addMatchHighlighting } from './src/autoComplete';
import listNavigation from './src/listNavigation';

const INPUT_ID = 'input';
const inputRef = document.getElementById(INPUT_ID);
let searchTerm = '';

const resultsRef = document.getElementById('results');
const DECORATOR_TEXT = 'EXTRA';
const HIGHLIGHT_CLASS = 'autoComplete-highlighted';

let currentPosition;
const SELECTED_CLASS = 'autoComplete-selected';

const keyAliases = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	Up: 'up',
	Down: 'down',
};

autoComplete.setup({
	sources: [
		{
			data: searchTerms.map(entry => ({ name: entry })),
			limit: 10,
		},
		{
			data: extras.map(entry => ({ name: entry })),
			limit: 5,
		},
	],
	mode: 'loose',
});

const onInput = event => {
	resultsRef.innerHTML = '';

	searchTerm = event.target.value;
	if (searchTerm.trim().length == 0) {
		return;
	}

	const [searchTerms, extras] = autoComplete.search(searchTerm);

	searchTerms.forEach(result => {
		const item = document.createElement('li');
		item.innerHTML = addMatchHighlighting(result, searchTerm, HIGHLIGHT_CLASS);

		resultsRef.appendChild(item);
	});

	extras.forEach(result => {
		const item = document.createElement('li');
		item.innerHTML =
			addMatchHighlighting(result, searchTerm, HIGHLIGHT_CLASS) +
			` <span class="extra">${DECORATOR_TEXT}</span>`;
		resultsRef.appendChild(item);
	});

	currentPosition = 0;
	listNavigation.setup(resultsRef.childNodes.length);
};

const onKeyDown = event => {
	const translatedKey = keyAliases[event.key];

	if (!translatedKey) {
		return;
	}
	event.preventDefault();

	currentPosition = listNavigation.move(currentPosition, translatedKey);

	resultsRef.childNodes.forEach(node => node.classList.remove(SELECTED_CLASS));

	const currentResult = resultsRef.childNodes[currentPosition - 1];

	currentResult && currentResult.classList.add(SELECTED_CLASS);
	inputRef.value = currentResult
		? currentResult.textContent.replace(DECORATOR_TEXT, '').trim()
		: searchTerm;
};

inputRef.addEventListener('input', onInput);
inputRef.addEventListener('keydown', onKeyDown);
