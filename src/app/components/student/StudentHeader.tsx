import { GraduationCap, LogOut } from 'lucide-react';
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { supabase } from '../../App';

export default function StudentHeader({
	name,
	school_name,
}: {
	name: string;
	school_name: string;
}) {
	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.reload();
	};
	return (
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
							<p className='text-sm text-gray-600'>{school_name}</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div className='text-right'>
							<p className='text-sm font-medium text-gray-900'>{name}</p>
							<Badge variant='outline' className='text-xs'>
								Student
							</Badge>
						</div>
						<Button variant='outline' onClick={handleLogout}>
							<LogOut className='h-4 w-4 mr-2' />
							Logout
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
