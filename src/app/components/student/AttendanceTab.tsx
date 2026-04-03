import React, { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import axios from 'axios';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Class } from '../TeacherDashboard';
import { Loader2 } from 'lucide-react';

export type Attendance = {
	id: string;
	class_id: string;
	student_id: string;
	date: string;
	status: boolean;
	marked_by: string;
	created_at: string;
};
export default function AttendanceTab({
	classes,
	attendance,
}: {
	classes: Class[];
	attendance: Attendance[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>My Attendance</CardTitle>
				<CardDescription>Weekly Attendance</CardDescription>
			</CardHeader>
			<CardContent>
				{attendance.length == 0 && <p>No attendance recorded.</p>}
				<div className='grid grid-cols-1  gap-4'>
					{attendance
						.sort(
							(a, b) =>
								(new Date(b.created_at) as any) -
								(new Date(a.created_at) as any),
						)
						.map((day, index) => (
							<Card key={index}>
								<CardContent
									className={`pt-6  ${day.status ? 'bg-green-50' : 'bg-red-50'}`}
								>
									<div className='space-y-3'>
										<div className='flex items-start justify-between'>
											<div className='flex gap-4'>
												<div
													className={`p-2  rounded-lg ${day.status ? 'bg-green-400' : 'bg-red-400'}`}
												></div>
												<p>
													{
														classes.find((course) => course.id == day.class_id)
															?.name
													}
												</p>
												<p>
													{
														classes.find((course) => course.id == day.class_id)
															?.description
													}
												</p>
											</div>
											{new Date(day.date).toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</div>
										<div className='pt-3 border-t'>
											<p className='text-sm text-gray-600 font-bold'>
												Status: {day.status ? 'Present' : 'Absent'}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
				</div>
			</CardContent>
		</Card>
	);
}
