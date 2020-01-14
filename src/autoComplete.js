import lunr from 'lunr';

let indexes = [];
const defaultOptions = {
	inputId: null,
	onKeyUp: null
};

const setup = (sources, options) => {
	indexes = buildIndexes(sources);

	const { inputId, onKeyUp } = validateOptions(options);

	document.getElementById(inputId).addEventListener('keyup', onKeyUp);
};

const search = inputText =>
	indexes.map(index =>
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

function validateOptions(options) {
	const allOptions = {
		...defaultOptions,
		...options
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
	search
};
