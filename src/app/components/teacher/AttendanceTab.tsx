import { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Class, Student } from '../TeacherDashboard';
import { Calendar, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { mockStudents } from './TeacherDashboardContent';
import axios from 'axios';
import { Session } from '@supabase/supabase-js';

interface AttendanceTabProps {
	selectedClass: Class;
	classStudents: Student[];
	session: Session;
}

type AttendanceHistory = {
	id: string;
	class_id: string;
	student_id: string;
	date: string;
	status: boolean;
	marked_by: string;
	created_at: string;
	students: any[];
};
type AttendanceRecord = {
	class_id: string;
	student_id: string;
	date: string;
	status: boolean;
};
export default function AttendanceTab({
	selectedClass,
	classStudents,
	session,
}: AttendanceTabProps) {
	const today = new Date().toISOString().split('T')[0];

	const [attendanceRecords, setAttendanceRecords] = useState<
		AttendanceRecord[]
	>(() => {
		// Initialize all as present
		const initial: AttendanceRecord[] = [];
		classStudents.forEach((student) => {
			initial.push({
				class_id: selectedClass.id,
				date: today,
				status: true,
				student_id: student.id,
			});
		});
		return initial;
	});

	const [attendanceHistory, setAttendaceHistory] = useState<
		AttendanceHistory[]
	>([]);

	const [key, setKey] = useState(0.2);
	const [markedToday, setMarkedToday] = useState(false);

	const handleToggleAttendance = (studentId: string) => {
		const filtered = attendanceRecords.map((student) => {
			if (student.student_id == studentId) {
				return { ...student, status: !student.status };
			}
			return student;
		});
		// console.log(filtered);
		setAttendanceRecords(filtered);
	};

	useEffect(() => {
		const getAttendance = async () => {
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/attendance/class/${selectedClass.id}?user_id=${session?.user.id}`,
				)
				.then((response) => {
					setAttendaceHistory(response.data);
					// console.log(response.data);
					response.data.forEach((attendance: any) => {
						if (attendance.date == today) {
							toast('Attendace has been marked for today');
							setMarkedToday(true);
							setAttendanceRecords(attendance.students);
						}
					});
				})
				.catch((response) => {
					toast.error('Unable to get attendance history');
					console.log(response);
				});
		};
		getAttendance();
	}, [key]);

	const handleSaveAttendance = async () => {
		// In a real app, this would save to the backend
		await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/attendance/bulk?user_id=${session?.user.id}`,
				{ attendances: attendanceRecords },
			)
			.then(() => {
				// console.log(attendanceRecords);
				toast.success('Attendance saved successfully!', {
					description: `Recorded for ${classStudents.length} students`,
				});
				setKey(Math.random());
			})
			.catch((response) => {
				toast.error('Unable to save attendance!');
				console.log(response);
			});
	};

	const presentCount = attendanceRecords.filter(
		(record) => record.status == true,
	).length;
	const absentCount = classStudents.length - presentCount;
	const attendanceRate = isNaN(
		Math.round((presentCount / classStudents.length) * 100),
	)
		? 0
		: Math.round((presentCount / classStudents.length) * 100);

	return (
		<div className='space-y-6'>
			{/* Attendance Summary */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4' key={key}>
				<Card>
					<CardContent className='pt-6'>
						<div className='text-center'>
							<p className='text-sm text-gray-600'>Total Students</p>
							<p className='text-3xl font-semibold mt-1'>
								{classStudents.length}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='pt-6'>
						<div className='text-center'>
							<p className='text-sm text-gray-600'>Present</p>
							<p className='text-3xl font-semibold mt-1 text-green-600'>
								{presentCount}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='pt-6'>
						<div className='text-center'>
							<p className='text-sm text-gray-600'>Absent</p>
							<p className='text-3xl font-semibold mt-1 text-red-600'>
								{absentCount}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='pt-6'>
						<div className='text-center'>
							<p className='text-sm text-gray-600'>Attendance Rate</p>
							<p className='text-3xl font-semibold mt-1 text-blue-600'>
								{attendanceRate}%
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Attendance Marking */}
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle>Mark Attendance</CardTitle>
							<CardDescription className='flex items-center gap-2 mt-2'>
								<Calendar className='h-4 w-4' />
								{new Date(today).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</CardDescription>
						</div>
						<div className='flex items-center gap-2'>
							{markedToday ? (
								<Badge
									variant='outline'
									className='bg-green-50 text-green-700 border-green-200'
								>
									<CheckCircle2 className='h-3 w-3 mr-1' />
									Attendance Has Been Marked Today
								</Badge>
							) : (
								<Button onClick={handleSaveAttendance}>
									<Save className='h-4 w-4 mr-2' />
									Save Attendance
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-2'>
						{classStudents.map((student) => (
							<div
								key={student.id}
								className={`flex items-center justify-between flex-wrap space-y-4 p-4 rounded-lg border transition-colors ${
									attendanceRecords.find(
										(user) => user.student_id == student.id,
									)?.status
										? 'bg-green-50 border-green-200'
										: 'bg-red-50 border-red-200'
								}`}
							>
								<div className='flex items-center gap-3'>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
											attendanceRecords.find(
												(user) => user.student_id == student.id,
											)?.status
												? 'bg-green-600'
												: 'bg-red-600'
										}`}
									>
										{student.full_name.charAt(0)}
									</div>
									<div>
										<p className='font-medium'>{student.full_name}</p>
										<p className='text-sm text-gray-600'>{student.email}</p>
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<Badge
										variant={
											attendanceRecords.find(
												(user) => user.student_id == student.id,
											)?.status
												? 'default'
												: 'destructive'
										}
									>
										{attendanceRecords.find(
											(user) => user.student_id == student.id,
										)?.status
											? 'Present'
											: 'Absent'}
									</Badge>
									<Checkbox
										checked={
											attendanceRecords.find(
												(user) => user.student_id == student.id,
											)?.status
										}
										onCheckedChange={() => handleToggleAttendance(student.id)}
										disabled={markedToday}
									/>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Attendance History */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Attendance History</CardTitle>
					<CardDescription>Last 7 days of attendance records</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						{attendanceHistory.map((attendance, index) => {
							return (
								<div
									key={index}
									className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
								>
									<div className='flex items-center gap-3'>
										<Calendar className='h-5 w-5 text-gray-600' />
										<div>
											<p className='font-medium text-sm'>
												{new Date(attendance.date).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</p>
											<p className='text-xs text-gray-600'>
												{/* {rate}% attendance rate */}
											</p>
										</div>
									</div>
									<Badge variant='outline'>
										{
											attendance.students.filter(
												(student) => student.status == true,
											).length
										}{' '}
										/ {attendance.students.length}
									</Badge>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
