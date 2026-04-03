import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Student } from '../TeacherDashboard';
import { Badge } from '../ui/badge';
import { Trash } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function StudentsTab({
	students,
	staff_id,
	class_id,
}: {
	students: Student[];
	staff_id: string;
	class_id: string;
}) {
	const [currStudents, setCurrstudents] = useState(students);
	const [key, setKey] = useState(0.44);
	const handleKeyChange = () => {
		setKey(Math.random());
	};
	const handleRemoveStudent = async (student_id: string) => {
		await axios
			.delete(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes/${class_id}/students/${student_id}?user_id=${staff_id}`,
			)
			.then((response) => {
				const filstudents = students.filter(
					(student) => student.id !== student_id,
				);
				setCurrstudents(filstudents);
				toast.success('Student removed from class');
				handleKeyChange();
			})
			.catch((e) => {
				console.log('Error adding user', e);
				toast.error('Could not be removed from class');
			});
	};
	return (
		<Card key={key}>
			<CardHeader>
				<CardTitle>Students</CardTitle>
				<CardDescription>List of all students in this class</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-2'>
					{currStudents.map((student, index) => (
						<div
							key={student.id}
							className='flex items-center justify-between flex-wrap space-y-3 p-3 bg-gray-50 rounded-lg'
						>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold'>
									{student.full_name.charAt(0)}
								</div>
								<div>
									<p className='font-medium'>{student.full_name}</p>
									<p className='text-sm text-gray-600'>{student.email}</p>
								</div>
							</div>
							<div className='flex  gap-3'>
								<Badge variant='outline'>Student #{index + 1}</Badge>
								<Trash
									className='size-5 opacity-50 hover:opacity-100 cursor-pointer'
									onClick={() => handleRemoveStudent(student.id)}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
