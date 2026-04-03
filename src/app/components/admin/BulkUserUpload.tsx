import axios from 'axios';
import { Loader2, UserPlus2Icon } from 'lucide-react';
import Papa from 'papaparse';
import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
const acceptableFileType =
	'application/vnd.ms-excel, application/csv, text/csv, text/plain, text/x-csv, text/comma-separated-values, ';

export default function BulkUserUpload({
	schoolId,
	schoolName,
	accessToken,
	userId,
	onChange,
}: {
	schoolId: string;
	schoolName: string;
	accessToken: string;
	userId: string;
	onChange: () => void;
}) {
	const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;

		const file = event.target.files[0] as any;

		setLoading(true);
		Papa.parse(file, {
			skipEmptyLines: true,
			header: true,
			complete: async function (results) {
				if (results.errors.length > 0) {
					toast.error('Error creating bulk users', {
						description: `${JSON.stringify(results.errors)}`,
					});
				}

				Promise.all(
					results.data.map((student: any) =>
						handleCreateUser({
							firstName: student.firstName,
							lastName: student.lastName,
							role: student.role,
							email: student.email,
						}),
					),
				)
					.then(() => {
						toast.success('All students created');
						onChange();
					})
					.catch((error) => {
						console.error('Error creating students:', error);
					})
					.finally(() => {
						setLoading(false);
					});
			},
		});
	};
	const handleCreateUser = async ({
		firstName,
		lastName,
		role,
		email,
	}: {
		firstName: string;
		lastName: string;
		role: string;
		email: string;
	}) => {
		if (!firstName || !email || !role || !lastName) {
			return;
		}
		const response = await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/admin/users?user_id=${userId}`,
				{
					firstName,
					lastName,
					role,
					email,
					password: lastName.toLowerCase().trim(),
					schoolId,
					schoolName,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
				},
			)
			.then(function (response) {})
			.catch(function (error) {
				toast.error('Error creating new user', {
					description: error?.response?.data?.detail,
				});
				return null;
			});
		setIsCreateUserDialogOpen(false);
		// onChange();
	};
	return (
		<Dialog
			open={isCreateUserDialogOpen}
			onOpenChange={setIsCreateUserDialogOpen}
		>
			<DialogTrigger>
				<Button>
					<UserPlus2Icon className='h-4 w-4 mr-2' />
					Upload Bulk Users
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upload Bulk Users</DialogTitle>
					<DialogDescription>
						Upload a csv file which contains details of all the teacher or
						student to be added to the platform.
					</DialogDescription>
				</DialogHeader>
				<div className='p-2'>
					{loading ? (
						<div className='flex flex-col items-center justify-center'>
							<Loader2 className='animate-spin' />
							<p className='text-center text-sm'>
								Creating users... Please wait.
							</p>
						</div>
					) : (
						<div className='space-y-3'>
							<div className='mt-1'>
								<span className='font-medium'>
									Ensure the CSV has the following column headers:
								</span>{' '}
								firstName, lastName, email, role
							</div>{' '}
							<Input
								type='file'
								id='upload'
								onChange={onFileChange}
								accept={acceptableFileType}
								disabled={loading}
							/>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
