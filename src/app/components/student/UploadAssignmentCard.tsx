import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast, useSonner } from 'sonner';
import axios from 'axios';
import { Button } from '../ui/button';

export default function UploadAssignmentCard({
	assignmentId,
	userId,
	classId,
	onChange,
}: {
	assignmentId: string;
	userId: string;
	classId: string;
	onChange: () => void;
}) {
	const [fileUrl, setFileUrl] = useState('');
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);
	const handleSubmit = async () => {
		setLoading(true);
		await axios
			.post(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/submissions/?user_id=${userId}`,
				{
					assignment_id: assignmentId,
					class_id: classId,
					file_url: fileUrl,
					notes,
				},
			)
			.then((res) => {
				toast.success('Assignment submitted');
				onChange();
			})
			.catch((e) => {
				toast.error('Failed to submit assignment');
			})
			.finally(() => {
				setLoading(false);
			});
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Attach your assignment</CardTitle>
				<CardDescription>
					Upload your assignment to Google Drive, create a link and make it
					viewable, then attach the link below.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid w-full items-center gap-1.5'>
					<Label htmlFor='file_url'>Document Link</Label>
					<Input
						id='file_url'
						type='text'
						placeholder='https://drive.google.com/...'
						value={fileUrl}
						onChange={(e) => setFileUrl(e.target.value)}
						required
					/>
				</div>

				<div className='grid w-full items-center gap-1.5'>
					<Label htmlFor='note'>Additional Note</Label>
					<Textarea
						id='note'
						placeholder='Write a short note about your submission'
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
					/>
				</div>

				<Button className='w-full' onClick={handleSubmit} disabled={loading}>
					{loading ? 'Submitting...' : 'Submit Assignment'}
				</Button>
			</CardContent>
		</Card>
	);
}
