import entries from './entries.json';
import autoComplete, { addMatchHighlighting } from './src/autoComplete';

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

autoComplete.setup([objectEntries], { inputId: INPUT_ID, onKeyUp });
