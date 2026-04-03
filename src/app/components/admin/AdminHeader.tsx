import { GraduationCap, LogOut } from 'lucide-react';
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { responseUserData } from '../../App';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

export default function AdminHeader({ user }: { user: responseUserData }) {
	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.reload();
	};
	return (
		<div>
			{/* Header */}
			<header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-blue-600 rounded-lg'>
								<GraduationCap className='h-6 w-6 text-white' />
							</div>
							<div>
								<h1 className='text-2xl font-semibold text-gray-900'>
									LearnMate
								</h1>
								<p className='text-sm text-gray-600'>{user.school_name}</p>
							</div>
						</div>
						<div className='flex items-center gap-4'>
							<div className='text-right'>
								<Badge variant='outline' className='text-xs'>
									{user.email}
								</Badge>
								<Badge variant='outline' className='text-xs'>
									Admin
								</Badge>
							</div>
							<Button
								variant='outline'
								onClick={handleLogout}
								className='hover:bg-red-200'
							>
								<LogOut className='h-4 w-4 mr-2' />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
}
