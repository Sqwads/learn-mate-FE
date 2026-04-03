import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, ExternalLink, Trash } from 'lucide-react';
import { Assignment } from '../TeacherDashboard';
import axios from 'axios';
import { Submission } from '../student/PendingAssignmentList';
import { Student } from '../admin/ClassesTabContent';
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Table,
} from '../ui/table';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import ViewMCQContents from './ViewMCQContents';

export type Mark = {
	'id': string;
	'submission_id': string;
	'grade': string;
};
export default function TeacherSumissionView({
	selectedAssignment,
	onBack,
	students,
}: {
	selectedAssignment: Assignment;
	onBack: () => void;
	students: Student[];
}) {
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [grades, setGrades] = useState<Record<string, string>>({});
	const [marks, setMarks] = useState<Mark[]>([]);
	useEffect(() => {
		const getSubmissions = async () => {
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/submissions/assignment/${selectedAssignment.id}?user_id=${selectedAssignment.created_by}`,
				)
				.then((response) => {
					setSubmissions(response.data);
					getGrades();
				});
		};
		getSubmissions();
	}, [selectedAssignment]);
	const getGrades = async () => {
		await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/grades/assignment/${selectedAssignment.id}?user_id=${selectedAssignment.created_by}`,
			)
			.then((response) => {
				setMarks(response.data);
			});
	};
	const handleDelete = async () => {
		await axios.delete(
			`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/assignments/${selectedAssignment.id}?user_id=${selectedAssignment.created_by}`,
		);

		toast.success('Assignment deleted!');
		onBack();
	};
	const handleGrade = async (submissionId: string) => {
		// Get the specific grade for this row, default to '0'
		const submissionGrade = grades[submissionId] || '0';
		if (Number(submissionGrade) > Number(selectedAssignment.total_points)) {
			toast.error('Grade is larger than the assignment allocated score');
			return;
		}
		await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/grades/?user_id=${selectedAssignment.created_by}`,
				{
					'submission_id': submissionId,
					'grade': submissionGrade,
					'feedback': 'string',
				},
			)
			.then((response) => {
				toast.success('Grade recorded!');
				setMarks((prev) => [
					...prev,
					{
						id: response.data.id,
						grade: submissionGrade,
						submission_id: submissionId,
					},
				]);
			});
	};
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={onBack}>
					← Back to Assignments
				</Button>
				<Button size={'sm'} variant={'destructive'} onClick={handleDelete}>
					<Trash />
					Delete
				</Button>
			</div>

			<Card>
				<CardHeader>
					<div className='flex items-start justify-between'>
						<div className='w-full'>
							<CardTitle>{selectedAssignment.title}</CardTitle>
							<CardDescription className='mt-2'>
								{selectedAssignment.description}
							</CardDescription>
							<div className='flex gap-2 mt-3'>
								<Badge variant='outline'>
									<Calendar className='h-3 w-3 mr-1' />
									Due:{' '}
									{new Date(selectedAssignment.due_date).toLocaleDateString()}
								</Badge>
								<Badge variant='outline'>
									{selectedAssignment.total_points} points
								</Badge>
								{selectedAssignment.isMCQ && (
									<Badge variant={'outline'}>Multiple Choice</Badge>
								)}
							</div>
							{/* {selectedAssignment.isMCQ && (
								<ViewMCQContents
									rawquestions={selectedAssignment?.mcq_questions || []}
								/>
							)} */}

							<div className='w-full grid grid-cols-3 gap-4 pt-4 border-y my-2 p-2'>
								<div className='text-center'>
									<p className='text-2xl font-semibold text-blue-600'>
										{submissions.length}
									</p>
									<p className='text-xs text-gray-600'>Submissions</p>
								</div>
								<div className='text-center'>
									<p className='text-2xl font-semibold text-green-600'>
										{Math.round((submissions.length / students.length) * 100)}%
									</p>
									<p className='text-xs text-gray-600'>Submission Rate</p>
								</div>
								<div className='text-center'>
									<p className='text-2xl font-semibold text-purple-600'>
										{marks.length}
									</p>
									<p className='text-xs text-gray-600'>Graded</p>
								</div>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						<h4 className='font-semibold'>Submissions</h4>
					</div>
					<div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>No</TableHead>
									<TableHead>Student Name</TableHead>
									<TableHead>Submission Link</TableHead>
									<TableHead>Additional Note</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Grade</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{submissions.map((submission, index) => (
									<TableRow key={submission.id}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>
											{
												students.find(
													(student) => student.id == submission.student_id,
												)?.full_name
											}
										</TableCell>
										<TableCell className='flex gap-2 items-center justify-center text-blue-600'>
											<a href={submission?.file_url} target='_blank'>
												{submission?.file_url}
											</a>
											<ExternalLink className='size-4' />
										</TableCell>
										<TableCell>{submission?.notes}</TableCell>
										<TableCell>
											{new Date(submission?.submitted_at).toLocaleString()}
										</TableCell>
										<TableCell>
											{marks.find(
												(mark) => mark.submission_id == submission.id,
											) ? (
												marks.find(
													(mark) => mark.submission_id == submission.id,
												)?.grade
											) : (
												<div className='flex gap-3'>
													<input
														type='number'
														className='border max-w-[4rem] rounded-sm p-1'
														placeholder={selectedAssignment.total_points}
														value={grades[submission.id] || ''}
														onChange={(e) =>
															setGrades((prev) => ({
																...prev,
																[submission.id]: e.target.value,
															}))
														}
													/>
													<Button
														size={'sm'}
														onClick={() => handleGrade(submission.id)}
													>
														Grade
													</Button>
												</div>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
