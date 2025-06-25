import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({ user, activePage }) {
  const navigate = useNavigate();
  const isOrganizationContext = user && user.name && user.description;
  const orgId = isOrganizationContext ? user._id : null;

  return (
    <div className="fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out transform -translate-x-full md:translate-x-0 mt-16">
      {/* Mobile toggle button */}
      <button 
        className="md:hidden absolute right-0 top-4 -mr-10 p-2 rounded-md bg-gray-700 text-white focus:outline-none"
        onClick={() => document.querySelector('.sidebar').classList.toggle('translate-x-0')}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar content */}
      <div className="flex flex-col h-full overflow-y-auto">
        {user && (
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '')}
            </div>
            <div>
              <p className="font-medium truncate">{user.name || 'Loading...'}</p>
              {user.email && <p className="text-xs text-gray-400 truncate">{user.email}</p>}
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <Link
                to={orgId ? `/org/${orgId}` : "/dashboard"}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  (activePage === 'dashboard' || activePage === 'orgDashboard') 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Dashboard
              </Link>
            </li>
            
            {isOrganizationContext && (
              <li>
                <Link
                  to={`/org/${orgId}/projects`}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activePage === 'projects' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  All Projects
                </Link>
              </li>
            )}
            
            {activePage && activePage.startsWith('project-') && orgId && (
              <li>
                <Link
                  to={`/org/${orgId}/project/${activePage.substring(activePage.indexOf('-') + 1)}/utility`}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activePage.startsWith('project-') 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Project Utility
                </Link>
              </li>
            )}
            
            <li>
              <Link
                to="/tasks"
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  activePage === 'tasks' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Tasks
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}