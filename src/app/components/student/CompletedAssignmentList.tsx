import React from 'react';
import { Assignment } from '../TeacherDashboard';
import { Badge } from '../ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';

export default function CompletedAssignmentList({
	completedAssignments,
}: {
	completedAssignments: Assignment[];
}) {
	return (
		<div className='space-y-3'>
			{completedAssignments.map((assignment) => {
				const hasGrade = false;

				return null;
				<div key={assignment.id} className='p-4 rounded-lg bg-gray-50'>
					<div className='flex items-start justify-between'>
						<div className='flex-1'>
							<div className='flex items-center gap-2 mb-1'>
								<h3 className='font-semibold'>{assignment.title}</h3>
								{hasGrade ? (
									<Badge className='bg-green-600'>
										<CheckCircle2 className='h-3 w-3 mr-1' />
										Graded
									</Badge>
								) : (
									<Badge variant='secondary'>
										<Clock className='h-3 w-3 mr-1' />
										Pending Review
									</Badge>
								)}
							</div>
							<p className='text-sm text-gray-600 mb-2'>
								{assignment.description}
							</p>
							<Badge variant='outline' className='text-xs'>
								{assignment.title}
							</Badge>
						</div>
						{hasGrade && (
							<div className='text-right'>
								<p className='text-2xl font-semibold text-green-600'>
									{/* {submission.grade}/{assignment.totalPoints} */}
								</p>
								<p className='text-sm text-gray-600'>
									{/* {Math.round(
										(submission.grade /
											assignment.totalPoints) *
											100
									)} */}
									%
								</p>
							</div>
						)}
					</div>
				</div>;
			})}
		</div>
	);
}
