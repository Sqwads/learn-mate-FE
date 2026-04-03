import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Student } from './ClassesTabContent';

export default function AddStudentToClassDialog({
	id,
	admin_id,
	name,
	description,
	enrolledStudents,
	students,
	onChange,
}: {
	id: string;
	name: string;
	admin_id: string;
	description: string;
	enrolledStudents: Student[];
	students: any[];
	onChange: () => void;
}) {
	const [key, setKey] = useState(0);
	const [studentsIn, setStudentsIn] = useState(enrolledStudents);

	const handleKey = () => {
		setKey(Math.random());
	};
	const handleAddStudent = async (student_id: string) => {
		await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes/${id}/students?user_id=${admin_id}`,
				{
					student_id,
				},
			)
			.then(() => {
				setStudentsIn([
					...studentsIn,
					{ email: '', full_name: '', id: student_id },
				]);
				// enrolledStudents.push({ email: '', full_name: '', id: student_id });
				// handleKey();
				toast.success('Student added to class');
			})
			.catch((e) => {
				console.log('Error adding user', e);
				toast.error('Could not add student to class');
			});
	};
	const handleRemoveStudent = async (student_id: string) => {
		await axios
			.delete(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes/${id}/students/${student_id}?user_id=${admin_id}`,
			)
			.then((response) => {
				const filtered = studentsIn.filter((u) => u.id !== student_id);
				setStudentsIn([...filtered]);
				toast.success('Student removed from class');
			})
			.catch((e) => {
				console.log('Error adding user', e);
				toast.error('Could not be removed from class');
			});
	};
	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					onChange();
					setStudentsIn(enrolledStudents);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button variant={'outline'}>
					<Plus className='size-5 ' />
				</Button>
			</DialogTrigger>
			<DialogContent key={key}>
				<DialogHeader>
					<DialogTitle>
						{name} | {description}
					</DialogTitle>
					<DialogDescription>
						Add or remove student from this class.
					</DialogDescription>
					<div>
						<p></p>
						<div>
							{students.map((student) => (
								<div
									className='flex items-center justify-between gap-3 py-2 border-b'
									key={student.id}
								>
									<div
										className={`size-6 rounded-full hidden md:flex items-center justify-center text-white font-semibold bg-blue-600`}
									>
										{student.name.charAt(0)}
									</div>
									<div>
										<p className=' line-clamp-1'>{student.name}</p>
									</div>
									<div className='flex gap-3 items-center'>
										<Button
											size={'sm'}
											variant={'outline'}
											onClick={() => handleAddStudent(student.id)}
											disabled={
												studentsIn.filter((u) => u.id == student.id).length > 0
											}
										>
											Add
										</Button>
										<Button
											size={'sm'}
											variant={'ghost'}
											onClick={() => handleRemoveStudent(student.id)}
											disabled={!studentsIn.some((u) => u.id == student.id)}
										>
											Remove
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
