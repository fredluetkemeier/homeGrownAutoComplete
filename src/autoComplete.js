import lunr from 'lunr';

let indexes = [];

const setup = sources => {
	indexes = sources.map(source => {
		return lunr(function() {
			this.ref('name');
			this.field('name');

			source.forEach(entry => {
				this.add(entry);
			}, this);
		});
	});
};

const search = inputText =>
	indexes.map(index => index.search(`*${inputText}*`));

export default {
	setup,
	search
};
