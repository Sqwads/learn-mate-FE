import { School } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export default function TotalClasses({ count }: { count: number }) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-gray-600'>Total Classes</p>
						<p className='text-3xl font-semibold mt-1'>{count}</p>
					</div>
					<div className='p-3 bg-orange-100 rounded-full'>
						<School className='h-6 w-6 text-orange-600' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
