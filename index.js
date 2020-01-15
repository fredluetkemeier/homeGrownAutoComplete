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
	const [start, end] = findSubstringRange(result, match);

	const before = result.substring(0, start);
	const highlighted = result.substring(start, end);
	const rest = result.substring(end);

	return `${before}<span class="${highlightClass}">${highlighted}</span>${rest}`;
}

function findSubstringRange(string, substring) {
	const start = string.toLowerCase().indexOf(substring.toLowerCase());
	const end = start + substring.length;

	return [start, end];
}

autoComplete.setup([objectEntries], { inputId: INPUT_ID, onKeyUp });
