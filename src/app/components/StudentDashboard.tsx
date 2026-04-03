import { responseUserData } from '../App';
import { Button } from './ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
	GraduationCap,
	LogOut,
	BookOpen,
	FileText,
	Award,
	Calendar,
	Clock,
	CheckCircle2,
	Upload,
} from 'lucide-react';
import { Assignment, Class } from './TeacherDashboard';
import { createClient, Session } from '@supabase/supabase-js';
import StudentHeader from './student/StudentHeader';
import EnrolledClasses from './student/EnrolledClasses';
import PendingAssignment from './student/PendingAssignment';
import CompletedAssignment from './student/CompletedAssignment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import AverageGrade from './student/AverageGrade';
import AttendanceTab, { Attendance } from './student/AttendanceTab';
import StudentClasses from './student/StudentClasses';
import PendingAssignmentList, {
	Submission,
} from './student/PendingAssignmentList';
import { Mark } from './teacher/TeacherSumissionView';

interface StudentDashboardProps {
	user: responseUserData;
	session: Session;
}

export default function StudentDashboard({
	user,
	session,
}: StudentDashboardProps) {
	const [classes, setClasses] = useState<Class[]>([]);
	const [loading, setLoading] = useState(false);
	const [studentAssignments, setAssignments] = useState<Assignment[]>([]);
	const [studentSubmissions, setSubmittedAssignments] = useState<Submission[]>(
		[],
	);
	const [attendance, setAttendance] = useState<Attendance[]>([]);
	const [grades, setGrades] = useState<Mark[]>([]);

	const [key, setKey] = useState(0.09);
	useEffect(() => {
		if (!session) return;
		setLoading(true);
		const getClasses = async () => {
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes/student?user_id=${session?.user.id}`,
				)
				.then((response) => {
					if (response.status == 200) {
						setClasses(response.data);
						getAssignments();
						getAttendance();
					}
				})
				.catch((error) => {
					console.log(error);
					toast.error('Error getting classes. Try again!');
				})
				.finally(() => {
					setLoading(false);
				});
		};
		getClasses();
	}, [session, key]);

	async function getAssignments() {
		await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/assignments/student/${session?.user.id}/?user_id=${session?.user.id}`,
			)
			.then((response) => {
				setAssignments(response.data);
				getSubmitted();
			});
	}

	const getAttendance = async () => {
		await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/attendance/student/${session?.user.id}?user_id=${session?.user.id}`,
			)
			.then((response) => {
				if (response.status == 200) {
					setAttendance(response.data);
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Error getting attendance. Please try again later!');
			})
			.finally(() => {});
	};

	const getSubmitted = async () => {
		await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/submissions/my?user_id=${session?.user.id}`,
			)
			.then((response) => {
				setSubmittedAssignments(response.data);
				getGrades();
			});
	};
	const getGrades = async () => {
		await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/grades/my?user_id=${session?.user.id}`,
			)
			.then((response) => {
				setGrades(response.data);
			});
	};
	const changeKey = () => {
		setKey(Math.random());
	};

	// const studentClasses = mockClasses.filter((c) =>
	// 	mockStudents.some((s) => s.id === 's1' && s.classId === c.id)
	// );

	const completedAssignments = studentAssignments.filter((a) =>
		studentSubmissions.some((s) => s.assignment_id === a.id),
	);

	const averageGrade =
		grades.length > 0
			? Math.round(
					(grades.reduce((sum, s) => sum + Number(s.grade), 0) /
						studentAssignments.reduce(
							(sum, s) => sum + Number(s.total_points),
							0,
						)) *
						100,
				)
			: 0;
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<StudentHeader
				name={user.full_name}
				school_name={user.school_name || ''}
			/>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='space-y-6'>
					{/* Overview Cards */}
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<EnrolledClasses count={classes.length} />
						<PendingAssignment
							count={studentAssignments.length - completedAssignments.length}
						/>
						<CompletedAssignment count={completedAssignments.length} />
						<AverageGrade averageGrade={averageGrade} />
					</div>

					{/* Main Content Tabs */}
					<Tabs defaultValue='classes' className='w-full'>
						<TabsList className='grid w-full grid-cols-3'>
							<TabsTrigger value='classes'>
								<BookOpen className='hidden md:block h-4 w-4 mr-2' />
								Classes
							</TabsTrigger>
							<TabsTrigger value='attendance'>
								<Award className='hidden md:block h-4 w-4 mr-2' />
								Attendance
							</TabsTrigger>
							<TabsTrigger value='assignments'>
								<FileText className='hidden md:block h-4 w-4 mr-2' />
								Assignments
							</TabsTrigger>
						</TabsList>

						<TabsContent value='classes'>
							<StudentClasses classes={classes} />
						</TabsContent>
						<TabsContent value='attendance'>
							<AttendanceTab attendance={attendance} classes={classes} />
						</TabsContent>
						<TabsContent value='assignments' className='space-y-6'>
							<PendingAssignmentList
								submittedAssignments={studentSubmissions}
								userId={session.user.id}
								pendingAssignments={studentAssignments}
								refreshSubmitted={getSubmitted}
								classes={classes}
								grades={grades}
							/>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
