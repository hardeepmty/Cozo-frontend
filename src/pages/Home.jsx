import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white mix-blend-overlay"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white mix-blend-overlay"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="block">Plan, track, and</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-300">
                manage any project
              </span>
            </h1>
            
            <p className="text-gray-100 text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
              COZO is your all-in-one work management platform that adapts to your team's workflow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-90 transition-all duration-300 hover:shadow-xl"
              >
                Get started - It's free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-all duration-300 hover:shadow-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Work <span className="text-emerald-600">your way</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from multiple views to visualize your projects in the way that makes the most sense for you and your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <div className="p-4 rounded-xl bg-emerald-100 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
              ),
              title: 'List View',
              description: 'Perfect for tracking tasks in a simple, structured format with priorities and due dates.',
              color: 'emerald'
            },
            {
              icon: (
                <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v10zm10-2V7m0 10a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v10z" />
                  </svg>
                </div>
              ),
              title: 'Kanban Board',
              description: 'Visualize workflow with customizable columns that match your process stages.',
              color: 'blue'
            },
            {
              icon: (
                <div className="p-4 rounded-xl bg-purple-100 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ),
              title: 'Calendar',
              description: 'See deadlines and milestones in a timeline view to better manage schedules.',
              color: 'purple'
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-${feature.color}-500 hover:-translate-y-2`}
            >
              {feature.icon}
              <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Productivity Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                <span className="text-emerald-600">Boost</span> your team's productivity
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                TaskMaster provides powerful features to streamline your workflow and keep everyone aligned.
              </p>
              <ul className="space-y-4">
                {[
                  'Real-time collaboration',
                  'Customizable workflows',
                  'Automated reminders',
                  'Detailed reporting',
                  'File attachments',
                  'Mobile apps for on-the-go access'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-6 w-6 text-emerald-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-8 shadow-lg">
                <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['To Do', 'In Progress', 'Done'].map((status, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                      <h4 className="font-semibold text-gray-800 mb-3">{status}</h4>
                      <div className="space-y-3">
                        {Array(3).fill().map((_, i) => (
                          <div key={i} className="border border-gray-200 rounded p-3">
                            <div className="h-3 bg-gray-100 rounded w-3/4 mb-2"></div>
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-1">
                                <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                                <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                              </div>
                              <div className="w-6 h-2 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your team's productivity?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Join thousands of teams who are already working smarter with TaskMaster.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg shadow-lg text-emerald-600 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105"
          >
            Start your free trial today
          </Link>
        </div>
      </section>
    </div>
  );
}