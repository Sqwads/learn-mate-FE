import React, { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import {
	Calendar,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Upload,
} from 'lucide-react';
import { Assignment, Class } from '../TeacherDashboard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import CompletedAssignment from './CompletedAssignment';
import CompletedAssignmentList from './CompletedAssignmentList';
import axios from 'axios';
import UploadAssignmentCard from './UploadAssignmentCard';
import { Mark } from '../teacher/TeacherSumissionView';
import MCQAnswering from './MCQAnswering';

export type Submission = {
	'id': string;
	'assignment_id': string;
	'class_id': string;
	'student_id': string;
	'submitted_at': string;
	'file_url': string;
	'notes': string;
	'school_id': string;
};
export default function PendingAssignmentList({
	pendingAssignments,
	userId,
	submittedAssignments,
	refreshSubmitted,
	classes,
	grades,
}: {
	pendingAssignments: Assignment[];
	userId: string;
	submittedAssignments: Submission[];
	refreshSubmitted: () => void;
	grades: Mark[];
	classes: Class[];
}) {
	const [showUpload, setShowUpload] = useState('');

	return (
		<Card>
			<CardHeader>
				<CardTitle>Assignments</CardTitle>
				<CardDescription>All your assignments </CardDescription>
			</CardHeader>
			<CardContent>
				{pendingAssignments.length === 0 ? (
					<div className='text-center py-12'>
						<CheckCircle2 className='h-12 w-12 text-green-500 mx-auto mb-4' />
						<p className='text-gray-600'>
							All caught up! No pending assignments.
						</p>
					</div>
				) : (
					<div className='space-y-3'>
						{pendingAssignments
							.sort(
								(a, b) =>
									(new Date(b.created_at!) as any) -
									(new Date(a.created_at!) as any),
							)
							.map((assignment) => {
								const submitted = submittedAssignments.find(
									(newassignment) =>
										newassignment.assignment_id == assignment.id,
								);
								const dueDate = new Date(assignment.due_date);
								const daysUntilDue = Math.ceil(
									(dueDate.getTime() - new Date().getTime()) /
										(1000 * 60 * 60 * 24),
								);
								const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;
								const isOverDue = daysUntilDue < 0;
								const grade = grades.find(
									(val) => val.submission_id == submitted?.id,
								);
								return (
									<div
										key={assignment.id}
										className={`p-4 rounded-lg border bg-gray-50 ${submitted && 'border-green-200 bg-green-50'} ${
											!submitted && isUrgent && 'border-orange-200 bg-orange-50'
										} ${!submitted && isOverDue && 'border-red-200 bg-red-50'}`}
									>
										<div className='flex flex-col items-start justify-between mb-3'>
											<div className='flex-1'>
												<div className='flex items-center flex-wrap gap-2 mb-1'>
													<h3 className='font-semibold'>{assignment.title}</h3>
													{!submitted && isUrgent && (
														<Badge className='bg-orange-500 text-xs'>
															Due Soon
														</Badge>
													)}
													{!submitted && isOverDue && (
														<Badge variant={'destructive'} className='text-xs'>
															Overdue
														</Badge>
													)}
													{submitted && (
														<Badge className='bg-green-600 text-sm'>
															Submitted
														</Badge>
													)}
													{submitted && grade && (
														<Badge className='bg-green-600 text-sm'>
															Score: {grade?.grade} /{assignment.total_points}
														</Badge>
													)}
												</div>
												<p className='text-sm text-gray-600 mb-2'>
													{assignment.description}
												</p>
												{assignment.file_url && (
													<a
														target='_blank'
														href={assignment.file_url}
														className='text-sm text-blue-600 mb-4'
													>
														{assignment.file_url}
													</a>
												)}
												<div className='py-3 flex flex-wrap gap-2'>
													<Badge variant='outline' className='text-xs'>
														{
															classes.find(
																(myclass) => myclass.id == assignment.class_id,
															)?.description
														}
													</Badge>
													<Badge variant='outline' className='text-xs'>
														<Calendar className='h-3 w-3 mr-1' />
														Due: {dueDate.toLocaleDateString()}
													</Badge>
													<Badge variant='outline' className='text-xs'>
														{assignment.total_points} points
													</Badge>
													{assignment.isMCQ && <Badge>MCQ Questions </Badge>}
												</div>
											</div>
											{!submitted && (
												<div className='w-full'>
													<Button
														variant={'ghost'}
														size='sm'
														onClick={() => {
															setShowUpload((prev) =>
																prev ? '' : assignment.id!,
															);
														}}
													>
														{showUpload ? (
															<div className='flex'>
																<span>Hide</span>
																<ChevronUp className='h-4 w-4 mr-2' />
															</div>
														) : (
															<div className='flex'>
																<span>Show</span>
																<ChevronDown className='h-4 w-4 mr-2' />
															</div>
														)}
													</Button>

													{showUpload == assignment.id && (
														<div>
															{assignment.isMCQ && assignment?.mcq_questions ? (
																<MCQAnswering
																	questions={JSON.parse(
																		assignment?.mcq_questions[0],
																	)}
																	totalPoints={assignment.total_points}
																	classId={assignment.class_id}
																	userId={userId}
																	assignmentId={assignment.id!}
																	onChange={refreshSubmitted}
																/>
															) : (
																<UploadAssignmentCard
																	classId={assignment.class_id}
																	userId={userId}
																	assignmentId={assignment.id!}
																	onChange={refreshSubmitted}
																/>
															)}
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								);
							})}
					</div>
				)}
				<CompletedAssignmentList completedAssignments={pendingAssignments} />
			</CardContent>
		</Card>
	);
}
