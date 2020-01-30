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

const move = (currentPosition, key) => {
	const [direction, otherDirection] = findDirections(key, directions);
	return currentPosition === direction.bound
		? otherDirection.bound
		: currentPosition + direction.delta;
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
