import axios from 'axios';
import { Calendar, FileText, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Assignment, Class, Submission } from '../TeacherDashboard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import TeacherSumissionView from './TeacherSumissionView';
import UploadMCQ from './UploadMCQ';

interface AssignmentsTabProps {
	selectedClass: Class;
	teacher_id: string;
}

export default function AssignmentsTab({
	selectedClass,
	teacher_id,
}: AssignmentsTabProps) {
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [selectedAssignment, setSelectedAssignment] =
		useState<Assignment | null>(null);
	const [loading, setLoading] = useState(false);
	const [newAssignment, setNewAssignment] = useState({
		title: '',
		description: '',
		dueDate: '',
		totalPoints: '100',
		link: '',
		isMCQ: false,
		MCQQuestions: '',
	});
	const [creatingAssignment, setCreatingAssignment] = useState(false);

	useEffect(() => {
		const getAssignments = async () => {
			setLoading(true);
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/assignments/class/${selectedClass.id}/?user_id=${teacher_id}`,
				)
				.then((response) => {
					setAssignments(response.data);
				})
				.catch((e) => {
					console.log('Error getting assignments', e);
				})
				.finally(() => {
					setLoading(false);
				});
		};
		getAssignments();
	}, [isCreateDialogOpen, selectedAssignment]);

	const handleCreateAssignment = async () => {
		if (!newAssignment.title) {
			toast.error('Assignment must have a title ');
			return;
		}
		if (!newAssignment.dueDate) {
			toast.error('Assignments must have a due date');
			return;
		}
		setCreatingAssignment(true);

		const assignment: Assignment = {
			title: newAssignment.title,
			description: newAssignment.description,
			class_id: selectedClass.id,
			due_date: newAssignment.dueDate,
			total_points: newAssignment.totalPoints,
			file_url: newAssignment.link,
			isMCQ: newAssignment.isMCQ,
			mcq_questions: [newAssignment.MCQQuestions],
		};

		if (assignment.isMCQ) {
			if (assignment.mcq_questions && assignment.mcq_questions[0] == '') {
				toast.error('Error creating questions, no MCQ question found in file.');
				setCreatingAssignment(false);
				return;
			}
		}
		await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/assignments/?user_id=${teacher_id}`,
				{ ...assignment },
			)
			.then((response) => {
				setAssignments([...assignments, response.data]);
				toast.success('Assignment created successfully!');
			})
			.catch((error) => {
				toast.error('Error creating assignment', {
					description: `${error.message}`,
				});
				console.log(error);
			});
		setIsCreateDialogOpen(false);
		setNewAssignment({
			title: '',
			description: '',
			dueDate: '',
			totalPoints: '100',
			link: '',
			isMCQ: false,
			MCQQuestions: '',
		});
		setCreatingAssignment(false);
	};

	// const classStudents = mockStudents.filter(s => s.classId === selectedClass.id);

	const onBack = () => {
		setSelectedAssignment(null);
	};
	return (
		<div className='space-y-6'>
			{/* Header with Create Button */}
			<Card>
				<CardHeader>
					<div className='flex flex-col md:flex-row md:items-center justify-between space-y-2'>
						<div>
							<CardTitle>Assignments</CardTitle>
							<CardDescription>
								Create and manage assignments for this class
							</CardDescription>
						</div>
						<Dialog
							open={isCreateDialogOpen}
							onOpenChange={setIsCreateDialogOpen}
						>
							<DialogTrigger asChild>
								<Button>
									<Plus className='h-4 w-4 mr-2' />
									Create Assignment
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl'>
								<DialogHeader>
									<DialogTitle>Create New Assignment</DialogTitle>
									<DialogDescription>
										Add a new assignment for {selectedClass.name}
									</DialogDescription>
								</DialogHeader>
								<div className='space-y-4 mt-4'>
									<div className='space-y-2'>
										<Label htmlFor='title'>Title *</Label>
										<Input
											id='title'
											placeholder='e.g., Chapter 5 Quiz'
											value={newAssignment.title}
											onChange={(e) =>
												setNewAssignment({
													...newAssignment,
													title: e.target.value,
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='description'>Description</Label>
										<Textarea
											id='description'
											placeholder='Describe the assignment...'
											rows={4}
											value={newAssignment.description}
											onChange={(e) =>
												setNewAssignment({
													...newAssignment,
													description: e.target.value,
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='link'>Related Link</Label>
										<Input
											id='link'
											placeholder='Any related link (Youtube, Google Drive, PDF) of assignment...'
											value={newAssignment.link}
											onChange={(e) =>
												setNewAssignment({
													...newAssignment,
													link: e.target.value,
												})
											}
										/>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='dueDate'>Due Date *</Label>
											<Input
												id='dueDate'
												type='date'
												value={newAssignment.dueDate}
												onChange={(e) =>
													setNewAssignment({
														...newAssignment,
														dueDate: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='totalPoints'>Total Points</Label>
											<Input
												id='totalPoints'
												type='number'
												value={newAssignment.totalPoints}
												onChange={(e) =>
													setNewAssignment({
														...newAssignment,
														totalPoints: e.target.value,
													})
												}
											/>
										</div>
									</div>
									<UploadMCQ
										toggleIsMCQ={(e) => {
											setNewAssignment({ ...newAssignment, isMCQ: e });
										}}
										handleMCQ={(e) =>
											setNewAssignment({
												...newAssignment,
												MCQQuestions: e,
												isMCQ: true,
											})
										}
									/>
									<div className='flex justify-end gap-2 pt-4'>
										<Button
											variant='outline'
											onClick={() => setIsCreateDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button
											onClick={handleCreateAssignment}
											disabled={creatingAssignment}
										>
											{creatingAssignment
												? 'Creating....'
												: 'Create Assignment'}
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
			</Card>

			{/* Assignments List */}
			{!selectedAssignment ? (
				<div className='grid grid-cols-1 gap-4'>
					{assignments.length === 0 ? (
						<Card>
							<CardContent className='pt-6 text-center py-12'>
								<FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
								{loading ? (
									<p>Loading assignments...</p>
								) : (
									<p className='text-gray-600'>
										No assignments yet. Create your first assignment to get
										started.
									</p>
								)}
							</CardContent>
						</Card>
					) : (
						assignments
							.sort(
								(a, b) =>
									(new Date(b.created_at || 0) as any) -
									(new Date(a.created_at || 2) as any),
							)
							.map((assignment) => {
								const dueDate = new Date(assignment.due_date);
								const isOverdue = dueDate < new Date();

								return (
									<Card
										key={assignment.id}
										className='hover:shadow-lg transition-shadow cursor-pointer'
										onClick={() => setSelectedAssignment(assignment)}
									>
										<CardContent className='pt-6'>
											<div className='flex items-start justify-between mb-4'>
												<div className='flex-1'>
													<h3 className='text-lg font-semibold mb-2'>
														{assignment.title}
													</h3>
													<p className='text-sm text-gray-600 mb-3'>
														{assignment.description}
													</p>
													<div className='flex flex-wrap gap-2'>
														<Badge variant='outline' className='text-xs'>
															<Calendar className='h-3 w-3 mr-1' />
															Due: {dueDate.toLocaleDateString()}
														</Badge>
														{isOverdue && (
															<Badge variant='destructive' className='text-xs'>
																Overdue
															</Badge>
														)}
														<Badge variant='outline' className='text-xs'>
															{assignment.total_points} points
														</Badge>
													</div>
												</div>
												<div className='p-3 bg-blue-100 rounded-full'>
													<FileText className='h-6 w-6 text-blue-600' />
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})
					)}
				</div>
			) : (
				<TeacherSumissionView
					onBack={onBack}
					selectedAssignment={selectedAssignment}
					students={selectedClass.students}
				/>
			)}
		</div>
	);
}
