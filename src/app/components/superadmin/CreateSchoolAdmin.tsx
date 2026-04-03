import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

interface CreateSchoolAdminProps {
	onSuccess: () => void;
}

interface School {
	id: string;
	school_name: string;
}

// Mock schools data - in production, fetch from API
const mockSchools: School[] = [
	{ id: 'school-1', school_name: 'Springfield High School' },
	{ id: 'school-2', school_name: 'Riverside Elementary' },
	{ id: 'school-3', school_name: 'Lincoln Academy' },
	{ id: 'school-4', school_name: 'Washington Middle School' },
	{ id: 'school-5', school_name: 'Oakwood Prep' },
];

export default function CreateSchoolAdmin({
	onSuccess,
}: CreateSchoolAdminProps) {
	const [schools, setSchools] = useState<School[]>([]);
	const [formData, setFormData] = useState({
		schoolId: '',
		adminName: '',
		adminEmail: '',
		password: '',
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		// In production: fetch schools from /superuser/schools
		setSchools(mockSchools);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		// Validate school selection
		if (!formData.schoolId) {
			setError('Please select a school');
			setLoading(false);
			return;
		}

		// Simulate API call
		// In production: POST to /superuser/school-admins or similar endpoint
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Mock success
			setSuccess(true);
			setTimeout(() => {
				onSuccess();
			}, 2000);
		} catch (err) {
			setError('Failed to create school admin. Please try again.');
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const selectedSchool = schools.find((s) => s.id === formData.schoolId);

	if (success) {
		return (
			<Card>
				<CardContent className='p-12'>
					<div className='flex flex-col items-center justify-center text-center space-y-4'>
						<div className='p-4 bg-green-100 rounded-full'>
							<CheckCircle2 className='h-12 w-12 text-green-600' />
						</div>
						<div>
							<h3 className='text-xl font-semibold text-gray-900 mb-2'>
								School Admin Created Successfully!
							</h3>
							<p className='text-gray-600'>
								{formData.adminName} has been assigned as admin for{' '}
								{selectedSchool?.school_name}.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center gap-3 mb-2'>
					<Button variant='ghost' size='sm' onClick={onSuccess}>
						<ArrowLeft className='h-4 w-4' />
					</Button>
					<UserPlus className='h-6 w-6 text-purple-600' />
				</div>
				<CardTitle>Create School Admin</CardTitle>
				<CardDescription>
					Assign a School Admin to manage a specific school. Each school can
					have one admin.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='schoolId'>Select School *</Label>
							<Select
								value={formData.schoolId}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, schoolId: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Choose a school' />
								</SelectTrigger>
								<SelectContent>
									{schools.map((school) => (
										<SelectItem key={school.id} value={school.id}>
											{school.school_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className='text-xs text-gray-600'>
								The admin will only have access to this school's data
							</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='adminName'>Admin Name *</Label>
								<Input
									id='adminName'
									name='adminName'
									placeholder='e.g., John Doe'
									value={formData.adminName}
									onChange={handleChange}
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='adminEmail'>Admin Email *</Label>
								<Input
									id='adminEmail'
									name='adminEmail'
									type='email'
									placeholder='e.g., admin@school.edu'
									value={formData.adminEmail}
									onChange={handleChange}
									required
								/>
							</div>

							<div className='space-y-2 md:col-span-2'>
								<Label htmlFor='password'>Password *</Label>
								<Input
									id='password'
									name='password'
									type='password'
									placeholder='Enter a secure password'
									value={formData.password}
									onChange={handleChange}
									required
									minLength={8}
								/>
								<p className='text-xs text-gray-600'>
									Password must be at least 8 characters long
								</p>
							</div>
						</div>
					</div>

					{error && (
						<Alert variant='destructive'>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className='flex gap-3'>
						<Button type='submit' disabled={loading}>
							{loading ? 'Creating...' : 'Create School Admin'}
						</Button>
						<Button type='button' variant='outline' onClick={onSuccess}>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
