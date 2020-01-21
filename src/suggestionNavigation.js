let nodeList = [];
let input;

const directions = {
	up: {
		bound: 0,
		delta: 1,
	},
	down: {
		bound: 0,
		delta: -1,
	},
};

const setup = (inputRef, childrenRef) => {
	nodeList = [inputRef, ...childrenRef];
	input = inputRef;

	directions.down.bound = nodeList.length - 1;
};

const move = direction => {
	if (!isValidDirection(direction, directions)) {
		return;
	}
};

function isValidDirection(direction, directions) {
	return Object.keys(directions).some(key =>
		direction.toLowerCase().includes(key)
	);
}

export default {
	setup,
	move,
};
