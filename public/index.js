let rows = 1;
let cols = 10;
let squareSize = 50;

let gameBoardContainer = document.getElementById("gameboard");

for (j = 0; j < rows; j++) {
	for (i = 0; i < cols; i++) {
		let square = document.createElement("div");
		gameBoardContainer.appendChild(square);
		square.id = 's' + j + i;
		let topPosition = j * squareSize;
		let leftPosition = i * squareSize;
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';
	}
}
let hitCount = 0;

let gameBoard = [
	[0, 2, 2, 0, 1, 0, 0, 0, 1, 0]
]

gameBoardContainer.addEventListener("click", fireTorpedo, false);

function fireTorpedo(e) {
	if (e.target !== e.currentTarget) {
		let row = e.target.id.substring(1, 2);
		let col = e.target.id.substring(2, 3);
		// console.log("Y - " + row + ", X - " + col);


		if (gameBoard[row][col] == 1) {
			e.target.style.background = 'red';
			hitCount++;
			console.log(hitCount);
			gameBoard[row][col] = 4;
			if (gameBoard[row][col - 1] >= 0) {
				gameBoard[row][col - 1] = 5;
				e.target.previousElementSibling.style.background = '#bbb';
			}
			if (gameBoard[row][Number(col) + 1] < gameBoard[0].length) {
				gameBoard[row][Number(col) + 1] = 5;
				e.target.nextElementSibling.style.background = '#bbb';
			}
			console.log("Убит однопалубный");


			isDead();
			return 1;

		} else if (gameBoard[row][col] == 2) {
			e.target.style.background = 'red';
			hitCount++;
			console.log(hitCount);
			gameBoard[row][col] = 3;
			if (gameBoard[row][col - 1] >= 0) {
				if (gameBoard[row][col - 1] === 2) {
					console.log("Ранил");
					return 0;
				} else if (gameBoard[row][col - 1] === 3) {
					console.log("Убит");
					e.target.nextElementSibling.style.background = '#bbb';
					const previous = e.target.previousElementSibling;
					previous.previousElementSibling.style.background = '#bbb';
					gameBoard[row][col] = 4;
					gameBoard[row][col - 1] = 4;
					if (gameBoard[row][col - 2] >= 0) {
						gameBoard[row][col - 2] = 5;
					}
					if (gameBoard[row][Number(col) + 1] < gameBoard[0].length) {
						gameBoard[row][Number(col) + 1] = 5;
					}
					isDead();
					return 1;
				}
			}


			if (gameBoard[row][Number(col) + 1] >= 0) {
				if (gameBoard[row][Number(col) + 1] === 2) {
					console.log("Ранил");
					return 0;
				} else if (gameBoard[row][Number(col) + 1] === 3) {
					console.log("Убит");
					e.target.previousElementSibling.style.background = '#bbb';

					const next = e.target.nextElementSibling;
					next.nextElementSibling.style.background = '#bbb';


					gameBoard[row][col] = 4;
					gameBoard[row][Number(col) + 1] = 4;
					if (gameBoard[row][Number(col) + 2] < gameBoard[0].length) {
						gameBoard[row][Number(col) + 2] = 5;
					}
					if (gameBoard[row][col - 1] >= 0) {
						gameBoard[row][col - 1] = 5;
					}
					isDead();
					return 1;
				}
			}


		} else if (gameBoard[row][col] == 0) {

			e.target.style.background = '#bbb';
			gameBoard[row][col] = 4;
			console.log("Мимо");
			return -1;

		} else {
			alert("Уже стрелял");
		}
	}
	e.stopPropagation();
}

function isDead() {
	if (hitCount === 4) {
		alert("Все корабли убиты!");

	}
}


const save = document.getElementById('saveGame');
save.addEventListener('click', function (e) {
	console.log('Saving...');

	fetch('/game', {
			method: 'post',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				board: gameBoard,
				hitCount: hitCount
			})
		})
		.then(function (response) {
			if (response.ok) {
				console.log('Game was saved');
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function (error) {
			console.log(error);
		});
});



const load = document.getElementById('loadGame');
load.addEventListener('click', function (e) {
	console.log('Loading...');
	fetch('/game', {
			method: 'GET'
		})
		.then(function (response) {
			if (response.ok) return response.json();
			throw new Error('Request failed.');
		})
		.then(function (boardResponse) {

			let board = boardResponse.board;
			let hits = boardResponse.hitCount;

			if (board === undefined || hits === undefined) {
				console.log("database is empty. no boards were saved");
				return;
			}

			gameBoard[0] = board;
		})
		.catch(function (error) {
			console.log(error);
		});
});


const del = document.getElementById('delNewGame');
del.addEventListener('click', function (e) {
	console.log('Delete...');

	fetch('/game', {
			method: 'delete',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(gameBoard)
		})
		.then(function (response) {
			if (response.ok) {
				console.log('Game was deleted');
				return;
			}
			throw new Error('Request failed.');
		})
		.then(function () {
			function myFunction() {
				var x = document.querySelectorAll("#gameboard > div");
				var i;
				for (i = 0; i < x.length; i++) {
					x[i].style.backgroundColor = "#f6f8f9";
				}
			}
			myFunction();
			gameBoard[0] = [0, 2, 2, 0, 1, 0, 0, 0, 1, 0]
			hitCount = 0;

		})
		.catch(function (error) {
			console.log(error);
		});
});





document.querySelector('.gameboard').addEventListener('click', shot);

function shot(e) {

	console.log("Y - " + e.target.id.substring(1, 2) + ", X - " + e.target.id.substring(2, 3));


	fetch('/shots', {
			method: 'post',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				shot: shot
			})
		})
		.then(function (response) {
			if (response.ok) {

				console.log('Shot was saved');
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function (error) {
			console.log(error);
		});
}


// setInterval(function () {
// 	fetch('/shots', {
// 			method: 'GET'
// 		})
// 		.then(function (response) {
// 			if (response.ok) return response.json();
// 			throw new Error('Request failed.');
// 		}).then(function (shot) {
// 			document.getElementById('history').innerHTML = `${shot}`;
// 		})
// 		.catch(function (error) {
// 			console.log(error);
// 		});
// }, 5000);
