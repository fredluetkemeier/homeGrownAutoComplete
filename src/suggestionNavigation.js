export default function SuggestionNavigation(config) {
    const { list, input, trimText = '', highlightClassName } = config;

    let lastInput = '';

    let firstIndex = 0;
    let lastIndex = list.childNodes.length - 1;
    const inputIndex = -1;

    let currentIndex = inputIndex;

    this.handleInput = (event) => { lastInput = event.target.value };

    input.addEventListener('keydown', (event) => {
        navigate(event);
    });

    const keys = {
        'ArrowUp': 'MoveUp',
        'Up': 'MoveUp',
        'ArrowDown': 'MoveDown',
        'Down': 'MoveDown',
    };

    const keyActions = {
        'MoveUp': () => {
            move({ delta: -1 });
            updateInputValue();
        },
        'MoveDown': () => {
            move({ delta: 1 });
            updateInputValue();
        }
    };

    const navigate = (event) => {
        if (list.childNodes.length == 0) {
            reset();
        }

        const action = keys[event.key];
        if (action) {
            event.preventDefault();

            lastIndex = list.childNodes.length - 1;
            keyActions[action]();

            setActiveDescendant();

            return;
        }

        reset();
    }

    const move = ({ delta }) => {
        const { initialBound, resetBound } = delta === 1
            ? { initialBound: firstIndex, resetBound: lastIndex }
            : { initialBound: lastIndex, resetBound: firstIndex };

        switch (currentIndex) {
            case inputIndex:
                currentIndex = initialBound;
                addHighlight(list.childNodes[currentIndex]);
                break;
            case resetBound:
                reset();
                break;
            default:
                removeHighlight(list.childNodes[currentIndex]);
                currentIndex += delta;
                addHighlight(list.childNodes[currentIndex]);
        }
    };

    const updateInputValue = () => {
        input.value = currentIndex === inputIndex
            ? lastInput
            : list.childNodes[currentIndex].innerText.replace(trimText, '');
    };

    const setActiveDescendant = () => {
        input.setAttribute(
            'aria-activedescendant',
            currentIndex == inputIndex
                ? ''
                : list.childNodes[currentIndex].id
        );
    };

    const addHighlight = (node) => {
        highlightClassName && node.classList.add(highlightClassName);
        node.setAttribute('aria-selected', 'true');
        node.setAttribute('id', 'selected');
    };

    const removeHighlight = (node) => {
        highlightClassName && node.classList.remove(highlightClassName);
        node.setAttribute('aria-selected', 'false');
        node.removeAttribute('id');
    };

    const reset = () => {
        if (currentIndex === inputIndex) {
            return;
        }

        removeHighlight(list.childNodes[currentIndex]);
        currentIndex = -1;
    };
};