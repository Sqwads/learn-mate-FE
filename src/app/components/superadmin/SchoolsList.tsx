import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BarChart3, Building2, Calendar, Mail, User } from 'lucide-react';
import axios from 'axios';

interface School {
	id: string;
	school_name: string;
	status: string;
	created_at: string;
	admin_id: string;
	admin_name: string;
	admin_email: string;
}

interface SchoolsListProps {
	onViewAnalytics: (schoolId: string) => void;
	user_id: string;
}

export default function SchoolsList({
	onViewAnalytics,
	user_id,
}: SchoolsListProps) {
	const [schools, setSchools] = useState<School[]>([]);
	const [totalSchools, setTotalSchools] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate API call
		// In production: fetch('/superuser/schools')
		setLoading(true);
		const getSchool = async () => {
			await axios
				.get(
					`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/superuser/schools?user_id=${user_id}`,
				)
				.then((response) => {
					setSchools(response.data.schools);
					setTotalSchools(response.data.total_schools);
				})
				.catch((e) => console.log(e));
			setLoading(false);
		};
		getSchool();
	}, [user_id]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-center py-8'>
						<div className='text-gray-500'>Loading schools...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Stats Overview */}
			<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Total Schools</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{totalSchools}
								</p>
							</div>
							<div className='p-3 bg-purple-100 rounded-full'>
								<Building2 className='h-6 w-6 text-purple-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Active Schools</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{schools.filter((s) => s.status === 'active').length}
								</p>
							</div>
							<div className='p-3 bg-green-100 rounded-full'>
								<Building2 className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-gray-600'>Inactive Schools</p>
								<p className='text-2xl font-semibold text-gray-900 mt-1'>
									{schools.filter((s) => s.status === 'inactive').length}
								</p>
							</div>
							<div className='p-3 bg-gray-100 rounded-full'>
								<Building2 className='h-6 w-6 text-gray-600' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Schools Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Schools</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>School Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>School Admin</TableHead>
									<TableHead>Admin Email</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{schools.map((school) => (
									<TableRow key={school.id}>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Building2 className='h-4 w-4 text-gray-400' />
												<span className='font-medium'>
													{school.school_name}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													school.status === 'active' ? 'default' : 'secondary'
												}
											>
												{school.status}
											</Badge>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<User className='h-4 w-4 text-gray-400' />
												{school.admin_name !== ' ' ? school.admin_name : '-'}
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2 text-sm text-gray-600'>
												<Mail className='h-4 w-4 text-gray-400' />
												{school.admin_email}
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2 text-sm text-gray-600'>
												<Calendar className='h-4 w-4 text-gray-400' />
												{formatDate(school.created_at)}
											</div>
										</TableCell>
										<TableCell>
											<Button
												variant='outline'
												size='sm'
												onClick={() => onViewAnalytics(school.id)}
											>
												<BarChart3 className='h-4 w-4 mr-1' />
												Analytics
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
