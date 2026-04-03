import React, { useState, useMemo } from 'react';
import { MCQQuestion } from '../teacher/UploadMCQ';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { SunMedium } from 'lucide-react';

export default function MCQAnswering({
	questions,
	totalPoints,
	assignmentId,
	userId,
	classId,
	onChange,
}: {
	questions: MCQQuestion[];
	totalPoints: string;
	assignmentId: string;
	userId: string;
	classId: string;
	onChange: () => void;
}) {
	const [index, setIndex] = useState(0);
	// Store answers as { [questionIndex]: "Selected Answer" }
	const [userSelections, setUserSelections] = useState<Record<number, string>>(
		{},
	);
	const [loading, setLoading] = useState(false);

	const questionData = questions[index];

	// Shuffle logic stays the same
	const shuffledAnswers = useMemo(() => {
		const answers = [
			questionData.correct,
			questionData.wrong1,
			questionData.wrong2,
			questionData.wrong3,
		];
		return answers.sort(() => Math.random() - 0.5);
	}, [index, questionData]);

	const handleValueChange = (value: string) => {
		setUserSelections((prev) => ({
			...prev,
			[index]: value, // Update only the current question's answer
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Map the numeric keys back to the actual question text for a cleaner log
		const finalReport = questions.map((q, i) => ({
			question: q.question,
			selected: userSelections[i] || 'No answer selected',
			isCorrect: userSelections[i] === q.correct,
		}));

		const totalCorrect = finalReport.filter(
			(question) => question.isCorrect,
		).length;

		const point = Math.round(
			(totalCorrect / questions.length) * Number(totalPoints),
		);

		await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/submissions/?user_id=${userId}`,
				{
					assignment_id: assignmentId,
					class_id: classId,
					file_url: '',
					notes: '',
					'isMCQ': true,
					'mcq_answers': [JSON.stringify(finalReport)],
				},
			)
			.then((submission) => {
				toast.success('Assignment submitted');
				handleGrade(point.toString(), submission.data.id);
			})
			.catch((e) => {
				toast.error('Failed to submit assignment');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleGrade = async (score: string, submissionId: string) => {
		toast.success('Grading...');
		await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/grades/?user_id=${userId}`,
				{
					'submission_id': submissionId,
					'grade': score,
					'feedback': 'string',
				},
			)
			.then((response) => {
				toast.success('Grade recorded!');
				onChange();
			});
	};
	return (
		<div className='border rounded-md bg-white p-5 max-w-2xl mx-auto'>
			<div className='flex justify-between items-center mb-4'>
				<p className='font-medium text-slate-500'>
					Question {index + 1} of {questions.length}
				</p>
				<p className='text-xs bg-slate-100 px-2 py-1 rounded'>
					Progress:{' '}
					{Math.round(
						(Object.keys(userSelections).length / questions.length) * 100,
					)}
					%
				</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='space-y-4'>
					<p className='text-lg font-semibold'>{questionData.question}</p>

					<RadioGroup
						name='answer'
						value={userSelections[index] || ''}
						onValueChange={handleValueChange}
						className='flex flex-col gap-3'
					>
						{shuffledAnswers.map((answer, i) => (
							<div
								key={`${index}-${i}`}
								className='flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors'
							>
								<RadioGroupItem value={answer} id={`q-${i}`} />
								<Label
									htmlFor={`q-${i}`}
									className='w-full cursor-pointer font-normal'
								>
									{answer}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>

				<div className='flex flex-col lg:flex-row gap-4 justify-between pt-4 border-t'>
					<div className='flex gap-2'>
						<Button
							variant='outline'
							onClick={(e) => {
								e.preventDefault();
								setIndex((i) => i - 1);
							}}
							disabled={index === 0}
							type='button'
						>
							Back
						</Button>

						<Button
							variant='outline'
							onClick={(e) => {
								e.preventDefault();
								setIndex((i) => i + 1);
							}}
							disabled={index === questions.length - 1}
							type='button'
						>
							Next
						</Button>
					</div>

					{index === questions.length - 1 && (
						<Button
							type='submit'
							className='bg-indigo-600 hover:bg-indigo-700'
							disabled={loading}
						>
							{loading ? 'Submiting...' : 'Submit All Answers'}
						</Button>
					)}
				</div>
			</form>
		</div>
	);
}
