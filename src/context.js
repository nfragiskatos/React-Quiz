import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';

const table = {
	sports: 21,
	history: 23,
	politics: 24
};

const API_ENDPOINT = 'https://opentdb.com/api.php?';

const url = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	const [waiting, setWaiting] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [index, setIndex] = useState(0);
	const [correct, setCorrect] = useState(0);
	const [error, setError] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [quiz, setQuiz] = useState({
		amount: 10,
		category: 'sports',
		difficulty: 'easy'
	});

	const nextQuestion = () => {
		setIndex((oldIndex) => {
			const index = oldIndex + 1;
			if (index > questions.length - 1) {
				openModal();
				return 0;
			}
			return index;
		});
	};

	const checkAnswer = (value) => {
		if (value) {
			setCorrect((oldState) => oldState + 1);
		}

		nextQuestion();
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setWaiting(true);
	};

	const fetchQuestions = async (url) => {
		setIsLoading(true);
		setWaiting(false);
		const response = await axios(url).catch((e) => console.log(e));

		if (response) {
			const data = response.data.results;
			console.log(data);
			if (data.length > 0) {
				setQuestions(data);
				setIsLoading(false);
				setWaiting(false);
				setError(false);
			} else {
				setWaiting(true);
				setError(true);
			}
		} else {
			setWaiting(true);
		}
	};

	const handleChange = (e) => {
		console.log(e);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<AppContext.Provider
			value={{
				waiting,
				isLoading,
				questions,
				index,
				correct,
				error,
				isModalOpen,
				nextQuestion,
				checkAnswer,
				closeModal,
				quiz,
				handleChange,
				handleSubmit
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
// make sure use
export const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider };
