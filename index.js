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
		item.innerHTML = addMatchHighlighting(searchTerm, result, HIGHLIGHT_CLASS);

		resultsRef.appendChild(item);
	});
};

autoComplete.setup([objectEntries], { inputId: INPUT_ID, onKeyUp });

function addMatchHighlighting(searchTerm, result, highlightClass) {
	const matchStart = result.toLowerCase().indexOf(searchTerm.toLowerCase());
	const matchEnd = matchStart + searchTerm.length;

	const highlighted = result.substring(matchStart, matchEnd);
	const rest = result.substring(matchEnd);

	return `<span class="${highlightClass}">${highlighted}</span>${rest}`;
}
