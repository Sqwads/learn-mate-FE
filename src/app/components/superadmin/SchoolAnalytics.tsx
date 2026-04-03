import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
	ArrowLeft,
	Users,
	BookOpen,
	Calendar,
	TrendingUp,
	Activity,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import axios from 'axios';

interface SchoolAnalyticsProps {
	schoolId: string;
	onBack: () => void;
	user_id: string;
}

interface SchoolAnalyticsData {
	school_id: string;
	school_name: string;
	total_users: number;
	active_users: number;
	users_by_role: {
		[key: string]: number;
	};
	total_classes: number;
	active_classes: number;
	total_attendance_records: number;
	attendance_rate: number;
	recent_attendance_activity: number;
	generated_at: string;
}

// Mock data for demonstration - replace with actual API call
export default function SchoolAnalytics({
	schoolId,
	onBack,
	user_id,
}: SchoolAnalyticsProps) {
	const [analytics, setAnalytics] = useState<SchoolAnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate API call
		// In production: fetch(`/superuser/school/${schoolId}/analytics`)
		setLoading(true);
		const getSchoolAnalytic = async () => {
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/superuser/schools/${schoolId}/analytics?user_id=${user_id}`,
				)
				.then((response) => {
					setAnalytics(response.data);
				})
				.catch((e) => console.log(e));

			setLoading(false);
		};
		getSchoolAnalytic();
	}, [schoolId]);

	if (loading) {
		return (
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-center py-8'>
						<div className='text-gray-500'>Loading analytics...</div>
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
						<Button variant='outline' onClick={onBack} className='mt-4'>
							Go Back
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	const activeUserPercentage = (
		(analytics.active_users / analytics.total_users) *
		100
	).toFixed(1);
	const activeClassPercentage = (
		(analytics.active_classes / analytics.total_classes) *
		100
	).toFixed(1);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<Button variant='ghost' size='sm' onClick={onBack}>
								<ArrowLeft className='h-4 w-4' />
							</Button>
							<div>
								<CardTitle className='text-2xl'>
									{analytics.school_name}
								</CardTitle>
								<p className='text-sm text-gray-600 mt-1'>
									School Analytics Dashboard
								</p>
							</div>
						</div>
						<Badge variant='outline'>Read Only</Badge>
					</div>
				</CardHeader>
			</Card>

			{/* Users Overview */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Total Users</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{analytics.total_users}
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
								<p className='text-sm text-gray-600'>Active Users</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{analytics.active_users}
								</p>
								<p className='text-xs text-green-600 mt-1'>
									{activeUserPercentage}% active
								</p>
							</div>
							<div className='p-3 bg-green-100 rounded-full'>
								<Activity className='h-6 w-6 text-green-600' />
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
							<div className='p-3 bg-purple-100 rounded-full'>
								<BookOpen className='h-6 w-6 text-purple-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Attendance Rate</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{analytics.attendance_rate}%
								</p>
							</div>
							<div className='p-3 bg-orange-100 rounded-full'>
								<TrendingUp className='h-6 w-6 text-orange-600' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Stats */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{/* Users by Role */}
				<Card>
					<CardHeader>
						<CardTitle>Users by Role</CardTitle>
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
										<span className='text-lg font-semibold'>{count}</span>
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
						<CardTitle>Attendance Metrics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
								<div className='flex items-center gap-3'>
									<Calendar className='h-5 w-5 text-gray-600' />
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
									<span className='text-sm'>Attendance Rate</span>
								</div>
								<span className='text-lg font-semibold text-green-600'>
									{analytics.attendance_rate}%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Classes Overview */}
			<Card>
				<CardHeader>
					<CardTitle>Classes Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg'>
							<BookOpen className='h-8 w-8 text-blue-600 mx-auto mb-3' />
							<p className='text-2xl font-semibold text-gray-900'>
								{analytics.total_classes}
							</p>
							<p className='text-sm text-gray-600 mt-1'>Total Classes</p>
						</div>
						<div className='text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg'>
							<Activity className='h-8 w-8 text-green-600 mx-auto mb-3' />
							<p className='text-2xl font-semibold text-gray-900'>
								{analytics.active_classes}
							</p>
							<p className='text-sm text-gray-600 mt-1'>Active Classes</p>
						</div>
						<div className='text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg'>
							<BookOpen className='h-8 w-8 text-gray-600 mx-auto mb-3' />
							<p className='text-2xl font-semibold text-gray-900'>
								{analytics.total_classes - analytics.active_classes}
							</p>
							<p className='text-sm text-gray-600 mt-1'>Inactive Classes</p>
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
