import axios from 'axios';
import { Calendar, FileText, Plus, Pencil } from 'lucide-react';
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
	const [updatingAssignment, setUpdatingAssignment] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editingAssignmentForm, setEditingAssignmentForm] = useState({
		id: '',
		title: '',
		description: '',
		dueDate: '',
		totalPoints: '100',
		link: '',
		isMCQ: false,
		MCQQuestions: '',
	});

	useEffect(() => {
		const getAssignments = async () => {
			setLoading(true);
			await axios
				.get(
					`https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/assignments/class/${selectedClass.id}/?user_id=${teacher_id}`,
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
	}, [isCreateDialogOpen, isEditDialogOpen, selectedAssignment]);

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
				`https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/assignments/?user_id=${teacher_id}`,
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

	const handleUpdateAssignment = async () => {
		if (!editingAssignmentForm.title) {
			toast.error('Assignment must have a title ');
			return;
		}
		if (!editingAssignmentForm.dueDate) {
			toast.error('Assignments must have a due date');
			return;
		}
		setUpdatingAssignment(true);

		const updatedAssignmentPayload = {
			title: editingAssignmentForm.title,
			description: editingAssignmentForm.description,
			class_id: selectedClass.id,
			due_date: editingAssignmentForm.dueDate,
			total_points: editingAssignmentForm.totalPoints,
			file_url: editingAssignmentForm.link,
			isMCQ: editingAssignmentForm.isMCQ,
			mcq_questions: [editingAssignmentForm.MCQQuestions],
		};

		if (updatedAssignmentPayload.isMCQ) {
			if (updatedAssignmentPayload.mcq_questions && updatedAssignmentPayload.mcq_questions[0] === '') {
				toast.error('Error updating questions, no MCQ question found in file.');
				setUpdatingAssignment(false);
				return;
			}
		}

		await axios
			.put(
				`https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/assignments/${editingAssignmentForm.id}?user_id=${teacher_id}`,
				updatedAssignmentPayload,
			)
			.then((response) => {
				setAssignments(
					assignments.map((a) =>
						a.id === editingAssignmentForm.id ? response.data : a,
					),
				);
				toast.success('Assignment updated successfully!');
				setIsEditDialogOpen(false);
			})
			.catch((error) => {
				toast.error('Error updating assignment', {
					description: `${error.message}`,
				});
				console.log(error);
			})
			.finally(() => {
				setUpdatingAssignment(false);
			});
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

						<Dialog
							open={isEditDialogOpen}
							onOpenChange={setIsEditDialogOpen}
						>
							<DialogContent className='max-w-2xl'>
								<DialogHeader>
									<DialogTitle>Edit Assignment</DialogTitle>
									<DialogDescription>
										Update assignment details for {selectedClass.name}
									</DialogDescription>
								</DialogHeader>
								<div className='space-y-4 mt-4'>
									<div className='space-y-2'>
										<Label htmlFor='edit-title'>Title *</Label>
										<Input
											id='edit-title'
											placeholder='e.g., Chapter 5 Quiz'
											value={editingAssignmentForm.title}
											onChange={(e) =>
												setEditingAssignmentForm({
													...editingAssignmentForm,
													title: e.target.value,
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='edit-description'>Description</Label>
										<Textarea
											id='edit-description'
											placeholder='Describe the assignment...'
											rows={4}
											value={editingAssignmentForm.description}
											onChange={(e) =>
												setEditingAssignmentForm({
													...editingAssignmentForm,
													description: e.target.value,
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='edit-link'>Related Link</Label>
										<Input
											id='edit-link'
											placeholder='Any related link (Youtube, Google Drive, PDF) of assignment...'
											value={editingAssignmentForm.link}
											onChange={(e) =>
												setEditingAssignmentForm({
													...editingAssignmentForm,
													link: e.target.value,
												})
											}
										/>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='edit-dueDate'>Due Date *</Label>
											<Input
												id='edit-dueDate'
												type='date'
												value={editingAssignmentForm.dueDate}
												onChange={(e) =>
													setEditingAssignmentForm({
														...editingAssignmentForm,
														dueDate: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='edit-totalPoints'>Total Points</Label>
											<Input
												id='edit-totalPoints'
												type='number'
												value={editingAssignmentForm.totalPoints}
												onChange={(e) =>
													setEditingAssignmentForm({
														...editingAssignmentForm,
														totalPoints: e.target.value,
													})
												}
											/>
										</div>
									</div>
									<UploadMCQ
										toggleIsMCQ={(e) => {
											setEditingAssignmentForm({ ...editingAssignmentForm, isMCQ: e });
										}}
										handleMCQ={(e) =>
											setEditingAssignmentForm({
												...editingAssignmentForm,
												MCQQuestions: e,
												isMCQ: true,
											})
										}
									/>
									<div className='flex justify-end gap-2 pt-4'>
										<Button
											variant='outline'
											onClick={() => setIsEditDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button
											onClick={handleUpdateAssignment}
											disabled={updatingAssignment}
										>
											{updatingAssignment
												? 'Updating....'
												: 'Update Assignment'}
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
												<div className='flex items-center gap-3'>
													<Button
														variant="outline"
														size="icon"
														onClick={(e) => {
															e.stopPropagation();
															setEditingAssignmentForm({
																id: assignment.id || '',
																title: assignment.title || '',
																description: assignment.description || '',
																dueDate: assignment.due_date ? assignment.due_date.split('T')[0] : '',
																totalPoints: `${assignment.total_points || 100}`,
																link: assignment.file_url || '',
																isMCQ: assignment.isMCQ || false,
																MCQQuestions: (assignment.mcq_questions && assignment.mcq_questions[0]) || '',
															});
															setIsEditDialogOpen(true);
														}}
													>
														<Pencil className='h-4 w-4 text-gray-600' />
													</Button>
													<div className='p-3 bg-blue-100 rounded-full'>
														<FileText className='h-6 w-6 text-blue-600' />
													</div>
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
