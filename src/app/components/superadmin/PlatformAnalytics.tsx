import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
	Building2,
	Users,
	BookOpen,
	TrendingUp,
	Activity,
	Award,
} from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import axios from 'axios';

interface PlatformAnalyticsData {
	total_schools: number;
	active_schools: number;
	total_users: number;
	active_users: number;
	users_by_role: {
		[key: string]: number;
	};
	total_classes: number;
	active_classes: number;
	total_attendance_records: number;
	overall_attendance_rate: number;
	recent_attendance_activity: number;
	top_schools_by_users: Array<{
		school_id: string;
		school_name: string;
		user_count: number;
	}>;
	top_schools_by_attendance: Array<{
		school_id: string;
		school_name: string;
		attendance_rate: number;
	}>;
	generated_at: string;
}

// Mock data for demonstration - replace with actual API call
const mockPlatformData: PlatformAnalyticsData = {
	total_schools: 5,
	active_schools: 4,
	total_users: 1795,
	active_users: 1622,
	users_by_role: {
		teachers: 137,
		students: 1635,
		admins: 23,
	},
	total_classes: 159,
	active_classes: 147,
	total_attendance_records: 68646,
	overall_attendance_rate: 93.8,
	recent_attendance_activity: 647,
	top_schools_by_users: [
		{ school_id: 'school-3', school_name: 'Lincoln Academy', user_count: 625 },
		{
			school_id: 'school-1',
			school_name: 'Springfield High School',
			user_count: 487,
		},
		{
			school_id: 'school-2',
			school_name: 'Riverside Elementary',
			user_count: 312,
		},
		{
			school_id: 'school-4',
			school_name: 'Washington Middle School',
			user_count: 215,
		},
		{ school_id: 'school-5', school_name: 'Oakwood Prep', user_count: 156 },
	],
	top_schools_by_attendance: [
		{
			school_id: 'school-5',
			school_name: 'Oakwood Prep',
			attendance_rate: 97.1,
		},
		{
			school_id: 'school-2',
			school_name: 'Riverside Elementary',
			attendance_rate: 96.2,
		},
		{
			school_id: 'school-1',
			school_name: 'Springfield High School',
			attendance_rate: 94.5,
		},
		{
			school_id: 'school-3',
			school_name: 'Lincoln Academy',
			attendance_rate: 92.8,
		},
		{
			school_id: 'school-4',
			school_name: 'Washington Middle School',
			attendance_rate: 88.4,
		},
	],
	generated_at: '2026-02-09T09:19:11.060Z',
};

