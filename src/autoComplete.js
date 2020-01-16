import lunr from 'lunr';

let searchIndexes = [];

const defaultOptions = {};

const setup = sources => {
	searchIndexes = buildIndexes(sources);

	//consolidateOptions(defaultOptions, options);
};

const search = inputText =>
	searchIndexes.map(index =>
		index.search(`*${inputText.trim()}*`).map(result => result.ref)
	);

function buildIndexes(sources) {
	return sources.map(source =>
		lunr(function() {
			this.ref('name');
			this.field('name');

			source.forEach(entry => {
				this.add(entry);
			}, this);
		})
	);
}

function consolidateOptions(defaultOptions, options) {
	const allOptions = {
		...defaultOptions,
		...options,
	};

	Object.keys(allOptions).forEach(key => {
		if (!allOptions[key]) {
			throw new Error(`${key} is a required option.`);
		}
	});

	return allOptions;
}

export const addMatchHighlighting = (result, match, highlightClass) => {
	const { before, substring, after } = extractSubstring(result, match);

	return `${before}<span class="${highlightClass}">${substring}</span>${after}`;
};

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

export default {
	setup,
	search,
};
