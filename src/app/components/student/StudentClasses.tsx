import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Assignment, Class } from '../TeacherDashboard';
import { BookOpen } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Attendance } from './AttendanceTab';
import { Submission } from './PendingAssignmentList';

export default function StudentClasses({
	classes,
}: {
	classes: Class[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>My Classes</CardTitle>
				<CardDescription>Classes you're enrolled in</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{classes.map((classItem) => (
						<Card key={classItem.id}>
							<CardContent className='pt-6'>
								<div className='space-y-3'>
									<div className='flex items-start justify-between'>
										<div className='p-2 bg-blue-100 rounded-lg'>
											<BookOpen className='h-5 w-5 text-blue-600' />
										</div>
										<Badge>{classItem.name}</Badge>
									</div>
									<div>
										<h3 className='font-semibold text-lg'>{classItem.name}</h3>
										<p className='text-sm text-gray-600'>
											{classItem.description}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
