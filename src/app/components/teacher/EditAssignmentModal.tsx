import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Assignment } from '../TeacherDashboard';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import UploadMCQ from './UploadMCQ';

interface EditAssignmentModalProps {
	classId: string;
	className: string;
	teacherId: string;
	assignmentToEdit: Assignment | null;
	isOpen: boolean;
	onClose: () => void;
	onAssignmentUpdated: (assignment: Assignment) => void;
}

export default function EditAssignmentModal({
	classId,
	className,
	teacherId,
	assignmentToEdit,
	isOpen,
	onClose,
	onAssignmentUpdated,
}: EditAssignmentModalProps) {
	const [updatingAssignment, setUpdatingAssignment] = useState(false);
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
		if (assignmentToEdit) {
			setEditingAssignmentForm({
				id: assignmentToEdit.id || '',
				title: assignmentToEdit.title || '',
				description: assignmentToEdit.description || '',
				dueDate: assignmentToEdit.due_date
					? assignmentToEdit.due_date.split('T')[0]
					: '',
				totalPoints: `${assignmentToEdit.total_points || 100}`,
				link: assignmentToEdit.file_url || '',
				isMCQ: assignmentToEdit.isMCQ || false,
				MCQQuestions:
					(assignmentToEdit.mcq_questions &&
						assignmentToEdit.mcq_questions[0]) ||
					'',
			});
		}
	}, [assignmentToEdit]);

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
			class_id: classId,
			due_date: editingAssignmentForm.dueDate,
			total_points: editingAssignmentForm.totalPoints,
			file_url: editingAssignmentForm.link,
			isMCQ: editingAssignmentForm.isMCQ,
			mcq_questions: [editingAssignmentForm.MCQQuestions],
		};

		if (updatedAssignmentPayload.isMCQ) {
			if (
				updatedAssignmentPayload.mcq_questions &&
				updatedAssignmentPayload.mcq_questions[0] === ''
			) {
				toast.error('Error updating questions, no MCQ question found in file.');
				setUpdatingAssignment(false);
				return;
			}
		}

		await axios
			.put(
				`https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/assignments/${editingAssignmentForm.id}?user_id=${teacherId}`,
				updatedAssignmentPayload,
			)
			.then((response) => {
				onAssignmentUpdated(response.data);
				toast.success('Assignment updated successfully!');
				onClose();
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

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Edit Assignment</DialogTitle>
					<DialogDescription>
						Update assignment details for {className}
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
							setEditingAssignmentForm({
								...editingAssignmentForm,
								isMCQ: e,
							});
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
						<Button variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button
							onClick={handleUpdateAssignment}
							disabled={updatingAssignment}
						>
							{updatingAssignment ? 'Updating....' : 'Update Assignment'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
