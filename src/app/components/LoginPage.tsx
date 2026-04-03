import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import { UserRole, UserType } from '../App';
import { GraduationCap } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface LoginPageProps {
	onLogin: (user: UserType | null) => void;
	onSignUp: (value: boolean) => void;
}

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

export default function LoginPage({ onLogin, onSignUp }: LoginPageProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (data.session?.access_token) {
			onLogin(data);
		} else {
			setError(`Error signing in. ${error?.message} `);
			console.log(error);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1 text-center'>
					<div className='flex justify-center mb-4'>
						<div className='p-3 bg-blue-600 rounded-full'>
							<GraduationCap className='h-8 w-8 text-white' />
						</div>
					</div>
					<CardTitle className='text-3xl'>LearnMate</CardTitle>
					<CardDescription>Sign in to your account to continue</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						{error && (
							<div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
								{error}
							</div>
						)}
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='Enter your email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								placeholder='Enter your password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<Button type='submit' className='w-full cursor-pointer'>
							Sign In
						</Button>
					</form>
					<p
						className='underline tet-xs italic text-center mt-2 cursor-pointer text-blue-700'
						onClick={() => onSignUp(true)}
					>
						Sign up as school administrator
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
