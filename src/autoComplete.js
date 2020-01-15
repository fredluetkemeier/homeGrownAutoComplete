import lunr from 'lunr';

let searchIndexes = [];

const defaultOptions = {
	inputId: null,
	onKeyUp: null,
};

const setup = (sources, options) => {
	searchIndexes = buildIndexes(sources);

	const { inputId, onKeyUp } = consolidateOptions(options);

	document.getElementById(inputId).addEventListener('keyup', onKeyUp);
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

function consolidateOptions(options) {
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

export default {
	setup,
	search,
};
