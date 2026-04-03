import { useState } from 'react';
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
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface CreateSchoolProps {
	onSuccess: () => void;
}

export default function CreateSchool({ onSuccess }: CreateSchoolProps) {
	const [formData, setFormData] = useState({
		schoolName: '',
		address: '',
		contactEmail: '',
		contactPhone: '',
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		// Simulate API call
		// In production: POST to /superuser/schools
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Mock success
			setSuccess(true);
			setTimeout(() => {
				onSuccess();
			}, 2000);
		} catch (err) {
			setError('Failed to create school. Please try again.');
			setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

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
								School Created Successfully!
							</h3>
							<p className='text-gray-600'>
								{formData.schoolName} has been added to the platform.
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
					<Building2 className='h-6 w-6 text-purple-600' />
				</div>
				<CardTitle>Create New School</CardTitle>
				<CardDescription>
					Add a new school to the LearnMate platform. Once created, you can
					assign a School Admin.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<Label htmlFor='schoolName'>School Name *</Label>
							<Input
								id='schoolName'
								name='schoolName'
								placeholder='e.g., Springfield High School'
								value={formData.schoolName}
								onChange={handleChange}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='contactEmail'>Contact Email *</Label>
							<Input
								id='contactEmail'
								name='contactEmail'
								type='email'
								placeholder='e.g., info@school.edu'
								value={formData.contactEmail}
								onChange={handleChange}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='contactPhone'>Contact Phone</Label>
							<Input
								id='contactPhone'
								name='contactPhone'
								type='tel'
								placeholder='e.g., (555) 123-4567'
								value={formData.contactPhone}
								onChange={handleChange}
							/>
						</div>

						<div className='space-y-2 md:col-span-2'>
							<Label htmlFor='address'>Address</Label>
							<Textarea
								id='address'
								name='address'
								placeholder='Enter school address'
								value={formData.address}
								onChange={handleChange}
								rows={3}
							/>
						</div>
					</div>

					{error && (
						<Alert variant='destructive'>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className='flex gap-3'>
						<Button type='submit' disabled={loading}>
							{loading ? 'Creating...' : 'Create School'}
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
