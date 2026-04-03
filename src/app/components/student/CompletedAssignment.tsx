import React from 'react';
import { Card, CardContent } from '../ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function CompletedAssignment({ count }: { count: number }) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-gray-600'>Completed Assignments</p>
						<p className='text-3xl font-semibold mt-1'>{count}</p>
					</div>
					<div className='p-3 bg-green-100 rounded-full'>
						<CheckCircle2 className='h-6 w-6 text-green-600' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
