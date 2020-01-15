import entries from './entries.json';
import autoComplete from './src/autoComplete';

const INPUT_ID = 'input';
const resultsRef = document.getElementById('results');

const objectEntries = entries.map(entry => ({ name: entry }));

const HIGHLIGHT_CLASS = 'autoComplete-highlighted';

const onKeyUp = event => {
	resultsRef.innerHTML = '';

	const searchTerm = event.target.value;

	const [results] =
		searchTerm.length > 0 ? autoComplete.search(searchTerm) : [[]];

	results.forEach(result => {
		const item = document.createElement('li');
		item.innerHTML = addMatchHighlighting(result, searchTerm, HIGHLIGHT_CLASS);

		resultsRef.appendChild(item);
	});
};

function addMatchHighlighting(result, match, highlightClass) {
	const { before, substring, after } = extractSubstring(result, match);

	return `${before}<span class="${highlightClass}">${substring}</span>${after}`;
}

function extractSubstring(string, substring) {
	const [start, end] = findMatchRange(string, substring);

	return {
		before: string.substring(0, start),
		substring: string.substring(start, end),
		after: string.substring(end),
	};
}

function findMatchRange(string, substring) {
	const start = string.toLowerCase().indexOf(substring.toLowerCase());
	const end = start + substring.length;

	return [start, end];
}

autoComplete.setup([objectEntries], { inputId: INPUT_ID, onKeyUp });
