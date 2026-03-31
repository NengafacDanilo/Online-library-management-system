import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import { useAuthStore } from '../context/authStore'
import { useTransactionStore } from '../context/transactionStore'
import { useNavigate } from 'react-router-dom'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { userHistory, activeTransactions, getActiveTransactions, getUserHistory } = useTransactionStore()

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    if (user?.user_id) {
      getActiveTransactions(user.user_id)
      getUserHistory(user.user_id)
    }
  }, [user])

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (daysUntilDue) => {
    if (daysUntilDue <= 0) return 'bg-red-50 border-red-200 text-red-700'
    if (daysUntilDue <= 3) return 'bg-yellow-50 border-yellow-200 text-yellow-700'
    return 'bg-green-50 border-green-200 text-green-700'
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-blue-100">Manage your borrowed books and reading journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Stats Cards */}
          {[
            {
              label: 'Currently Borrowing',
              value: activeTransactions.length,
              icon: '📚',
              color: 'bg-blue-50 border-blue-200',
            },
            {
              label: 'Total Borrowed',
              value: userHistory.length,
              icon: '📖',
              color: 'bg-purple-50 border-purple-200',
            },
            {
              label: 'Overdue Books',
              value: activeTransactions.filter((t) => getDaysUntilDue(t.due_date) <= 0).length,
              icon: '⚠️',
              color: 'bg-red-50 border-red-200',
            },
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.color} border rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Borrows */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Active Borrows</h2>
          
          {activeTransactions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h6m0 0h6" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No active borrows</h3>
              <p className="text-gray-600 mb-4">You haven't borrowed any books yet</p>
              <button
                onClick={() => navigate('/books')}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Browse Books
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Book Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Author</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Borrowed</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTransactions.map((transaction) => {
                    const daysUntilDue = getDaysUntilDue(transaction.due_date)
                    const statusColor = getStatusColor(daysUntilDue)
                    
                    return (
                      <tr key={transaction.transaction_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-semibold text-gray-900">{transaction.title}</td>
                        <td className="py-4 px-4 text-gray-600">{transaction.author}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(transaction.issue_date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(transaction.due_date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${statusColor}`}>
                            {daysUntilDue <= 0
                              ? '⚠️ Overdue'
                              : daysUntilDue === 1
                              ? '⏰ Due Tomorrow'
                              : `${daysUntilDue} days left`}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Borrowing History */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Borrowing History</h2>
          
          {userHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No borrowing history yet
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userHistory.map((transaction) => (
                <div key={transaction.transaction_id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{transaction.title}</h4>
                      <p className="text-sm text-gray-600">{transaction.author}</p>
                    </div>
                    {transaction.status === 'returned' && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Returned
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Borrowed</p>
                      {new Date(transaction.issue_date).toLocaleDateString()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Due</p>
                      {new Date(transaction.due_date).toLocaleDateString()}
                    </div>
                    {transaction.return_date && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Returned</p>
                        {new Date(transaction.return_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {transaction.fine > 0 && (
                    <div className="mt-2 text-sm font-semibold text-red-600">
                      Fine: ${transaction.fine.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
