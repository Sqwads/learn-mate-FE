import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { Award, ClipboardCheck, FileText, Loader2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Class, Student } from '../TeacherDashboard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ClassItemCard from './ClassItemCard';
import TotalClasses from './TotalClasses';
import TotalStudents from './TotalStudents';
import StudentsTab from './StudentsTab';
import AttendanceTab from './AttendanceTab';
import AssignmentsTab from './AssignmentsTab';

export const mockStudents: Student[] = [
	// Class 1 students
	{ id: 's1', full_name: 'Alex Smith', email: 'alex@student.com' },
	{ id: 's2', full_name: 'Emma Davis', email: 'emma@student.com' },
];

export default function TeacherDashboardContent({
	session,
}: {
	session: Session;
}) {
	const [selectedClass, setSelectedClass] = useState<Class | null>(null);
	const [classes, setClasses] = useState<Class[]>([]);
	const [loading, setLoading] = useState(false);
	const [key, setKey] = useState(0.44);
	const handleKeyChange = () => {
		setKey(Math.random());
	};
	const handleSelected = (classItem: Class) => {
		setSelectedClass(classItem);
	};

	useEffect(() => {
		if (!session) return;
		setLoading(true);
		const getClasses = async () => {
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes/?user_id=${session?.user.id}`,
				)
				.then((response) => {
					// console.log(response.data);
					if (response.status == 200) {
						setClasses(response.data);
						// handleCount(response.data.length);
					}
				})
				.catch(() => {
					toast.error('Error getting classes. Try again!');
				})
				.finally(() => {
					setLoading(false);
				});
		};
		getClasses();
	}, [session, key]);

	return (
		<div key={key}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{loading && (
					<div className='fixed top-0 left-0 h-screen w-full z-20 backdrop-blur-sm flex items-center justify-center'>
						<Loader2 className='animate-spin size-6 ' />
					</div>
				)}
				{!selectedClass ? (
					<div className='space-y-6'>
						{/* Overview Cards */}
						<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
							<div />
							<TotalClasses count={classes.length} />
							<TotalStudents
								count={classes.reduce((accum, singleclass) => {
									return accum + singleclass.students.length;
								}, 0)}
							/>
							<div />
						</div>

						{/* Classes List */}
						<Card>
							<CardHeader>
								<CardTitle>My Classes</CardTitle>
								<CardDescription>
									Select a class to manage attendance, assignments, and grades
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
									{classes.map((classItem) => (
										<ClassItemCard
											key={classItem.id}
											classItem={classItem}
											onSelect={handleSelected}
										/>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				) : (
					<div className='space-y-6'>
						{/* Back button and class header */}
						<div className='flex items-center justify-between'>
							<div>
								<Button
									variant='outline'
									onClick={() => {
										setSelectedClass(null);
										handleKeyChange();
									}}
								>
									← Back to Classes
								</Button>
								<h2 className='text-2xl font-semibold mt-4'>
									{selectedClass.name}
								</h2>
								<p className='text-gray-600'>
									{selectedClass.description} • {selectedClass.name}
								</p>
							</div>
						</div>

						{/* Class Management Tabs */}
						<Tabs defaultValue='students' className='w-full'>
							<TabsList className='grid w-full grid-cols-3'>
								{/* <TabsTrigger value='overview'>
									<BookOpen className='h-4 w-4 mr-2' />
									Overview
								</TabsTrigger> */}
								<TabsTrigger value='students'>
									<Users className='hidden md:block h-4 w-4 mr-2' />
									Students
								</TabsTrigger>{' '}
								<TabsTrigger value='attendance'>
									<ClipboardCheck className='hidden md:block h-4 w-4 mr-2' />
									Attendance
								</TabsTrigger>
								<TabsTrigger value='assignments'>
									<FileText className='hidden md:block h-4 w-4 mr-2' />
									Assignments
								</TabsTrigger>
							</TabsList>

							{/* <TabsContent value='overview'>
								<ClassOverview selectedClass={selectedClass} />
							</TabsContent> */}
							<TabsContent value='students'>
								<StudentsTab
									students={selectedClass.students}
									class_id={selectedClass.id}
									staff_id={selectedClass.teacher_id}
								/>
							</TabsContent>

							<TabsContent value='attendance'>
								<AttendanceTab
									selectedClass={selectedClass}
									classStudents={selectedClass.students}
									session={session}
								/>
							</TabsContent>

							<TabsContent value='assignments'>
								<AssignmentsTab
									selectedClass={selectedClass}
									teacher_id={session.user.id}
								/>
							</TabsContent>
						</Tabs>
					</div>
				)}
			</div>
		</div>
	);
}
