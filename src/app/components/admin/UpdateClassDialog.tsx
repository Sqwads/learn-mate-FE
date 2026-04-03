import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Pencil, School } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { Session } from '@supabase/supabase-js';
import { Classes } from './ClassesTabContent';

export default function UpdateClassDialog({
	teachers,
	onChange,
	session,
	classItem,
	classId,
}: {
	classId: string;
	teachers: any[];
	onChange: () => void;
	session: Session;
	classItem: Classes;
}) {
	const [isUpdateClassDialogOpen, setIsUpdateClassDialogOpen] = useState(false);

	const [newClass, setNewClass] = useState({
		name: classItem.name,
		subject: classItem.description,
		teacher_id: classItem.teacher_id,
	});

	const [key, setChangeKey] = useState(0.001);

	const handleChangeKey = () => {
		setChangeKey(Math.random());
	};
	const handleUpdateClass = async () => {
		if (!newClass.name || !newClass.subject || !newClass.teacher_id) {
			toast.error('Please fill in all required fields');
			return;
		}

		await axios
			.put(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/classes/${classId}?admin_uid=${session?.user.id}`,
				{
					name: newClass.name,
					description: newClass.subject,
					teacher_id: newClass.teacher_id,
				},
			)
			.then(() => {
				toast.success('Class updated successfully!');
				onChange();
				setIsUpdateClassDialogOpen(false);
			})
			.catch((e) => {
				toast.error('Couldnt update class. Try again.');
				console.log(e);
			});
	};
	return (
		<Dialog
			open={isUpdateClassDialogOpen}
			onOpenChange={setIsUpdateClassDialogOpen}
		>
			<DialogTrigger asChild>
				<Button variant={'outline'}>
					<Pencil className='size-4 text-black' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update New Class</DialogTitle>
					<DialogDescription>Update class details</DialogDescription>
				</DialogHeader>
				<div className='space-y-4 mt-4'>
					<div className='space-y-2'>
						<Label htmlFor='className'>Class Name *</Label>
						<Input
							id='className'
							placeholder='e.g., SS2, JSS3, Primary 5'
							value={newClass.name}
							onChange={(e) =>
								setNewClass({
									...newClass,
									name: e.target.value,
								})
							}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='classSubject'>Subject *</Label>
						<Input
							id='classSubject'
							placeholder='e.g., Mathematics'
							value={newClass.subject}
							onChange={(e) =>
								setNewClass({
									...newClass,
									subject: e.target.value,
								})
							}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='classGrade'>Teacher *</Label>
						<Select
							value={newClass.teacher_id}
							onValueChange={(value) =>
								setNewClass({ ...newClass, teacher_id: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select teacher' />
							</SelectTrigger>
							<SelectContent>
								{teachers.map((teacher) => (
									<SelectItem value={teacher.id} key={teacher.id}>
										{teacher.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='flex justify-end gap-2 pt-4'>
						<Button
							variant='outline'
							onClick={() => setIsUpdateClassDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdateClass}>Update Class</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
