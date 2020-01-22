const keyAliases = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	Up: 'up',
	Down: 'down',
};

const bounds = {
	up: -1,
	down: null,
};

const deltas = {
	up: -1,
	down: 1,
};

const setup = listLength => {
	bounds.down = listLength;
};

const move = (currentPosition, direction) => {
	const translatedDirection = keyAliases[direction];

	if (!translatedDirection) {
		return;
	}

	const [] = findOrientation(translatedDirection);

	//const { bound, delta } = ;
	//const nextPosition = currentPosition + delta == bound ? ;
};

function findOrientation(direction) {}

function findSelectedDirection(directions, direction) {
	const selectedDirection = directions.filter(value => value[direction]);
	const otherDirection = directions.filter(value => !value[direction]);

	return [selectedDirection, otherDirection];
}

export default {
	setup,
	move,
};
