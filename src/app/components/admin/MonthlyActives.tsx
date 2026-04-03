import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { GraduationCap, UndoIcon, User } from 'lucide-react';
import { MAU } from '../AdminDashboard';
import { Label } from '../ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import axios from 'axios';

export default function MonthlyActives({
	mau,
	school_id,
	user_id,
}: {
	mau?: MAU;
	school_id: string;
	user_id: string;
}) {
	const [selectMAU, setSelectedMAU] = useState<MAU | undefined>(mau);

	const getNewMau = async (value: string) => {
		await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/admin/schools/${school_id}/analytics/mau?admin_id=${user_id}&month=${value}`,
			)
			.then((response) => {
				setSelectedMAU(response.data);
			});
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Monthly Active Users</CardTitle>
				<CardDescription>User engagement in the selected month</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='pb-5 space-y-3'>
					<Label>Selected Month</Label>
					<Select
						defaultValue={mau?.month.toString()}
						onValueChange={(value) => getNewMau(value)}
					>
						<SelectTrigger className='w-full max-w-48'>
							<SelectValue placeholder='Select a month' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='1'>January</SelectItem>
							<SelectItem value='2'>February</SelectItem>
							<SelectItem value='3'>March</SelectItem>
							<SelectItem value='4'>April</SelectItem>
							<SelectItem value='5'>May</SelectItem>
							<SelectItem value='6'>June</SelectItem>
							<SelectItem value='7'>July</SelectItem>
							<SelectItem value='8'>August</SelectItem>
							<SelectItem value='9'>September</SelectItem>
							<SelectItem value='10'>October</SelectItem>
							<SelectItem value='11'>November</SelectItem>
							<SelectItem value='12'>December</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2  gap-4'>
					<div className='p-4 bg-purple-50 rounded-lg'>
						<div className='flex items-center gap-2 mb-2'>
							<GraduationCap className='h-5 w-5 text-purple-600' />
							<p className='text-sm font-medium text-gray-700'>
								Active Teachers
							</p>
						</div>
						<p className='text-2xl font-semibold text-purple-600'>
							{selectMAU?.active_teachers}
						</p>
					</div>
					<div className='p-4 bg-blue-50 rounded-lg'>
						<div className='flex items-center gap-2 mb-2'>
							<User className='h-5 w-5 text-blue-600' />
							<p className='text-sm font-medium text-gray-700'>
								Active Students
							</p>
						</div>
						<p className='text-2xl font-semibold text-blue-600'>
							{selectMAU?.active_students}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
