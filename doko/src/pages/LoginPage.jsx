"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios" // Added axios import for API calls

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "buyer",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email: formData.email,
        password: formData.password,
      })

      const { token, user } = response.data

      localStorage.setItem("authToken", token)

      setCurrentUser({
        id: user.id,
        name: user.name,
        email: formData.email,
        role: user.role,
        type: formData.userType,
      })

      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Select your account type and enter your credentials
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="userType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                I am a
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller/Farmer</option>
                <option value="admin">Administrator</option>
                <option value="merchant">Merchant/Transporter</option>
              </select>
            </div>

            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading} // Disable inputs during loading
                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-t-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:opacity-50"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading} // Disable inputs during loading
                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-b-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading} // Disable button during loading
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                Sign up now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
