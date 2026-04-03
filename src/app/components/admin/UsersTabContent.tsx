import React, { useState } from 'react';
import { TabsContent } from '../ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Trash2, UserPlus, Users } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { SystemUser } from '../AdminDashboard';
import axios from 'axios';
import { Session } from '@supabase/supabase-js';
import BulkUserUpload from './BulkUserUpload';
export default function UsersTabContent({
	session,
	users,
	onChange,
	schoolId,
	schoolName,
}: {
	session: Session;
	users: SystemUser[];
	onChange: () => void;
	schoolId: string;
	schoolName: string;
}) {
	const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		firstName: '',
		lastName: '',
		email: '',
		role: 'student' as 'teacher' | 'student',
	});

	const handleCreateUser = async () => {
		if (!newUser.firstName || !newUser.email) {
			toast.error('Please fill in all required fields');
			return;
		}
		const response = await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/admin/users?user_id=${session.user.id}`,
				{
					...newUser,
					password: newUser.lastName.toLowerCase().trim(),
					schoolId,
					schoolName,
				},
				{
					headers: {
						Authorization: `Bearer ${session.access_token}`,
						'Content-Type': 'application/json',
					},
				},
			)
			.then(function (response) {
				toast.success(
					`${
						newUser.role === 'teacher' ? 'Teacher' : 'Student'
					} created successfully!`,
				);
			})
			.catch(function (error) {
				console.log(error);
				toast.error('Error creating new user', {
					description: error?.response?.data?.detail,
				});
				return null;
			});
		setIsCreateUserDialogOpen(false);
		setNewUser({ firstName: '', lastName: '', email: '', role: 'student' });

		// window.location.reload();
		onChange();
	};

	const handleDelete = async (userId: string) => {
		await axios
			.delete(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/admin/users/${userId}?admin_uuid=${session.user.id}`,
			)
			.then(() => {
				toast.success('User removed from system!');
				onChange();
			})
			.catch((e) => {
				console.log(e);
				toast.error('Failed to delete user', {
					description:
						'Ensure the user is not assigned to any school before deleting',
				});
			});
	};

	return (
		<TabsContent value='users' className='space-y-6'>
			<Card>
				<CardHeader>
					<div className='flex flex-col md:flex-row space-y-4 md:items-center justify-between'>
						<div>
							<CardTitle>User Management</CardTitle>
							<CardDescription>
								Create and manage teachers and students
							</CardDescription>
						</div>
						<div className='flex items-center justify-center gap-2'>
							<BulkUserUpload
								schoolId={schoolId}
								schoolName={schoolName}
								accessToken={session.access_token}
								userId={session.user.id}
								onChange={onChange}
							/>
							<Dialog
								open={isCreateUserDialogOpen}
								onOpenChange={setIsCreateUserDialogOpen}
							>
								<DialogTrigger asChild>
									<Button>
										<UserPlus className='h-4 w-4 mr-2' />
										Create User
									</Button>
								</DialogTrigger>{' '}
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Create New User</DialogTitle>
										<DialogDescription>
											Add a new teacher or student to the platform
										</DialogDescription>
									</DialogHeader>
									<div className='space-y-4 mt-4'>
										<div className='space-y-2'>
											<Label htmlFor='firstName'>First Name *</Label>
											<Input
												id='firstName'
												placeholder='Enter first name'
												value={newUser.firstName}
												onChange={(e) =>
													setNewUser({ ...newUser, firstName: e.target.value })
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='lastName'>Last Name *</Label>
											<Input
												id='lastName'
												placeholder='Enter last name'
												value={newUser.lastName}
												onChange={(e) =>
													setNewUser({ ...newUser, lastName: e.target.value })
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='userEmail'>Email *</Label>
											<Input
												id='userEmail'
												type='email'
												placeholder='Enter email address'
												value={newUser.email}
												onChange={(e) =>
													setNewUser({
														...newUser,
														email: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='userRole'>Role *</Label>
											<Select
												value={newUser.role}
												onValueChange={(value: 'teacher' | 'student') =>
													setNewUser({ ...newUser, role: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select role' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='teacher'>Teacher</SelectItem>
													<SelectItem value='student'>Student</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className='flex justify-end gap-2 pt-4'>
											<Button
												variant='outline'
												onClick={() => setIsCreateUserDialogOpen(false)}
											>
												Cancel
											</Button>
											<Button onClick={handleCreateUser}>Create User</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{users.length == 0 && (
						<div className='flex flex-col items-center justify-center space-y-3'>
							<Users className='size-14 text-neutral-400' />
							<p className='text-xl font-medium'>No Users Found</p>
							<p className='max-w-lg text-center'>
								Your school directory is currently empty. To get started, you
								can manually add students and teachers.
							</p>
						</div>
					)}
					<div className='space-y-2'>
						{users.map((user) => (
							<div
								key={user.id}
								className='flex items-center justify-between  p-3 bg-gray-50 rounded-lg'
							>
								<div className='flex items-center gap-3 w-1/2 '>
									<div
										className={`hidden size-1 p-5 rounded-full md:flex items-center justify-center text-white font-semibold ${
											user.role === 'teacher' ? 'bg-green-600' : 'bg-blue-600'
										}`}
									>
										{user.full_name.charAt(0).toUpperCase()}
									</div>
									<div className='w-full'>
										<p className='font-medium truncate'>{user.full_name}</p>
										<p className='text-sm text-gray-600 truncate'>
											{user.email}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-3 '>
									<Badge
										variant={user.role === 'teacher' ? 'default' : 'secondary'}
									>
										{user.role == 'teacher' ? 'Teacher' : 'Student'}
									</Badge>
									<div
										className='size-5 flex items-center justify-center bg-neutral-100 rounded-md cursor-pointer'
										onClick={() => handleDelete(user.id)}
									>
										<Trash2 className='size-4 text-neutral-700' />
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	);
}
