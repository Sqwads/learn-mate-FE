import React, { useEffect, useState } from 'react';
import { TabsContent } from '../ui/tabs';
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
import { Button } from '../ui/button';
import { BookOpen, Plus, School, School2, Trash, Users } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../App';
import { Badge } from '../ui/badge';
import { Class } from '../TeacherDashboard';
import AddStudentToClassDialog from './AddStudentToClassDialog';
import UpdateClassDialog from './UpdateClassDialog';

export type Student = {
	id: string;
	email: string;
	full_name: string;
};
export type Classes = {
	id: string;
	name: string;
	description: string;
	teacher_id: string;
	students: Student[];
	created_at: number;
};
export default function ClassesTabContent({
	teachers,
	session,
	handleCount,
	students,
	schoolId,
	schoolName,
}: {
	teachers: any[];
	session: Session;
	handleCount: (value: number) => void;
	students: any[];
	schoolId: string;
	schoolName: string;
}) {
	const [isCreateClassDialogOpen, setIsCreateClassDialogOpen] = useState(false);
	const [newClass, setNewClass] = useState({
		name: '',
		subject: '',
		teacher_id: '',
	});
	const [classes, setClasses] = useState<Classes[]>([]);
	const [key, setChangeKey] = useState(0.001);
	const [teacherNames, setTeacherNames] = useState<Record<string, string>>({});

	const handleChangeKey = () => {
		setChangeKey((prev) => prev + 1);
	};

	useEffect(() => {
		if (!session) return;
		const getClasses = async () => {
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes/?user_id=${session?.user.id}&role=admin`,
				)
				.then((response) => {
					// console.log(response.data);
					if (response.status == 200) {
						setClasses(response.data);
						handleCount(response.data.length);
					}
				});
		};
		getClasses();
	}, [session, key]);

	const fetchTeacherName = async (id: string) => {
		// If we already have the name, don't fetch it again
		if (teacherNames[id]) return;

		try {
			const response = await axios.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/auth/me?user_id=${id}`,
			);
			const fullName = response.data.full_name;

			setTeacherNames((prev) => ({
				...prev,
				[id]: fullName,
			}));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (classes.length > 0) {
			classes.forEach((classItem) => {
				if (classItem.teacher_id) {
					fetchTeacherName(classItem.teacher_id);
				}
			});
		}
	}, [classes]);

	const handleCreateClass = async () => {
		if (!newClass.name || !newClass.subject || !newClass.teacher_id) {
			toast.error('Please fill in all required fields');
			return;
		}

		await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes?user_id=${session?.user.id}`,
				{
					name: newClass.name,
					description: newClass.subject,
					teacher_id: newClass.teacher_id,
					schoolId,
					school_name: schoolName,
				},
			)
			.then(() => {
				toast.success('Class created successfully!');
				handleChangeKey();
			})
			.catch((e) => {
				toast.error('Couldnt create class. Try again.');
				console.log(e);
			});
		setIsCreateClassDialogOpen(false);
		setNewClass({ name: '', subject: '', teacher_id: '' });
	};

	const handleDelete = async (id: string) => {
		await axios
			.delete(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes/${id}/?user_id=${session?.user.id}`,
			)
			.then(() => {
				handleChangeKey();
				toast.success('Class removed');
			})
			.catch((e) => {
				toast.error('Error removing class');
				console.log(e);
			});
	};

	return (
		<TabsContent value='classes' className='space-y-6'>
			<Card key={key}>
				<CardHeader>
					<div className='flex flex-col md:flex-row space-y-4 md:items-center justify-between'>
						<div>
							<CardTitle>Class Management</CardTitle>
							<CardDescription>Create and manage classes</CardDescription>
						</div>
						<Dialog
							open={isCreateClassDialogOpen}
							onOpenChange={setIsCreateClassDialogOpen}
						>
							<DialogTrigger asChild>
								<Button>
									<School className='h-4 w-4 mr-2' />
									Create Class
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Create New Class</DialogTitle>
									<DialogDescription>
										Add a new class to the platform
									</DialogDescription>
								</DialogHeader>
								<div className='space-y-4 mt-4'>
									<div className='space-y-2'>
										<Label htmlFor='className'>Class Name *</Label>
										<Input
											id='className'
											placeholder='e.g., SS2, JSS3, Primary 5'
											value={newClass.name}
											onChange={(e) =>
												setNewClass({
													...newClass,
													name: e.target.value,
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='classSubject'>Subject *</Label>
										<Input
											id='classSubject'
											placeholder='e.g., Mathematics'
											value={newClass.subject}
											onChange={(e) =>
												setNewClass({
													...newClass,
													subject: e.target.value,
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='classGrade'>Teacher *</Label>
										<Select
											value={newClass.teacher_id}
											onValueChange={(value) =>
												setNewClass({ ...newClass, teacher_id: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder='Select teacher' />
											</SelectTrigger>
											<SelectContent>
												{teachers.map((teacher) => (
													<SelectItem value={teacher.id} key={teacher.id}>
														{teacher.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className='flex justify-end gap-2 pt-4'>
										<Button
											variant='outline'
											onClick={() => setIsCreateClassDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button onClick={handleCreateClass}>Create Class</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					{classes.length == 0 && (
						<div className='flex flex-col items-center justify-center space-y-3'>
							<School2 className='size-14 text-neutral-400' />
							<p className='text-xl font-medium'>No Classes Found</p>
							<p className='max-w-lg text-center'>
								Use the button above to add a new class to your school&apos;s
								curriculum.
							</p>
						</div>
					)}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{classes
							.sort(
								(a, b) =>
									(new Date(b.created_at) as any) -
									(new Date(a.created_at) as any),
							)
							.map((classItem) => (
								<Card key={classItem.id}>
									<CardContent className='pt-6 group'>
										<div className='space-y-3'>
											<div className='flex items-start justify-between'>
												<div className='p-2 bg-blue-100 rounded-lg'>
													<BookOpen className='h-5 w-5 text-blue-600' />
												</div>
												<Badge>{classItem.name}</Badge>
											</div>
											<div>
												<h3 className='font-semibold text-lg'>
													{classItem.name}
												</h3>
												<p className='text-sm text-gray-600'>
													{classItem.description}
												</p>
											</div>
											<p className='text-sm'>
												Teacher:{' '}
												{teacherNames[classItem.teacher_id] ||
													'Loading teacher...'}
											</p>
											<div className='flex items-center justify-between '>
												<div className='flex items-center gap-2 text-sm text-gray-600'>
													<Users className='h-4 w-4' />
													<span>{classItem.students.length}</span>
													<AddStudentToClassDialog
														key={`${classItem.id} - ${classItem.students.toString()}`}
														admin_id={session.user.id}
														id={classItem.id}
														description={classItem.description}
														name={classItem.name}
														enrolledStudents={classItem.students}
														students={students}
														onChange={handleChangeKey}
													/>
												</div>
												<div className='flex gap-3'>
													<UpdateClassDialog
														key={`${classItem.id}-${classItem.name}-${classItem.description}`}
														classId={classItem.id}
														onChange={handleChangeKey}
														session={session}
														teachers={teachers}
														classItem={classItem}
													/>
													<Button
														variant={'outline'}
														onClick={() => handleDelete(classItem.id)}
													>
														<Trash className='size-4  cursor-pointer text-black' />
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	);
}
