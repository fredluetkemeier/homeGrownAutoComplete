import lunr from 'lunr';

const initialOptions = {
	required: {
		sources: [
			{
				data: null,
			},
		],
	},
	optional: {
		sources: [
			{
				limit: null,
			},
		],
		mode: 'loose',
	},
};

let setOptions = {};
let searchIndexes = [];

const setup = options => {
	const { required } = initialOptions;

	validateOptions(required, options);
	setOptions = consolidateOptions(initialOptions, options);
	const { sources } = setOptions;

	searchIndexes = buildIndexes(sources);
};

function validateOptions(required, given) {
	Object.keys(required).forEach(key => {
		if (!given[key]) {
			throw new Error(
				`${key} is a required option.\n\nThe required options are:\n\n${JSON.stringify(
					required,
					null,
					4
				)}`
			);
		}
	});
}

function consolidateOptions({ required, optional }, given) {
	return {
		...required,
		...optional,
		...given,
	};
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

const search = searchTerm =>
	searchIndexes.map(({ index, limit }) => {
		const results = index
			.search(applySearchMode(setOptions.mode, searchTerm))
			.sort((a, b) => b.score - a.score)
			.map(result => result.ref);

		return limit ? results.slice(0, limit) : results;
	});

function applySearchMode(mode, searchText) {
	const lookBehind = mode === 'loose' ? '*' : '';
	const lookAhead = mode === 'strict' || 'loose' ? '*' : '';

	return `${lookBehind}${searchText.trim()}${lookAhead}`;
}

export const addMatchHighlighting = (result, match, highlightClass) => {
	const { before, substring, after } = extractSubstring(result, match.trim());

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
