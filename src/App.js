import React, { useState, useEffect } from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
	const [dice, setDice] = useState(() => allNewDice());

	const [tenzies, setTenzies] = useState(false);

	useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld);
		const equality = dice.every((die) => die.value === dice[0]['value']);
		if (allHeld && equality) {
			setTenzies(true);
		}
	}, [dice]);

	function generateNewDie() {
		return {
			value: Math.floor(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		};
	}
	function allNewDice() {
		const newDice = [];
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie());
		}
		return newDice;
	}

	function rollDice() {
		if (!tenzies) {
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : generateNewDie();
				})
			);
		} else {
			setTenzies(false);
			setDice(allNewDice());
		}
	}

	function holdDice(id) {
		setDice((prevDice) =>
			prevDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
			})
		);
	}

	const diceElements = dice.map((die) => {
		return (
			<Die
				key={die.id}
				value={die.value}
				isHeld={die.isHeld}
				holdDice={() => holdDice(die.id)}
			/>
		);
	});

	return (
		<main className="main">
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<div className="die-container">{diceElements}</div>
			<button type="button" className="roll-button" onClick={rollDice}>
				{tenzies ? 'New Game' : 'Roll'}
			</button>
			{tenzies && <Confetti />}
		</main>
	);
}
