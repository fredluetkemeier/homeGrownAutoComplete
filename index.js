import entries from './entries.json';
import autoComplete from './src/autoComplete';

const inputRef = document.getElementById('input');
const resultsRef = document.getElementById('results');

const objectEntries = entries.map(entry => ({ name: entry }));

autoComplete.setup([objectEntries], inputRef, event => {
	resultsRef.innerHTML = '';

	const searchTerm = event.target.value.trim();
	const [results] =
		searchTerm.length > 0 ? autoComplete.search(searchTerm) : [];
	results.forEach(({ ref }) => {
		const item = document.createElement('li');
		item.textContent = ref;
		resultsRef.appendChild(item);
	});
});
