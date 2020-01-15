const defaultOptions = {
	listRef: null,
	inputId: null,
	trimText: '',
	highlightClassName: '',
};

export default function suggestionNavigation(options) {
	const { listRef, trimText, highlightClassName } = consolidateOptions(
		defaultOptions,
		options
	);

	const inputRef = document.getElementById(inputId);

	let lastInput = '';

	let firstIndex = 0;
	let lastIndex = listRef.childNodes.length - 1;
	const inputIndex = -1;

	let currentIndex = inputIndex;

	this.handleInput = event => {
		lastInput = event.target.value;
	};

	inputRef.addEventListener('keydown', event => {
		navigate(event);
	});

	const keys = {
		ArrowUp: 'MoveUp',
		Up: 'MoveUp',
		ArrowDown: 'MoveDown',
		Down: 'MoveDown',
	};

	const keyActions = {
		MoveUp: () => {
			move({ delta: -1 });
			updateInputValue();
		},
		MoveDown: () => {
			move({ delta: 1 });
			updateInputValue();
		},
	};

	const navigate = event => {
		if (listRef.childNodes.length == 0) {
			reset();
		}

		const action = keys[event.key];
		if (action) {
			event.preventDefault();

			lastIndex = listRef.childNodes.length - 1;
			keyActions[action]();

			setActiveDescendant();

			return;
		}

		reset();
	};

	const move = ({ delta }) => {
		const { initialBound, resetBound } =
			delta === 1
				? { initialBound: firstIndex, resetBound: lastIndex }
				: { initialBound: lastIndex, resetBound: firstIndex };

		switch (currentIndex) {
			case inputIndex:
				currentIndex = initialBound;
				addHighlight(listRef.childNodes[currentIndex]);
				break;
			case resetBound:
				reset();
				break;
			default:
				removeHighlight(listRef.childNodes[currentIndex]);
				currentIndex += delta;
				addHighlight(listRef.childNodes[currentIndex]);
		}
	};

	const updateInputValue = () => {
		inputRef.value =
			currentIndex === inputIndex
				? lastInput
				: listRef.childNodes[currentIndex].innerText.replace(trimText, '');
	};

	const setActiveDescendant = () => {
		inputRef.setAttribute(
			'aria-activedescendant',
			currentIndex == inputIndex
				? ''
				: listRef.childNodes[currentIndex].id || ''
		);
	};

	const addHighlight = node => {
		highlightClassName && node.classList.add(highlightClassName);
		node.setAttribute('aria-selected', 'true');
		node.setAttribute('id', 'selected');
	};

	const removeHighlight = node => {
		highlightClassName && node.classList.remove(highlightClassName);
		node.setAttribute('aria-selected', 'false');
		node.removeAttribute('id');
	};

	const reset = () => {
		if (currentIndex === inputIndex) {
			return;
		}

		removeHighlight(listRef.childNodes[currentIndex]);
		currentIndex = -1;
	};
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
