"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Alert from "../components/Alert"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()

  const { name, email, password } = formData

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return "#ef4444"
    if (strength <= 4) return "#f59e0b"
    return "#10b981"
  }

  const getPasswordStrengthText = (strength) => {
    if (strength <= 2) return "Weak"
    if (strength <= 4) return "Medium"
    return "Strong"
  }

  const onChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value }
    setFormData(newFormData)

    if (e.target.name === "password") {
      setPasswordStrength(calculatePasswordStrength(e.target.value))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post("https://cozo-backend.onrender.com/api/auth/register", {
        name,
        email,
        password,
      })

      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#ecebe1" }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #5a6f3b 0%, #3d4b28 50%, #2d3a1f 100%)",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-16 left-16 w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-32 right-24 w-32 h-32 rounded-full bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute bottom-24 left-24 w-36 h-36 rounded-full bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute bottom-16 right-16 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl mb-6"
              style={{ background: "linear-gradient(135deg, #ffffff, #f8fafc)" }}
            >
              <img src="/cozo.png"/>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-center">Join Cozo Today</h1>
            <p className="text-xl text-white/90 text-center max-w-md leading-relaxed">
              Start your journey with the most comprehensive project management platform designed for modern teams.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-6 max-w-md">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Get Started Instantly</h3>
                <p className="text-white/80">Set up your workspace in minutes</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Enterprise Security</h3>
                <p className="text-white/80">Your data is protected and encrypted</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">24/7 Support</h3>
                <p className="text-white/80">Get help whenever you need it</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Free to Start</h3>
                <p className="text-white/80">No credit card required</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
            >
              <span className="text-white">C</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#3d4b28" }}>
              Create Account
            </h1>
          </div>

          {/* Registration Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div
                  className="w-2 h-12 rounded-full"
                  style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
                ></div>
                <h2 className="text-3xl font-bold" style={{ color: "#3d4b28" }}>
                  Sign Up
                </h2>
              </div>
              <p className="text-gray-600 text-lg">Create your Cozo account</p>
            </div>

            {/* Error Alert */}
            {error && <Alert message={error} type="error" className="mb-6" onClose={() => setError("")} />}

            {/* Registration Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#3d4b28" }}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: "#e2e8f0",
                      focusBorderColor: "#5a6f3b",
                      focusRingColor: "#5a6f3b",
                    }}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#3d4b28" }}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: "#e2e8f0",
                      focusBorderColor: "#5a6f3b",
                      focusRingColor: "#5a6f3b",
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#3d4b28" }}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: "#e2e8f0",
                      focusBorderColor: "#5a6f3b",
                      focusRingColor: "#5a6f3b",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Password Strength</span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: getPasswordStrengthColor(passwordStrength) }}
                      >
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(passwordStrength / 6) * 100}%`,
                          backgroundColor: getPasswordStrengthColor(passwordStrength),
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Password should contain:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li className={password.length >= 6 ? "text-green-600" : ""}>At least 6 characters</li>
                        <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>One uppercase letter</li>
                        <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>One number</li>
                        <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>One special character</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 rounded border-2 focus:ring-2 transition-all duration-300"
                  style={{
                    borderColor: "#5a6f3b",
                    accentColor: "#5a6f3b",
                  }}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="font-semibold hover:underline" style={{ color: "#5a6f3b" }}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold hover:underline" style={{ color: "#5a6f3b" }}>
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: loading
                    ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                    : "linear-gradient(135deg, #5a6f3b, #3d4b28)",
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      style={{ borderTopColor: "transparent" }}
                    ></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span>Create Account</span>
                  </div>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold hover:underline transition-all duration-300"
                  style={{ color: "#5a6f3b" }}
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Additional Links */}
            <div className="mt-6 flex justify-center space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Contact Support
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Help Center
              </a>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>We protect your data with industry-leading security measures</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
