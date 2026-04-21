import axios from 'axios';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Assignment } from '../TeacherDashboard';
import { Button } from '../ui/button';
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
import UploadMCQ from './UploadMCQ';

interface CreateAssignmentModalProps {
	classId: string;
	className: string;
	teacherId: string;
	onAssignmentCreated: (assignment: Assignment) => void;
}

export default function CreateAssignmentModal({
	classId,
	className,
	teacherId,
	onAssignmentCreated,
}: CreateAssignmentModalProps) {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
			class_id: classId,
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
				`https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/assignments/?user_id=${teacherId}`,
				{ ...assignment },
			)
			.then((response) => {
				onAssignmentCreated(response.data);
				toast.success('Assignment created successfully!');
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
			})
			.catch((error) => {
				toast.error('Error creating assignment', {
					description: `${error.message}`,
				});
				console.log(error);
			})
			.finally(() => {
				setCreatingAssignment(false);
			});
	};

	return (
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
						Add a new assignment for {className}
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
							{creatingAssignment ? 'Creating....' : 'Create Assignment'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
