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
import { GraduationCap, Loader2, Info, Eye, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { toast } from 'sonner';

interface LoginPageProps {
	onLogin: (user: UserType | null) => void;
	onSignUp: (value: boolean) => void;
}

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

export default function SignUpPage({ onLogin, onSignUp }: LoginPageProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [adminName, setAdminName] = useState('');
	const [schoolName, setSchoolName] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		if (!email || !password || !schoolName || !adminName) {
			setError('Fill all fields');
			toast.error('Error creating school admin');
			return;
		}
		// await supabase.auth
		// 	.signUp({
		// 		email,
		// 		password,
		// 	})
		// 	.then(async (response) => {
		// 		if (response.data.session?.access_token) {
		// 			// console.log(response.data);
		// 			await axios.post(
		// 				`https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/schools?user_id=${response.data.user?.id}`,
		// 				{ 'school_name': schoolName, 'admin_id': response.data.user?.id },
		// 			);
		// 			onLogin(response.data);
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		setError(`Error creating account: ${error?.message} `);
		// 		toast.error('Error creating account, try again');
		// 		console.log(error);
		// 	});
		await axios
			.post(
				`https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/auth/signup`,
				{
					email,
					password,
					'full_name': adminName,
					'school_name': schoolName,
					'role': 'admin',
				},
			)
			.then(async (response) => {
				console.log(response.data);
				await supabase.auth
					.signInWithPassword({ email, password })
					.then((response) => {
						toast.success('Account created!');
						onLogin(response.data);
					});
			})
			.catch((e) => {
				console.log('error creating admin', e);
				toast.error('Error creating school', { description: e.message });
				setError('Error creating school');
			});
		setLoading(false);
	};
	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.reload();
	};
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
			{loading && (
				<div className='fixed top-0 left-0 h-screen w-full z-20 backdrop-blur-sm flex flex-col items-center justify-center'>
					<Loader2 className='animate-spin size-6 ' />
					<p>Creating account...</p>
				</div>
			)}
			<Card className='w-full max-w-md relative'>
				<div className='absolute right-4 top-4'>
					<Tooltip>
						<TooltipTrigger asChild>
							<a
								href='https://drive.google.com/file/d/1hmywR8Vyc6NVgjg6zPZNYA1W9Yo8vYO1/view?usp=sharing'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors'
							>
								<Info className='h-4 w-4' />
								<span>User Manual</span>
							</a>
						</TooltipTrigger>
						<TooltipContent>
							<p>User Manual</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<CardHeader className='space-y-1 text-center'>
					<div className='flex justify-center mb-4'>
						<div className='p-3 bg-blue-600 rounded-full'>
							<GraduationCap className='h-8 w-8 text-white' />
						</div>
					</div>
					<CardTitle className='text-3xl'>LearnMate</CardTitle>
					<CardDescription>
						Create your school administrator account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						{error && (
							<div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
								{error}
							</div>
						)}
						<div className='space-y-2'>
							<Label htmlFor='school_name'>School Name:</Label>
							<Input
								id='school_name'
								type='text'
								placeholder='Enter your school name'
								value={schoolName}
								onChange={(e) => setSchoolName(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='school_name'>Admin Name:</Label>
							<Input
								id='admin_name'
								type='text'
								placeholder='Enter the admin name'
								value={adminName}
								onChange={(e) => setAdminName(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Admin email</Label>
							<Input
								id='email'
								type='email'
								placeholder='Enter the admin email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<div className='relative'>
								<Input
									id='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='Enter your password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</div>

						<Button type='submit' className='w-full cursor-pointer'>
							Create account
						</Button>
					</form>
					<p
						className='underline tet-xs italic text-center mt-2 cursor-pointer text-blue-700'
						onClick={() => onSignUp(false)}
					>
						Log in
					</p>
					{/* <Button onClick={handleLogout}>Sign Out</Button> */}
				</CardContent>
			</Card>
		</div>
	);
}