export default function PlatformAnalytics({ user_id }: { user_id: string }) {
	const [analytics, setAnalytics] = useState<PlatformAnalyticsData | null>(
		null,
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate API call
		// In production: fetch('/superuser/analytics/platform')
		const getSchoolAnalytic = async () => {
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/superuser/analytics/platform?user_id=${user_id}`,
				)
				.then((response) => {
					setAnalytics(response.data);
				})
				.catch((e) => console.log(e));

			setLoading(false);
		};
		getSchoolAnalytic();
	}, []);

	if (loading) {
		return (
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-center py-8'>
						<div className='text-gray-500'>Loading platform analytics...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!analytics) {
		return (
			<Card>
				<CardContent className='p-6'>
					<div className='text-center py-8'>
						<p className='text-gray-500'>Analytics data not available</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const activeUserPercentage = (
		(analytics.active_users / analytics.total_users) *
		100
	).toFixed(1);
	const activeSchoolPercentage = (
		(analytics.active_schools / analytics.total_schools) *
		100
	).toFixed(1);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle className='text-2xl'>
								Platform-Wide Analytics
							</CardTitle>
							<p className='text-sm text-gray-600 mt-1'>
								Aggregated metrics across all schools
							</p>
						</div>
						<Badge variant='outline'>Read Only</Badge>
					</div>
				</CardHeader>
			</Card>

			{/* Key Metrics */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Total Schools</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{analytics.total_schools}
								</p>
								<p className='text-xs text-green-600 mt-1'>
									{analytics.active_schools} active
								</p>
							</div>
							<div className='p-3 bg-purple-100 rounded-full'>
								<Building2 className='h-6 w-6 text-purple-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Total Users</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{analytics.total_users.toLocaleString()}
								</p>
								<p className='text-xs text-green-600 mt-1'>
									{activeUserPercentage}% active
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<Users className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Total Classes</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{analytics.total_classes}
								</p>
								<p className='text-xs text-gray-600 mt-1'>
									{analytics.active_classes} active
								</p>
							</div>
							<div className='p-3 bg-green-100 rounded-full'>
								<BookOpen className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Overall Attendance</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{analytics.overall_attendance_rate}%
								</p>
							</div>
							<div className='p-3 bg-orange-100 rounded-full'>
								<TrendingUp className='h-6 w-6 text-orange-600' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Users by Role & Attendance */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{/* Users by Role */}
				<Card>
					<CardHeader>
						<CardTitle>Platform Users by Role</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{Object.entries(analytics.users_by_role).map(([role, count]) => (
								<div key={role} className='flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<div className='p-2 bg-gray-100 rounded'>
											<Users className='h-4 w-4 text-gray-600' />
										</div>
										<span className='text-sm font-medium capitalize'>
											{role}
										</span>
									</div>
									<div className='flex items-center gap-3'>
										<span className='text-lg font-semibold'>
											{count.toLocaleString()}
										</span>
										<div className='w-32 bg-gray-200 rounded-full h-2'>
											<div
												className='bg-blue-600 h-2 rounded-full'
												style={{
													width: `${(count / analytics.total_users) * 100}%`,
												}}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Attendance Activity */}
				<Card>
					<CardHeader>
						<CardTitle>Platform Attendance Metrics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
								<div className='flex items-center gap-3'>
									<Activity className='h-5 w-5 text-gray-600' />
									<span className='text-sm'>Total Records</span>
								</div>
								<span className='text-lg font-semibold'>
									{analytics.total_attendance_records.toLocaleString()}
								</span>
							</div>
							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
								<div className='flex items-center gap-3'>
									<Activity className='h-5 w-5 text-gray-600' />
									<span className='text-sm'>Recent Activity (7 days)</span>
								</div>
								<span className='text-lg font-semibold'>
									{analytics.recent_attendance_activity}
								</span>
							</div>
							<div className='flex items-center justify-between p-4 bg-green-50 rounded-lg'>
								<div className='flex items-center gap-3'>
									<TrendingUp className='h-5 w-5 text-green-600' />
									<span className='text-sm'>Overall Rate</span>
								</div>
								<span className='text-lg font-semibold text-green-600'>
									{analytics.overall_attendance_rate}%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* School Performance Leaderboards */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Top Schools by Users */}
				<Card>
					<CardHeader>
						<div className='flex items-center gap-2'>
							<Award className='h-5 w-5 text-purple-600' />
							<CardTitle>Top Schools by User Count</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Rank</TableHead>
									<TableHead>School Name</TableHead>
									<TableHead className='text-right'>Users</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{analytics.top_schools_by_users.map((school, index) => (
									<TableRow key={school.school_id}>
										<TableCell>
											<div className='flex items-center gap-2'>
												{index === 0 && <span className='text-xl'>🥇</span>}
												{index === 1 && <span className='text-xl'>🥈</span>}
												{index === 2 && <span className='text-xl'>🥉</span>}
												{index > 2 && (
													<span className='text-gray-500'>#{index + 1}</span>
												)}
											</div>
										</TableCell>
										<TableCell className='font-medium'>
											{school.school_name}
										</TableCell>
										<TableCell className='text-right font-semibold'>
											{school.user_count}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				{/* Top Schools by Attendance */}
				<Card>
					<CardHeader>
						<div className='flex items-center gap-2'>
							<Award className='h-5 w-5 text-green-600' />
							<CardTitle>Top Schools by Attendance Rate</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Rank</TableHead>
									<TableHead>School Name</TableHead>
									<TableHead className='text-right'>Rate</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{analytics.top_schools_by_attendance.map((school, index) => (
									<TableRow key={school.school_id}>
										<TableCell>
											<div className='flex items-center gap-2'>
												{index === 0 && <span className='text-xl'>🥇</span>}
												{index === 1 && <span className='text-xl'>🥈</span>}
												{index === 2 && <span className='text-xl'>🥉</span>}
												{index > 2 && (
													<span className='text-gray-500'>#{index + 1}</span>
												)}
											</div>
										</TableCell>
										<TableCell className='font-medium'>
											{school.school_name}
										</TableCell>
										<TableCell className='text-right'>
											<span className='font-semibold text-green-600'>
												{school.attendance_rate}%
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			{/* Platform Overview Stats */}
			<Card>
				<CardHeader>
					<CardTitle>Platform Health Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
						<div className='text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg'>
							<Building2 className='h-8 w-8 text-purple-600 mx-auto mb-3' />
							<p className='text-2xl font-semibold text-gray-900'>
								{activeSchoolPercentage}%
							</p>
							<p className='text-sm text-gray-600 mt-1'>School Activity Rate</p>
						</div>
						<div className='text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg'>
							<Users className='h-8 w-8 text-blue-600 mx-auto mb-3' />
							<p className='text-2xl font-semibold text-gray-900'>
								{activeUserPercentage}%
							</p>
							<p className='text-sm text-gray-600 mt-1'>User Activity Rate</p>
						</div>
						<div className='text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg'>
							<BookOpen className='h-8 w-8 text-green-600 mx-auto mb-3' />
							<p className='text-2xl font-semibold text-gray-900'>
								{(
									(analytics.active_classes / analytics.total_classes) *
									100
								).toFixed(1)}
								%
							</p>
							<p className='text-sm text-gray-600 mt-1'>Class Activity Rate</p>
						</div>
						<div className='text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg'>
							<TrendingUp className='h-8 w-8 text-orange-600 mx-auto mb-3' />
							<p className='text-2xl font-semibold text-gray-900'>
								{analytics.overall_attendance_rate}%
							</p>
							<p className='text-sm text-gray-600 mt-1'>Attendance Rate</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Metadata */}
			<Card>
				<CardContent className='p-4'>
					<p className='text-xs text-gray-500'>
						Analytics generated at:{' '}
						{new Date(analytics.generated_at).toLocaleString()}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
