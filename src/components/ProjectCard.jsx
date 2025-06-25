const statusColors = {
  not_started: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  on_hold: 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800'
}

const statusIcons = {
  not_started: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  in_progress: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  on_hold: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  completed: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function ProjectCard({ project, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100 hover:border-cozo-green/30"
    >
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 h-1 w-full ${
        project.status === 'not_started' ? 'bg-gray-300' :
        project.status === 'in_progress' ? 'bg-blue-400' :
        project.status === 'on_hold' ? 'bg-amber-400' :
        'bg-emerald-400'
      }`}></div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-cozo-dark-green group-hover:text-cozo-green transition-colors duration-200 line-clamp-2">
            {project.name}
          </h3>
          
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            statusColors[project.status] || statusColors.not_started
          }`}>
            {statusIcons[project.status] || statusIcons.not_started}
            {project.status.replace('_', ' ')}
          </span>
        </div>

        <p className="text-sm text-cozo-dark-green/70 mb-4 line-clamp-3">
          {project.description || 'No description provided'}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-cozo-dark-green/70">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {project.endDate ? (
              <span>
                Due {new Date(project.endDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: project.endDate.includes(new Date().getFullYear()) ? undefined : 'numeric'
                })}
              </span>
            ) : (
              <span>No deadline</span>
            )}
          </div>
          
          {/* Progress indicator (optional - can be added if project has progress data) */}
          {/* <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cozo-green" 
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div> */}
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-cozo-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}