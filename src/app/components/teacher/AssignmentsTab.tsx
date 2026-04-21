import axios from 'axios';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Assignment, Class } from '../TeacherDashboard';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import TeacherSumissionView from './TeacherSumissionView';
import CreateAssignmentModal from './CreateAssignmentModal';
import EditAssignmentModal from './EditAssignmentModal';
import AssignmentCard from './AssignmentCard';

interface AssignmentsTabProps {
	selectedClass: Class;
	teacher_id: string;
}

export default function AssignmentsTab({
	selectedClass,
	teacher_id,
}: AssignmentsTabProps) {
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
	const [loading, setLoading] = useState(false);

	const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
	}, [selectedClass.id, teacher_id]);

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
						<CreateAssignmentModal
							classId={selectedClass.id}
							className={selectedClass.name}
							teacherId={teacher_id}
							onAssignmentCreated={(newAssignment) => setAssignments([...assignments, newAssignment])}
						/>
					</div>
				</CardHeader>
			</Card>

			<EditAssignmentModal
				classId={selectedClass.id}
				className={selectedClass.name}
				teacherId={teacher_id}
				assignmentToEdit={assignmentToEdit}
				isOpen={isEditDialogOpen}
				onClose={() => {
					setIsEditDialogOpen(false);
					setAssignmentToEdit(null);
				}}
				onAssignmentUpdated={(updatedAssignment) => {
					setAssignments(
						assignments.map((a) =>
							a.id === updatedAssignment.id ? updatedAssignment : a
						)
					);
				}}
			/>

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
							.map((assignment) => (
								<AssignmentCard
									key={assignment.id}
									assignment={assignment}
									onClickView={(a) => setSelectedAssignment(a)}
									onClickEdit={(a) => {
										setAssignmentToEdit(a);
										setIsEditDialogOpen(true);
									}}
								/>
							))
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
