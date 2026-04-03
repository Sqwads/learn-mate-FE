import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Users } from 'lucide-react';

export default function TotalUserCard({ count }: { count: number }) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-gray-600'>Total Users</p>
						<p className='text-3xl font-semibold mt-1'>{count}</p>
					</div>
					<div className='p-3 bg-blue-100 rounded-full'>
						<Users className='h-6 w-6 text-blue-600' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
