import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Class } from '../TeacherDashboard';
import { BookOpen, Users } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function ClassItemCard({
	classItem,
	onSelect,
}: {
	classItem: Class;
	onSelect: (classItem: Class) => void;
}) {
	return (
		<Card
			key={classItem.id}
			className='hover:shadow-lg transition-shadow cursor-pointer'
			onClick={() => onSelect(classItem)}
		>
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
						<p className='text-sm text-gray-600'>{classItem.description}</p>
					</div>
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<Users className='h-4 w-4' />
						<span>{classItem.students.length} students</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
