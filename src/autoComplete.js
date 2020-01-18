import lunr from 'lunr';

let searchIndexes = [];

const defaultOptions = {
	sources: {
		data: [],
		limit: null,
	},
};

const setup = options => {
	const { sources } = consolidateOptions(defaultOptions, options);

	searchIndexes = buildIndexes(sources);
};

const search = inputText =>
	searchIndexes.map(({ index, limit }) => {
		const results = index
			.search(`*${inputText.trim()}*`)
			.sort((a, b) => b.score - a.score)
			.map(result => result.ref);

		return limit ? results.slice(0, limit) : results;
	});

function consolidateOptions(defaultOptions, options) {
	Object.keys(defaultOptions).forEach(key => {
		if (!options[key]) {
			throw new Error(`${key} is a required option.`);
		}
	});

	const allOptions = {
		...defaultOptions,
		...options,
	};

	return allOptions;
}

function buildIndexes(sources) {
	return sources.map(({ data, limit }) => ({
		index: lunr(function() {
			this.ref('name');
			this.field('name');

			data.forEach(entry => {
				this.add(entry);
			}, this);
		}),
		limit,
	}));
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
