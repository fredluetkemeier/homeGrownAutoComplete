import { searchTerms, extras } from './sources.json';
import autoComplete, { addMatchHighlighting } from './src/autoComplete';
import suggestionNavigation from './src/suggestionNavigation';

const HIGHLIGHT_CLASS = 'autoComplete-highlighted';
const INPUT_ID = 'input';
const resultsRef = document.getElementById('results');

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
});

const navigation = new suggestionNavigation({
	listRef: resultsRef,
	inputId: INPUT_ID,
	trimText: '',
	highlightClassName: 'autoComplete-selected',
});

const onInput = event => {
	resultsRef.innerHTML = '';

	const searchTerm = event.target.value;

	const [searchTerms, extras] =
		searchTerm.length > 0 ? autoComplete.search(searchTerm) : [[]];

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

	navigation.handleInput(event);
};

document.getElementById(INPUT_ID).addEventListener('input', onInput);
