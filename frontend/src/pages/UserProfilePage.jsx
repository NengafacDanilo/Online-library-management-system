import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { useAuthStore } from '../context/authStore'

const UserProfilePage = () => {
  const navigate = useNavigate()
  const { user, token, getProfile, updateProfile, isLoading } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    getProfile()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(formData.name, formData.email)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {user?.role === 'admin' ? '👑 Admin' : '👤 Member'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">Full Name</label>
                <p className="text-lg text-gray-900 font-semibold">{user?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">Email</label>
                <p className="text-lg text-gray-900 font-semibold">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">Role</label>
                <p className="text-lg text-gray-900 font-semibold">
                  {user?.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">Member Since</label>
                <p className="text-lg text-gray-900 font-semibold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {[
            {
              icon: '📚',
              title: 'Borrowing Rules',
              items: [
                'Borrow up to 7 days per book',
                '$1 fine per day for late returns',
                'Return books anytime',
              ],
            },
            {
              icon: '⚙️',
              title: 'Account Settings',
              items: [
                'Change your profile information',
                'View your borrowing history',
                'Track due dates',
              ],
            },
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{card.title}</h3>
              <ul className="space-y-2">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-gray-600">
                    <span className="text-blue-600">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
