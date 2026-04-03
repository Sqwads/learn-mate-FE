// import { User } from '../App';
import { Session } from '@supabase/supabase-js';
import { responseUserData } from '../App';
import TeacherDashboardContent from './teacher/TeacherDashboardContent';
import TeacherHeader from './teacher/TeacherHeader';

interface TeacherDashboardProps {
	user: responseUserData;
	session: Session;
}

// Mock data for classes
export interface Class {
	id: string;
	name: string;
	description: string;
	students: Student[];
	teacher_id: string;
}

export interface Student {
	id: string;
	full_name: string;
	email: string;
}

export interface AttendanceRecord {
	id: string;
	studentId: string;
	classId: string;
	date: string;
	status: 'present' | 'absent';
}

export interface Assignment {
	id?: string;
	title: string;
	description: string;
	class_id: string;
	due_date: string;
	file_url: string;
	created_by?: string;
	school_id?: string;
	total_points: string;
	created_at?: string;
	isMCQ?: boolean;
	mcq_questions?: string[];
}

export interface Submission {
	id: string;
	assignmentId: string;
	studentId: string;
	submittedAt: string;
	fileUrl: string;
	grade?: number;
	feedback?: string;
}

export default function TeacherDashboard({
	user,
	session,
}: TeacherDashboardProps) {
	return (
		<div className='min-h-screen bg-gray-50'>
			<TeacherHeader user={user} />
			<TeacherDashboardContent session={session} />
		</div>
	);
}
