import { useEffect, useState } from 'react';
// import { User } from '../App';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import {
	Award,
	BarChart3,
	BookOpen,
	ClipboardCheck,
	FileText,
	TrendingUp,
	Users,
} from 'lucide-react';
import { responseUserData } from '../App';
import AdminHeader from './admin/AdminHeader';
import ClassesTabContent from './admin/ClassesTabContent';
import StudentCountCard from './admin/StudentCountCard';
import TeacherCountCard from './admin/TeacherCountCard';
import TotalClasses from './admin/TotalClasses';
import TotalUserCard from './admin/TotalUserCard';
import UsersTabContent from './admin/UsersTabContent';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AdminAnalytics from './admin/AdminAnalytics';

interface AdminDashboardProps {
	user: responseUserData;
	session: Session;
}

export interface SystemUser {
	id: string;
	full_name: string;
	email: string;
	role: string;
	created_at: string;
	updatedAt: string;
	firstName?: string;
	lastName?: string;
	schoolId: string;
	schoolName: string;
}

export interface MAU {
	'school_id': string;
	'school_name': string;
	'month': number;
	'year': number;
	'month_name': string;
	'period': string;
	'total_mau': number;
	'active_teachers': number;
	'active_students': number;
	'active_admins': number;
	'breakdown': {
		'teachers': number;
		'students': number;
		'admins': number;
	};
}

export interface FeatureUsage {
	'school_id': string;
	'school_name': string;
	'attendance_records_count': number;
	'assignments_created_count': number;
	'submissions_count': number;
	'grades_entered_count': number;
	'total_feature_interactions': number;
}
export default function AdminDashboard({ user, session }: AdminDashboardProps) {
	const [users, setUsers] = useState<SystemUser[]>([]);
	const [key, setChangeKey] = useState(0.001);
	const [classCount, setClassCount] = useState(0);
	const [mau, setMau] = useState<MAU>();
	const [featureUsage, setFeatureUsage] = useState<FeatureUsage>();
	useEffect(() => {
		const getUsers = async () => {
			await axios
				.get(
					'https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/admin/users',
					{
						params: {
							user_id: session.user.id,
						},
					},
				)
				.then(function (response) {
					if (response.status == 200) {
						const filtered = response.data
							.filter((u: { role: string }) => u.role !== 'admin')
							.sort(
								(
									a: { created_at: string | number | Date },
									b: { created_at: string | number | Date },
								) =>
									(new Date(b.created_at) as any) -
									(new Date(a.created_at) as any),
							);
						// console.log(filtered);
						setUsers(filtered);
					}
					getAnalytics();
					getFeatureUsage();
				})
				.catch(function (error) {
					console.log(error);
				});
		};
		getUsers();
	}, [key]);

	const handleChangeKey = () => {
		setChangeKey(Math.random());
	};
	const handleSetCount = (value: number) => {
		setClassCount(value);
	};
	const totalTeachers = users.filter((u) => u.role === 'teacher').length;
	const totalStudents = users.filter((u) => u.role === 'student').length;
	const totalUsers = users.length;

	const getAnalytics = async () => {
		await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/admin/schools/${user.school_id}/analytics/mau?admin_id=${session.user.id}`,
			)
			.then((response) => setMau(response.data));
	};
	const getFeatureUsage = async () => {
		await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/admin/schools/${user.school_id}/analytics/feature-usage?admin_id=${session.user.id}`,
			)
			.then((response) => setFeatureUsage(response.data));
	};
	return (
		<div className='min-h-screen bg-gray-50' key={key}>
			<AdminHeader user={user} />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='space-y-6'>
					{/* Overview Cards */}
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<TotalUserCard count={totalUsers} />
						<TeacherCountCard count={totalTeachers} />
						<StudentCountCard count={totalStudents} />
						<TotalClasses count={classCount} />
					</div>

					{/* Main Content Tabs */}
					<Tabs defaultValue='users' className='w-full'>
						<TabsList className='grid w-full grid-cols-3'>
							<TabsTrigger value='users'>
								<Users className='h-4 w-4 mr-2 hidden md:block' />
								Users
							</TabsTrigger>
							<TabsTrigger value='classes'>
								<BookOpen className='h-4 w-4 mr-2 hidden md:block' />
								Classes
							</TabsTrigger>
							<TabsTrigger value='analytics'>
								<BarChart3 className='h-4 w-4 mr-2 hidden md:block' />
								Analytics
							</TabsTrigger>
						</TabsList>

						<UsersTabContent
							session={session}
							users={users}
							onChange={handleChangeKey}
							schoolId={user.school_id || ''}
							schoolName={user.school_name || ''}
						/>

						<ClassesTabContent
							teachers={users
								.filter((u) => u.role == 'teacher')
								.map((u) => ({ id: u.id, name: u.full_name }))}
							session={session}
							handleCount={handleSetCount}
							students={users
								.filter((u) => u.role == 'student')
								.map((u) => ({ id: u.id, name: u.full_name }))}
							schoolId={user.school_id || ''}
							schoolName={user.school_name || ''}
						/>

						<TabsContent value='analytics' className='space-y-6'>
							<AdminAnalytics
								mau={mau}
								featureUsage={featureUsage}
								school_id={user.school_id || ''}
								user_id={session.user.id}
							/>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
