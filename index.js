import entries from './entries.json';
import autoComplete from './src/autoComplete';

const inputId = 'input';
const resultsRef = document.getElementById('results');

const objectEntries = entries.map(entry => ({ name: entry }));

const onKeyUp = event => {
	resultsRef.innerHTML = '';

	const searchTerm = event.target.value;

	const [results] =
		searchTerm.length > 0 ? autoComplete.search(searchTerm) : [];

	results.forEach(result => {
		const [beginning, end] = result.split(searchTerm);

		const item = document.createElement('li');
		item.innerHTML = `${beginning}<span class="autoComplete-highlighted">${searchTerm}</span>${end}`;

		resultsRef.appendChild(item);
	});
};

autoComplete.setup([objectEntries], { inputId, onKeyUp });
