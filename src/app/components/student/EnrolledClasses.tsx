import React from 'react';
import { Card, CardContent } from '../ui/card';
import { BookOpen } from 'lucide-react';

export default function EnrolledClasses({ count }: { count: number }) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-gray-600'>Enrolled Classes</p>
						<p className='text-3xl font-semibold mt-1'>{count}</p>
					</div>
					<div className='p-3 bg-blue-100 rounded-full'>
						<BookOpen className='h-6 w-6 text-blue-600' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
