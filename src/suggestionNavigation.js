const keyAliases = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	Up: 'up',
	Down: 'down',
};

const directions = {
	up: {
		bound: 0,
		delta: -1,
	},
	down: {
		bound: null,
		delta: 1,
	},
};

const setup = listLength => {
	directions.down.bound = listLength;
};

const move = (currentPosition, event) => {
	const translatedKey = keyAliases[event.key];

	if (!translatedKey) {
		return currentPosition;
	}
	event.preventDefault();

	const [theWay, theOtherWay] = findDirections(translatedKey, directions);
	return currentPosition === theWay.bound
		? theOtherWay.bound
		: currentPosition + theWay.delta;
};

function findDirections(key, directions) {
	return Object.keys(directions)
		.map(direction => direction)
		.sort(a => {
			if (a === key) return -1;
		})
		.map(direction => directions[direction]);
}

export default {
	setup,
	move,
};
