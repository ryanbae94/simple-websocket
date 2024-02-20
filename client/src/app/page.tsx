'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Home() {
	const [answer, setAnswer] = useState('');
	const [progress, setProgress] = useState({});
	const [isCorrect, setIsCorrect] = useState(false);
	const [userId, setUserId] = useState('');
	const [id, setId] = useState(false);

	useEffect(() => {
		socket.on('progress', (data) => {
			setProgress((prevProgress) => ({
				...prevProgress,
				[data.userId]: data.progress,
			}));
		});

		// 컴포넌트 언마운트 시 소켓 이벤트 리스너 해제
		return () => {
			socket.off('progress');
			socket.off('register');
		};
	}, []);

	const handleAnswerChange = (e) => {
		setAnswer(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// 간단한 퀴즈 검증 로직
		if (answer.trim() === '2') {
			setIsCorrect(true);
			// 사용자의 진행 상황 업데이트
			socket.emit('progress', { userId, progress: '100%' });
		} else {
			setIsCorrect(false);
		}
	};

	const createUserId = (e) => {
		e.preventDefault();
		setId(true);
		socket.emit('register', { userId });
	};

	const handleUserId = (e) => {
		setUserId(e.target.value);
	};

	return id === false ? (
		<div>
			<form onSubmit={createUserId}>
				<label>Submit Your name: </label>
				<input type='text' value={userId} onChange={handleUserId} />
				<button>제출</button>
			</form>
		</div>
	) : (
		<div>
			<h1>Simple Quiz</h1>
			<h2>Your name: {userId}</h2>
			<form onSubmit={handleSubmit}>
				<label>
					What is 1 + 1?
					<input type='text' value={answer} onChange={handleAnswerChange} />
				</label>
				<button type='submit'>Submit</button>
			</form>
			{isCorrect ? <p>Correct!</p> : <p>Please try again.</p>}
			<h2>Progress of other users:</h2>
			<ul>
				{Object.entries(progress).map(([userId, progress], index) => (
					<li key={index}>{`${userId}: ${progress}`}</li>
				))}
			</ul>
		</div>
	);
}
