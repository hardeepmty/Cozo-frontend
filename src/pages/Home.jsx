import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay, FiCheckCircle, FiUsers, FiZap, FiShield } from "react-icons/fi" ;

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
    // Set a timeout to trigger the animation after component mounts
    // This provides a subtle delay for the initial animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100); // Small delay to ensure CSS transitions apply

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [])


  return (
    <div className="min-h-screen bg-cozo-light-beige font-sans text-cozo-dark-green">


      {/* Hero Section */}
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cozo-green via-cozo-dark-green to-emerald-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/5 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-cozo-light-beige/10 animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 rounded-full bg-white/5 animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 rounded-full bg-cozo-light-beige/10 animate-bounce delay-700"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Gradient overlays for depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-cozo-dark-green/20"></div>
      </div>

      {/* Adjusted top padding: py-10 md:py-20 */}
      <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <FiCheckCircle className="w-4 h-4 text-cozo-light-beige mr-2" />
              <span className="text-cozo-light-beige text-sm font-medium">Trusted by 50,000+ teams worldwide</span>
            </div>

            <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-8">
              <span className="block mb-2">Work without</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cozo-light-beige via-amber-200 to-yellow-300 animate-pulse">
                chaos.
              </span>
              <span className="block text-4xl md:text-5xl mt-4 text-white/90">Teamwork made simple.</span>
            </h1>

            <p className="text-cozo-light-beige/90 text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed">
              COZO helps teams organize, track, and manage their work—from daily tasks to strategic initiatives.
              <span className="block mt-2 text-lg text-cozo-light-beige/70">
                Join thousands of teams already working smarter.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/register" // Changed href to to
                className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-2xl text-cozo-dark-green bg-cozo-light-beige hover:bg-white transition-all duration-300 hover:shadow-3xl hover:scale-105 transform"
              >
                Get started - It's free
                <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/demo" // Changed href to to
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-cozo-light-beige/50 text-lg font-semibold rounded-xl text-cozo-light-beige hover:bg-white/10 hover:border-cozo-light-beige transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                <FiPlay className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch demo
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-cozo-light-beige/90 ml-2 font-medium">4.9/5</span>
              </div>
              <div className="text-cozo-light-beige/70 text-sm">from 10,000+ reviews on G2, Capterra & Trustpilot</div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="relative">
              {/* Main Feature Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-cozo-light-beige rounded-xl flex items-center justify-center mr-4">
                    <FiZap className="w-6 h-6 text-cozo-dark-green" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Lightning Fast Setup</h3>
                    <p className="text-cozo-light-beige/70 text-sm">Get started in under 2 minutes</p>
                  </div>
                </div>

                {/* Mini feature list */}
                <div className="space-y-3">
                  <div className="flex items-center text-cozo-light-beige/90">
                    <FiCheckCircle className="w-4 h-4 mr-3 text-green-400" />
                    <span className="text-sm">No credit card required</span>
                  </div>
                  <div className="flex items-center text-cozo-light-beige/90">
                    <FiUsers className="w-4 h-4 mr-3 text-blue-400" />
                    <span className="text-sm">Unlimited team members</span>
                  </div>
                  <div className="flex items-center text-cozo-light-beige/90">
                    <FiShield className="w-4 h-4 mr-3 text-purple-400" />
                    <span className="text-sm">Enterprise-grade security</span>
                  </div>
                </div>
              </div>

              {/* Floating accent cards */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 shadow-lg transform rotate-3">
                <div className="text-white font-bold text-sm">99.9% Uptime</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-4 shadow-lg transform -rotate-3">
                <div className="text-white font-bold text-sm">24/7 Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div
          className={`mt-20 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-cozo-light-beige mb-2">50K+</div>
              <div className="text-cozo-light-beige/70 text-sm">Active Teams</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-cozo-light-beige mb-2">2M+</div>
              <div className="text-cozo-light-beige/70 text-sm">Tasks Completed</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-cozo-light-beige mb-2">99.9%</div>
              <div className="text-cozo-light-beige/70 text-sm">Uptime</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-cozo-light-beige mb-2">150+</div>
              <div className="text-cozo-light-beige/70 text-sm">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Trusted By Section */}
<section className="py-12 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left-aligned text */}
      <p className="text-gray-500 text-3xl uppercase tracking-wide w-full md:w-auto text-center md:text-left">
        Trusted by teams at
      </p>

      {/* Right-aligned logos */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 items-center justify-center">
        {[
          { name: 'Dropbox', logo: 'https://cdn.worldvectorlogo.com/logos/dropbox-2.svg' },
          { name: 'Uber', logo: 'https://cdn.worldvectorlogo.com/logos/uber-2.svg' },
          { name: 'Slack', logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' },
          { name: 'Netflix', logo: 'https://cdn.worldvectorlogo.com/logos/netflix-3.svg' },
          { name: 'Spotify', logo: 'https://cdn.worldvectorlogo.com/logos/spotify-2.svg' },
        ].map((company) => (
          <div key={company.name} className="flex justify-center items-center">
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="h-8 object-contain grayscale hover:grayscale-0 transition duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto bg-cozo-light-beige">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-cozo-dark-green mb-6">
            Work <span className="text-cozo-green">your way</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from multiple views to visualize your projects in the way that makes the most sense for you and your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <div className="p-4 rounded-xl bg-emerald-100 text-cozo-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
              ),
              title: 'List View',
              description: 'Perfect for tracking tasks in a simple, structured format with priorities and due dates.',
              color: 'cozo-green'
            },
            {
              icon: (
                <div className="p-4 rounded-xl bg-blue-100 text-cozo-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v10zm10-2V7m0 10a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v10z" />
                  </svg>
                </div>
              ),
              title: 'Kanban Board',
              description: 'Visualize workflow with customizable columns that match your process stages.',
              color: 'cozo-green'
            },
            {
              icon: (
                <div className="p-4 rounded-xl bg-purple-100 text-cozo-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ),
              title: 'Calendar',
              description: 'See deadlines and milestones in a timeline view to better manage schedules.',
              color: 'cozo-green'
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-${feature.color} hover:-translate-y-2`}
            >
              {feature.icon}
              <h3 className="text-2xl font-bold text-cozo-dark-green mt-6 mb-3">{feature.title}</h3>
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
              <h2 className="text-3xl md:text-4xl font-bold text-cozo-dark-green mb-6">
                <span className="text-cozo-green">Boost</span> your team's productivity
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                COZO provides powerful features to streamline your workflow and keep everyone aligned.
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
                    <svg className="h-6 w-6 text-cozo-green mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/features" className="text-cozo-green font-medium hover:underline">
                  Explore all features →
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-gradient-to-br from-cozo-light-beige to-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="bg-white rounded-lg p-4 shadow-md mb-6 border border-gray-100">
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
                    <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
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

      {/* Testimonials */}
      <section className="py-20 bg-cozo-light-beige">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-cozo-dark-green mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how teams of all sizes use COZO to do their best work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "COZO has transformed how our team collaborates. We're 30% more productive since switching.",
                author: "Sarah Johnson",
                role: "Product Manager, TechCorp",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "The intuitive interface made adoption seamless across our organization of 500+ people.",
                author: "Michael Chen",
                role: "CTO, StartupCo",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "Finally a tool that scales with our growing needs without becoming bloated.",
                author: "Emma Rodriguez",
                role: "Marketing Director, BrandWorks",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="inline-block h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img className="h-12 w-12 rounded-full mr-4" src={testimonial.avatar} alt={testimonial.author} />
                  <div>
                    <p className="font-medium text-cozo-dark-green">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-cozo-dark-green mb-4">
              Works with the tools you love
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              COZO integrates seamlessly with your favorite apps to bring all your work into one place
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-center">
            {['Slack', 'Google Drive', 'Zoom', 'Microsoft Teams', 'Dropbox', 'GitHub'].map((tool) => (
              <div key={tool} className="flex justify-center items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <div className="h-12 w-12 bg-cozo-green rounded-full flex items-center justify-center text-white font-medium">
                  {tool.charAt(0)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/integrations" className="inline-flex items-center text-cozo-green font-medium hover:underline">
              View all integrations →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 bg-gradient-to-r from-cozo-green to-cozo-dark-green">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your team's productivity?
          </h2>
          <p className="text-xl text-cozo-light-beige mb-10 max-w-2xl mx-auto">
            Join thousands of teams who are already working smarter with COZO.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg shadow-lg text-cozo-dark-green bg-cozo-light-beige hover:bg-white transition-all duration-300 hover:scale-105"
            >
              Start your free trial
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-cozo-light-beige text-lg font-semibold rounded-lg text-cozo-light-beige hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              Compare plans
            </Link>
          </div>
          <p className="mt-6 text-cozo-light-beige">
            Free forever for up to 15 users. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cozo-dark-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-cozo-light-beige">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-cozo-light-beige">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-cozo-light-beige">Integrations</Link></li>
                <li><Link to="/updates" className="hover:text-cozo-light-beige">Updates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link to="/marketing" className="hover:text-cozo-light-beige">Marketing</Link></li>
                <li><Link to="/product" className="hover:text-cozo-light-beige">Product Management</Link></li>
                <li><Link to="/engineering" className="hover:text-cozo-light-beige">Engineering</Link></li>
                <li><Link to="/operations" className="hover:text-cozo-light-beige">Operations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="hover:text-cozo-light-beige">Blog</Link></li>
                <li><Link to="/guides" className="hover:text-cozo-light-beige">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-cozo-light-beige">About</Link></li>
                <li><Link to="/careers" className="hover:text-cozo-light-beige">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-cozo-light-beige">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Link to="#" className="hover:text-cozo-light-beige">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link to="#" className="hover:text-cozo-light-beige">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400">
            <p>© 2025 COZO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}