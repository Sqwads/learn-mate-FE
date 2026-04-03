import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Clock } from 'lucide-react';

export default function PendingAssignment({ count }: { count: number }) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-gray-600'>Pending Assignments</p>
						<p className='text-3xl font-semibold mt-1'>{count}</p>
					</div>
					<div className='p-3 bg-orange-100 rounded-full'>
						<Clock className='h-6 w-6 text-orange-600' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
