import React from 'react';
import { Submission } from '../TeacherDashboard';

export default function AssignmentSubmissions({
	submissions,
}: {
	submissions: Submission[];
}) {
	return (
		<div>
			{submissions.map((student) => {
				const submission = mockSubmissions.find(
					(s) =>
						s.assignmentId === selectedAssignment.id &&
						s.studentId === student.id,
				);

				return (
					<div
						key={student.id}
						className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
					>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold'>
								{/* {student.name.charAt(0)} */}
							</div>
							<div>
								{/* <p className='font-medium'>{student.name}</p> */}
								<p className='text-sm text-gray-600'>{/* {student.email} */}</p>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							{submission ? (
								<>
									{submission.grade !== undefined ? (
										<Badge className='bg-green-600'>
											<CheckCircle2 className='h-3 w-3 mr-1' />
											Graded: {submission.grade}/
											{selectedAssignment.total_points}
										</Badge>
									) : (
										<Badge variant='secondary'>
											<Clock className='h-3 w-3 mr-1' />
											Submitted
										</Badge>
									)}
									<Button size='sm' variant='outline'>
										View
									</Button>
								</>
							) : (
								<Badge variant='outline' className='text-gray-500'>
									<X className='h-3 w-3 mr-1' />
									Not Submitted
								</Badge>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
