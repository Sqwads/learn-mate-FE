import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Award } from 'lucide-react';

export default function AverageGrade({
	averageGrade,
}: {
	averageGrade: number;
}) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-gray-600'>Average Grade</p>
						<p className='text-3xl font-semibold mt-1'>{averageGrade}%</p>
					</div>
					<div className='p-3 bg-purple-100 rounded-full'>
						<Award className='h-6 w-6 text-purple-600' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
