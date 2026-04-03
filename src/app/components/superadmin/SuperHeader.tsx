import React from 'react';
import { responseUserData, supabase } from '../../App';
import { Building2, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

export default function SuperHeader({ user }: { user: responseUserData }) {
	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.reload();
	};
	return (
		<header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-purple-600 rounded-lg'>
							<Building2 className='h-6 w-6 text-white' />
						</div>
						<div>
							<h1 className='text-xl font-semibold text-gray-900'>
								LearnMate Super Admin
							</h1>
							<p className='text-sm text-gray-600  hidden md:block'>
								Platform Management Dashboard
							</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div className='text-right hidden md:block'>
							<p className='text-sm font-medium text-gray-900'>
								{user.full_name}
							</p>
							<p className='text-xs text-gray-600'>Super Administrator</p>
						</div>
						<Button variant='outline' size='sm' onClick={handleLogout}>
							<LogOut className='h-4 w-4 mr-2' />
							Logout
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
