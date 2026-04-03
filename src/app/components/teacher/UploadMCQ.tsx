import React, { ChangeEvent, useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import Papa from 'papaparse';
import { toast } from 'sonner';

export interface MCQQuestion {
	question: string;
	correct: string;
	wrong1: string;
	wrong2: string;
	wrong3: string;
}
const acceptableFileType =
	'application/vnd.ms-excel, application/csv, text/csv, text/plain, text/x-csv, text/comma-separated-values, ';
export default function UploadMCQ({
	handleMCQ,
	toggleIsMCQ,
}: {
	handleMCQ: (val: string) => void;
	toggleIsMCQ: (val: boolean) => void;
}) {
	const [isMCQ, setIsMCQ] = useState(false);
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<MCQQuestion[]>([]);
	const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;

		const file = event.target.files[0] as any;

		setLoading(true);
		Papa.parse(file, {
			skipEmptyLines: true,
			header: true,
			complete: async function (results) {
				if (results.errors.length > 0) {
					toast.error('Error creating MCQ Questions', {
						description: `${JSON.stringify(results.errors)}`,
					});
				}

				Promise.all(
					results.data.map((row: any) => {
						if (!row.question || !row.correct || !row.wrong1) {
							toast.error('No questions detected, please reupload', {
								description:
									'Question must have a question, correct, wrong1 column.',
							});

							return;
						}
						setQuestions((prev) => [...prev, row]);
					}),
				)
					.then(() => {})
					.catch((error) => {
						console.error('Error creating students:', error);
					})
					.finally(() => {
						setLoading(false);
					});
			},
		});
	};

	useEffect(() => {
		if (!questions.length) return;
		handleMCQ(JSON.stringify(questions));
	}, [questions]);

	return (
		<div className='space-y-2'>
			<div className='flex gap-5 '>
				<Label htmlFor='toggle'>MCQ Question</Label>
				<Switch
					id='toggle'
					checked={isMCQ}
					onCheckedChange={(e) => {
						setIsMCQ(e);
						toggleIsMCQ(e);
					}}
				/>
			</div>
			{isMCQ && questions.length < 1 && (
				<div className='space-y-3'>
					<Label htmlFor='upload'>Upload MCQ CSV</Label>
					<Input
						type='file'
						id='upload'
						onChange={onFileChange}
						accept={acceptableFileType}
						disabled={loading}
					/>
					<p>
						<span className='font-medium'>
							The CSV must contain the columns:
						</span>{' '}
						question, correct, wrong1, wrong2, wrong3
						<a
							href='https://docs.google.com/spreadsheets/d/1r-fesJSZ0q-HkJYSQTKsd4sexbHJmOytmjdsuiDXjs0/edit?usp=sharing'
							target='_blank'
							className='pl-2 underline text-blue-500 cursor-pointer'
						>
							View Sample
						</a>{' '}
					</p>
				</div>
			)}

			{isMCQ && questions.length > 0 && (
				<div className='max-h-52 overflow-auto border p-1 border-neutral-200 rounded-lg'>
					<p className='font-medium'>Questions:</p>
					{questions.map((question, index) => (
						<div key={index} className='line-clamp-1 space-x-3 space-y-1'>
							<span>{index + 1}.</span> <span>{question.question}</span>
							<span className='underline'>{question.correct}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
