import { searchTerms, extras } from './sources.json';
import autoComplete, { addMatchHighlighting } from './src/autoComplete';
import suggestionNavigation from './src/suggestionNavigation';

const HIGHLIGHT_CLASS = 'autoComplete-highlighted';
const INPUT_ID = 'input';
const resultsRef = document.getElementById('results');
const inputRef = document.getElementById(INPUT_ID);

let currentPosition;

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

	const searchTerm = event.target.value;
	if (searchTerm.length == 0) {
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
			' <span class="extra">EXTRA</span>';
		resultsRef.appendChild(item);
	});

	currentPosition = 0;
	suggestionNavigation.setup(resultsRef.childNodes.length);
};

const onKeyDown = event => {
	currentPosition = suggestionNavigation.move(currentPosition, event);

	console.log(currentPosition);
};

inputRef.addEventListener('input', onInput);
inputRef.addEventListener('keydown', onKeyDown);
