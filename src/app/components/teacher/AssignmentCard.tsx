import { Calendar, FileText, Pencil } from 'lucide-react';
import { Assignment } from '../TeacherDashboard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface AssignmentCardProps {
	assignment: Assignment;
	onClickView: (assignment: Assignment) => void;
	onClickEdit: (assignment: Assignment) => void;
}

export default function AssignmentCard({
	assignment,
	onClickView,
	onClickEdit,
}: AssignmentCardProps) {
	const dueDate = new Date(assignment.due_date);
	const isOverdue = dueDate < new Date();

	return (
		<Card
			className='hover:shadow-lg transition-shadow cursor-pointer'
			onClick={() => onClickView(assignment)}
		>
			<CardContent className='pt-6'>
				<div className='flex items-start justify-between mb-4'>
					<div className='flex-1'>
						<h3 className='text-lg font-semibold mb-2'>{assignment.title}</h3>
						<p className='text-sm text-gray-600 mb-3'>
							{assignment.description}
						</p>
						<div className='flex flex-wrap gap-2'>
							<Badge variant='outline' className='text-xs'>
								<Calendar className='h-3 w-3 mr-1' />
								Due: {dueDate.toLocaleDateString()}
							</Badge>
							{isOverdue && (
								<Badge variant='destructive' className='text-xs'>
									Overdue
								</Badge>
							)}
							<Badge variant='outline' className='text-xs'>
								{assignment.total_points} points
							</Badge>
						</div>
					</div>
					<div className='flex items-center gap-3'>
						<Button
							variant='outline'
							size='icon'
							onClick={(e) => {
								e.stopPropagation();
								onClickEdit(assignment);
							}}
						>
							<Pencil className='h-4 w-4 text-gray-600' />
						</Button>
						<div className='p-3 bg-blue-100 rounded-full'>
							<FileText className='h-6 w-6 text-blue-600' />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
