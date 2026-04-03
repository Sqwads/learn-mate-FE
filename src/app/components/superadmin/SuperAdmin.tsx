import { useState } from 'react';
import { Building2, LogOut, Plus, BarChart3, Users } from 'lucide-react';
import { responseUserData, supabase } from '../../App';
import SchoolsList from './SchoolsList';
import CreateSchool from './CreateSchool';
import CreateSchoolAdmin from './CreateSchoolAdmin';
import SchoolAnalytics from './SchoolAnalytics';
import PlatformAnalytics from './PlatformAnalytics';
import { Button } from '../ui/button';
import SuperHeader from './SuperHeader';

interface SuperAdminDashboardProps {
	user: responseUserData;
}

type ViewType =
	| 'schools'
	| 'create-school'
	| 'create-admin'
	| 'school-analytics'
	| 'platform-analytics';

export default function SuperAdminDashboard({
	user,
}: SuperAdminDashboardProps) {
	const [currentView, setCurrentView] = useState<ViewType>('schools');
	const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
	const handleViewSchoolAnalytics = (schoolId: string) => {
		setSelectedSchoolId(schoolId);
		setCurrentView('school-analytics');
	};

	const renderContent = () => {
		switch (currentView) {
			case 'schools':
				return (
					<SchoolsList
						onViewAnalytics={handleViewSchoolAnalytics}
						user_id={user.user_id || ''}
					/>
				);
			case 'create-school':
				return <CreateSchool onSuccess={() => setCurrentView('schools')} />;
			case 'create-admin':
				return (
					<CreateSchoolAdmin onSuccess={() => setCurrentView('schools')} />
				);
			case 'school-analytics':
				return selectedSchoolId ? (
					<SchoolAnalytics
						schoolId={selectedSchoolId}
						onBack={() => setCurrentView('schools')}
						user_id={user.user_id || ''}
					/>
				) : null;
			case 'platform-analytics':
				return <PlatformAnalytics user_id={user.user_id || ''} />;
			default:
				return (
					<SchoolsList
						onViewAnalytics={handleViewSchoolAnalytics}
						user_id={user.user_id || ''}
					/>
				);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<SuperHeader user={user} />

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				{/* Navigation Tabs */}
				<div className='bg-white rounded-lg shadow-sm mb-6'>
					<div className='border-b border-gray-200'>
						<nav className='flex -mb-px'>
							<button
								onClick={() => setCurrentView('schools')}
								className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
									currentView === 'schools'
										? 'border-purple-600 text-purple-600'
										: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
								}`}
							>
								<Building2 className='h-4 w-4 inline-block mr-2' />
								All Schools
							</button>
							<button
								onClick={() => setCurrentView('platform-analytics')}
								className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
									currentView === 'platform-analytics'
										? 'border-purple-600 text-purple-600'
										: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
								}`}
							>
								<BarChart3 className='h-4 w-4 inline-block mr-2' />
								Platform Analytics
							</button>
						</nav>
					</div>

					{/* Quick Actions */}
					{currentView === 'schools' && (
						<div className='p-4 bg-gray-50 border-t border-gray-200 hidden'>
							<div className='flex gap-3'>
								<Button
									onClick={() => setCurrentView('create-school')}
									size='sm'
								>
									<Plus className='h-4 w-4 mr-2' />
									Create School
								</Button>
								<Button
									onClick={() => setCurrentView('create-admin')}
									variant='outline'
									size='sm'
								>
									<Users className='h-4 w-4 mr-2' />
									Create School Admin
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Main Content */}
				<div>{renderContent()}</div>
			</div>
		</div>
	);
}
