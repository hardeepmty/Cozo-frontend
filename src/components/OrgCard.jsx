export default function OrgCard({ org, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Decorative accent bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cozo-green to-cozo-dark-green"></div>
      
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {/* Organization initial avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-cozo-green/10 text-cozo-green flex items-center justify-center text-xl font-bold group-hover:bg-cozo-green/20 transition-colors duration-300">
            {org.name.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-cozo-dark-green group-hover:text-cozo-dark-green/90 transition-colors duration-300 line-clamp-2">
              {org.name}
            </h3>
            <p className="text-sm text-cozo-dark-green/70 mt-1 line-clamp-2">
              {org.description || 'No description provided'}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-cozo-green mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-medium text-cozo-dark-green/70">Join Code: {org.joinCode}</span>
          </div>
          
          <div className="text-xs text-cozo-dark-green/50">
            Created {new Date(org.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-cozo-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}