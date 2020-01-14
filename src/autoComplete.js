import lunr from 'lunr';

let indexes = [];
const defaultOptions = {
	inputId: null,
	onKeyUp: null
};

const tokenMatch = function(builder) {
	const pipelineFunction = function(token) {
		token.metadata['match'] = token.toString();
		return token;
	};

	lunr.Pipeline.registerFunction(pipelineFunction, 'tokenMatch');
	builder.pipeline.after(lunr.stemmer, pipelineFunction);
	builder.metadataWhitelist.push('match');
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

			this.use(tokenMatch);

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
