import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { useBookStore } from '../context/bookStore'
import { useTransactionStore } from '../context/transactionStore'
import { useAuthStore } from '../context/authStore'

const BookDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const { currentBook, getBookById, isLoading } = useBookStore()
  const { borrowBook } = useTransactionStore()
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    if (id) {
      getBookById(id)
    }
  }, [id])

  const handleBorrow = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    setBorrowing(true)
    try {
      await borrowBook(id, 7)
      alert('Book borrowed successfully!')
      navigate('/dashboard')
    } catch (error) {
      alert('Failed to borrow book: ' + error.response?.data?.error)
    } finally {
      setBorrowing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!currentBook) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h1>
          <button
            onClick={() => navigate('/books')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    )
  }

  const availabilityPercentage = (currentBook.available_copies / currentBook.total_copies) * 100

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/books')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Catalog</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Book Cover */}
          <div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl h-96 flex items-center justify-center sticky top-20">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.968 7.968 0 009 4.804z" />
              </svg>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Title & Author */}
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentBook.title}</h1>
              <p className="text-xl text-gray-600 mb-6">by {currentBook.author}</p>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 font-semibold mb-1">ISBN</p>
                  <p className="text-lg font-semibold text-gray-900">{currentBook.isbn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold mb-1">Category</p>
                  <p className="text-lg font-semibold text-gray-900">{currentBook.category}</p>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <p className="text-sm text-gray-500 font-semibold mb-3">Availability</p>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          availabilityPercentage >= 50 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${availabilityPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right min-w-max">
                    <p className="font-bold text-gray-900">
                      {currentBook.available_copies}/{currentBook.total_copies}
                    </p>
                    <p className="text-xs text-gray-500">copies available</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {currentBook.description && (
                <div className="mb-8">
                  <p className="text-sm text-gray-500 font-semibold mb-2">Description</p>
                  <p className="text-gray-700 leading-relaxed">{currentBook.description}</p>
                </div>
              )}

              {/* Book Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 rounded-xl p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{currentBook.total_copies}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Copies</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{currentBook.available_copies}</p>
                  <p className="text-xs text-gray-600 mt-1">Available Now</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{currentBook.total_copies - currentBook.available_copies}</p>
                  <p className="text-xs text-gray-600 mt-1">Borrowed</p>
                </div>
              </div>

              {/* Borrow Button */}
              {currentBook.available_copies > 0 ? (
                <button
                  onClick={handleBorrow}
                  disabled={borrowing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 text-lg"
                >
                  {borrowing ? 'Processing...' : '📚 Borrow This Book'}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed text-lg"
                >
                  Not Available
                </button>
              )}

              {/* Info Box */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Borrowing Duration:</strong> 7 days from the date of borrowing. Late returns incur a fine of $1 per day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsPage
