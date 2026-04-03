import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Class } from '../TeacherDashboard';
import { Progress } from '../ui/progress';
import {
	Calendar,
	Users,
	ClipboardCheck,
	FileText,
	TrendingUp,
} from 'lucide-react';

interface ClassOverviewProps {
	selectedClass: Class;
}

export default function ClassOverview({ selectedClass }: ClassOverviewProps) {
	// const classStudents = mockStudents.filter(s => s.classId === selectedClass.id);

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Card>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Total Students</p>
								{/* <p className="text-3xl font-semibold mt-1">{classStudents.length}</p> */}
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<Users className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Attendance Rate</p>
								<p className='text-3xl font-semibold mt-1'>94%</p>
							</div>
							<div className='p-3 bg-green-100 rounded-full'>
								<ClipboardCheck className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Active Assignments</p>
								<p className='text-3xl font-semibold mt-1'>4</p>
							</div>
							<div className='p-3 bg-purple-100 rounded-full'>
								<FileText className='h-6 w-6 text-purple-600' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>Latest updates from this class</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-start gap-3'>
								<div className='p-2 bg-green-100 rounded-full'>
									<ClipboardCheck className='h-4 w-4 text-green-600' />
								</div>
								<div>
									<p className='text-sm font-medium'>
										Attendance marked for today
									</p>
									<p className='text-xs text-gray-600'>2 hours ago</p>
								</div>
							</div>
							<div className='flex items-start gap-3'>
								<div className='p-2 bg-blue-100 rounded-full'>
									<FileText className='h-4 w-4 text-blue-600' />
								</div>
								<div>
									<p className='text-sm font-medium'>New assignment created</p>
									<p className='text-xs text-gray-600'>1 day ago</p>
								</div>
							</div>
							<div className='flex items-start gap-3'>
								<div className='p-2 bg-purple-100 rounded-full'>
									<TrendingUp className='h-4 w-4 text-purple-600' />
								</div>
								<div>
									<p className='text-sm font-medium'>
										Class average improved by 8%
									</p>
									<p className='text-xs text-gray-600'>3 days ago</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Performance Overview</CardTitle>
						<CardDescription>Class performance metrics</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div>
								<div className='flex items-center justify-between mb-2'>
									<span className='text-sm font-medium'>
										Assignment Completion
									</span>
									<span className='text-sm text-gray-600'>87%</span>
								</div>
								<Progress value={87} />
							</div>
							<div>
								<div className='flex items-center justify-between mb-2'>
									<span className='text-sm font-medium'>Average Grade</span>
									<span className='text-sm text-gray-600'>82%</span>
								</div>
								<Progress value={82} />
							</div>
							<div>
								<div className='flex items-center justify-between mb-2'>
									<span className='text-sm font-medium'>Attendance Rate</span>
									<span className='text-sm text-gray-600'>94%</span>
								</div>
								<Progress value={94} />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Upcoming Schedule</CardTitle>
					<CardDescription>This week's classes and deadlines</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						<div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
							<Calendar className='h-5 w-5 text-blue-600' />
							<div>
								<p className='font-medium text-sm'>Class Session</p>
								<p className='text-xs text-gray-600'>
									Wednesday, Jan 8 • 10:00 AM - 11:30 AM
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-3 bg-purple-50 rounded-lg'>
							<FileText className='h-5 w-5 text-purple-600' />
							<div>
								<p className='font-medium text-sm'>
									Assignment Due: Chapter 5 Quiz
								</p>
								<p className='text-xs text-gray-600'>
									Friday, Jan 10 • 11:59 PM
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
							<Calendar className='h-5 w-5 text-blue-600' />
							<div>
								<p className='font-medium text-sm'>Class Session</p>
								<p className='text-xs text-gray-600'>
									Friday, Jan 10 • 10:00 AM - 11:30 AM
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
