import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import {
	Award,
	ClipboardCheck,
	FileText,
	GraduationCap,
	User,
} from 'lucide-react';
import { FeatureUsage, MAU } from '../AdminDashboard';
import MonthlyActives from './MonthlyActives';

export default function AdminAnalytics({
	mau,
	featureUsage,
	user_id,
	school_id,
}: {
	mau?: MAU;
	featureUsage?: FeatureUsage;
	school_id: string;
	user_id: string;
}) {
	return (
		<div className='space-y-6'>
			{/* Feature Usage Stats */}
			<Card>
				<CardHeader>
					<CardTitle>Platform Activity</CardTitle>
					<CardDescription>
						Feature usage statistics for this month
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2  gap-4'>
						<div className='p-4 bg-blue-50 rounded-lg'>
							<div className='flex items-center gap-2 mb-2'>
								<ClipboardCheck className='h-5 w-5 text-blue-600' />
								<p className='text-sm font-medium text-gray-700'>
									Attendance Records
								</p>
							</div>
							<p className='text-2xl font-semibold text-blue-600'>
								{featureUsage?.attendance_records_count}
							</p>
						</div>

						<div className='p-4 bg-green-50 rounded-lg'>
							<div className='flex items-center gap-2 mb-2'>
								<FileText className='h-5 w-5 text-green-600' />
								<p className='text-sm font-medium text-gray-700'>
									Assignments Created
								</p>
							</div>

							<p className='text-2xl font-semibold text-green-600'>
								{featureUsage?.assignments_created_count}
							</p>
						</div>

						<div className='p-4 bg-purple-50 rounded-lg'>
							<div className='flex items-center gap-2 mb-2'>
								<FileText className='h-5 w-5 text-purple-600' />
								<p className='text-sm font-medium text-gray-700'>Submissions</p>
							</div>
							<p className='text-2xl font-semibold text-purple-600'>
								{featureUsage?.submissions_count}
							</p>
						</div>

						<div className='p-4 bg-orange-50 rounded-lg'>
							<div className='flex items-center gap-2 mb-2'>
								<Award className='h-5 w-5 text-orange-600' />
								<p className='text-sm font-medium text-gray-700'>
									Grades Entered
								</p>
							</div>
							<p className='text-2xl font-semibold text-orange-600'>
								{featureUsage?.grades_entered_count}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Monthly Active Users */}
			<MonthlyActives mau={mau} school_id={school_id} user_id={user_id} />

			{/* Quick Stats */}
			<div className='grid-cols-1 gap-4 hidden'>
				<Card>
					<CardHeader>
						<CardTitle>System Overview</CardTitle>
						<CardDescription>Platform statistics</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
								<span className='text-sm'>Total Classes</span>
								<span className='text-lg font-semibold'>
									{/* {mockClasses.length} */}
								</span>
							</div>
							<div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
								<span className='text-sm'>Avg Class Size</span>
								<span className='text-lg font-semibold'>24 students</span>
							</div>
							<div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
								<span className='text-sm'>Platform Uptime</span>
								<span className='text-lg font-semibold text-green-600'>
									99.9%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
