import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Users } from 'lucide-react';

export default function TotalStudents({ count }: { count: number }) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-gray-600'>Total Students</p>
						<p className='text-3xl font-semibold mt-1'>
							{count}
							{/* {mockClasses.reduce(
													(sum, c) => sum + c.studentCount,
													0,
												)} */}
						</p>
					</div>
					<div className='p-3 bg-green-100 rounded-full'>
						<Users className='h-6 w-6 text-green-600' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
