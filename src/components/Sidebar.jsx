import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({ user, activePage }) {
  const navigate = useNavigate();
  const isOrganizationContext = user && user.name && user.description;
  const orgId = isOrganizationContext ? user._id : null;

  return (
    <div className="fixed inset-y-0 left-0 z-30 w-64 bg-cozo-light-beige shadow-lg text-cozo-dark-green transition-all duration-300 ease-in-out transform -translate-x-full md:translate-x-0 md:mt-12 border-r border-gray-200">
      {/* Mobile toggle button */}
      <button 
        className="md:hidden absolute right-0 top-10 -mr-10 p-2 rounded-md bg-cozo-green text-cozo-light-beige focus:outline-none focus:ring-2 focus:ring-cozo-green"
        onClick={() => document.querySelector('.sidebar').classList.toggle('translate-x-0')}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar content */}
      <div className="flex flex-col h-full overflow-y-auto">
        {user && (
          <div className="flex items-center gap-3 p-5 border-b border-gray-200 bg-cozo-green/10">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cozo-green flex items-center justify-center text-cozo-light-beige font-semibold text-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '')}
            </div>
            <div>
              <p className="font-semibold text-cozo-dark-green truncate">{user.name || 'Loading...'}</p>
              <p className="text-sm text-cozo-dark-green/70 truncate">{isOrganizationContext ? 'Organization' : 'Personal Account'}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 py-6 space-y-1">
          <ul className="space-y-1">
            <li>
              <Link
                to={orgId ? `/org/${orgId}` : "/dashboard"}
                className={`flex items-center p-3 rounded-lg mx-2 transition-colors duration-200 
                  ${(activePage === 'dashboard' || activePage === 'orgDashboard') 
                    ? 'bg-cozo-green/20 text-cozo-dark-green font-medium shadow-inner' 
                    : 'hover:bg-cozo-green/10 text-cozo-dark-green/80 hover:text-cozo-dark-green'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
                {(activePage === 'dashboard' || activePage === 'orgDashboard') && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-cozo-green"></span>
                )}
              </Link>
            </li>
            
            {isOrganizationContext && (
              <li>
                <Link
                  to={`/org/${orgId}/projects`}
                  className={`flex items-center p-3 rounded-lg mx-2 transition-colors duration-200 
                    ${activePage === 'projects' 
                      ? 'bg-cozo-green/20 text-cozo-dark-green font-medium shadow-inner' 
                      : 'hover:bg-cozo-green/10 text-cozo-dark-green/80 hover:text-cozo-dark-green'
                    }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  All Projects
                  {activePage === 'projects' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-cozo-green"></span>
                  )}
                </Link>
              </li>
            )}
            
            {activePage && activePage.startsWith('project-') && orgId && (
              <li>
                <Link
                  to={`/org/${orgId}/project/${activePage.substring(activePage.indexOf('-') + 1)}/utility`}
                  className={`flex items-center p-3 rounded-lg mx-2 transition-colors duration-200 
                    ${activePage.startsWith('project-') 
                      ? 'bg-cozo-green/20 text-cozo-dark-green font-medium shadow-inner' 
                      : 'hover:bg-cozo-green/10 text-cozo-dark-green/80 hover:text-cozo-dark-green'
                    }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Project Utility
                  {activePage.startsWith('project-') && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-cozo-green"></span>
                  )}
                </Link>
              </li>
            )}
            
            <li>
              <Link
                to="/tasks"
                className={`flex items-center p-3 rounded-lg mx-2 transition-colors duration-200 
                  ${activePage === 'tasks' 
                    ? 'bg-cozo-green/20 text-cozo-dark-green font-medium shadow-inner' 
                    : 'hover:bg-cozo-green/10 text-cozo-dark-green/80 hover:text-cozo-dark-green'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                My Tasks
                {activePage === 'tasks' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-cozo-green"></span>
                )}
              </Link>
            </li>
          </ul>

          {/* Bottom section - Settings/Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-cozo-light-beige">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/settings"
                  className="flex items-center p-3 rounded-lg mx-2 text-cozo-dark-green/80 hover:bg-cozo-green/10 hover:text-cozo-dark-green transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                  className="w-full flex items-center p-3 rounded-lg mx-2 text-cozo-dark-green/80 hover:bg-cozo-green/10 hover:text-cozo-dark-green transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}