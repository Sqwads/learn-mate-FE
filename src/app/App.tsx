import { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import axios from 'axios';
import { createClient, Session, User } from '@supabase/supabase-js';
import { Toaster } from 'sonner';
import SignUpPage from './components/SignUpPage';
import SuperAdminDashboard from './components/superadmin/SuperAdmin';

export type UserRole = 'teacher' | 'student' | 'admin';

export type UserType =
	| {
			user: User | null;
			session: Session | null;
	  }
	| {
			user: null;
			session: null;
	  };
export type responseUserData = {
	email: string;
	full_name: string;
	id: string;
	user_id?: string;
	role: string;
	school_id: string | null;
	school_name: string | null;
};
export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

function App() {
	const [currentUser, setCurrentUser] = useState<responseUserData | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [signUp, setSignUp] = useState(false);

	const getUserData = async (token: string) => {
		const response = await axios
			.get(
				`https://learnmate-backend-tochukwuihejirika5532-0n5c5ioa.leapcell.dev/auth/me?user_id=${token}`,
			)
			.then(function (response) {
				return response.data as unknown as responseUserData;
			})
			.catch(function (error) {
				console.log(error);
				return null;
			});
		return response;
	};
	//Getting current session on load
	useEffect(() => {
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			setSession(session);
			if (session) {
				const userData = await getUserData(session.user.id);
				setCurrentUser(userData);
			}
		});
	}, []);

	const handleLogin = async (user: UserType | null) => {
		if (!user || !user.session || !user.user?.id) return;
		setSession(user.session);
		const userData = await getUserData(user?.user?.id);
		setCurrentUser(userData);
	};

	if (session && !currentUser) {
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<p>Loading...</p>
			</div>
		);
	}
	if (!currentUser || !session) {
		return (
			<>
				{signUp ? (
					<SignUpPage onLogin={handleLogin} onSignUp={setSignUp} />
				) : (
					<LoginPage onLogin={handleLogin} onSignUp={setSignUp} />
				)}
			</>
		);
	}

	if (currentUser.role === 'teacher') {
		return (
			<>
				<TeacherDashboard user={currentUser} session={session} />
				<Toaster position='top-center' />
			</>
		);
	}

	if (currentUser.role === 'student') {
		return (
			<>
				<StudentDashboard user={currentUser} session={session} />
				<Toaster position='top-center' />
			</>
		);
	}

	if (currentUser.role === 'admin') {
		return (
			<>
				<AdminDashboard user={currentUser} session={session} />
				<Toaster position='top-center' />
			</>
		);
	}

	if (currentUser.role === 'superuser') {
		return <SuperAdminDashboard user={currentUser} />;
	}

	return null;
}

export default App;
