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
	const [uploadErrors, setUploadErrors] = useState<{ email: string; error: string }[]>([]);

	const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;

		const file = event.target.files[0] as any;
		const target = event.target;

		setLoading(true);
		setUploadErrors([]);
		Papa.parse(file, {
			skipEmptyLines: true,
			header: true,
			complete: async function (results) {
				if (results.errors.length > 0) {
					toast.error('Error parsing CSV', {
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
					.then((uploadResults) => {
						const validResults = uploadResults.filter(Boolean);
						const successes = validResults.filter((r: any) => r.success);
						const failures = validResults.filter((r: any) => !r.success);

						if (failures.length > 0) {
							setUploadErrors(
								failures.map((f: any) => ({
									email: f.email || 'Unknown',
									error: String(f.error || 'Unknown error'),
								}))
							);
							if (successes.length > 0) {
								toast.success(`Successfully created ${successes.length} users. Follow the prompt to review the failures.`);
							}
						} else {
							if (successes.length > 0) {
								toast.success(`Successfully created ${successes.length} users`);
							}
							setIsCreateUserDialogOpen(false);
							onChange();
						}

					})
					.catch((error) => {
						console.error('Error creating students:', error);
						toast.error('An unexpected error occurred during bulk upload');
					})
					.finally(() => {
						setLoading(false);
						if (target) target.value = '';
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
			return null;
		}
		try {
			await axios.post(
				`https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/admin/users?user_id=${userId}`,
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
			);
			return { success: true, email };
		} catch (error: any) {
			return {
				success: false,
				error: error?.response?.data?.detail || 'Error creating user',
				email,
			};
		}
	};
	return (
		<Dialog
			open={isCreateUserDialogOpen}
			onOpenChange={(open) => {
				setIsCreateUserDialogOpen(open);
				if (!open) setUploadErrors([]);
			}}
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
							{uploadErrors.length > 0 && (
								<div className='mt-4 p-3 bg-red-50 text-red-800 rounded-md max-h-48 overflow-y-auto border border-red-200'>
									<p className='font-semibold mb-2'>Upload Errors ({uploadErrors.length}):</p>
									<ul className='list-disc pl-5 space-y-1 text-sm'>
										{uploadErrors.map((err, idx) => (
											<li key={idx}>
												<strong>{err.email}</strong>: {err.error}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
