import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactionStore } from '../context/transactionStore'

const BookCard = ({ book, onBorrow }) => {
  const navigate = useNavigate()
  const availabilityPercentage = (book.available_copies / book.total_copies) * 100

  const getAvailabilityColor = () => {
    if (availabilityPercentage >= 75) return 'text-green-600 bg-green-50'
    if (availabilityPercentage >= 50) return 'text-yellow-600 bg-yellow-50'
    if (availabilityPercentage > 0) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Book Cover Area */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-48 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.968 7.968 0 009 4.804z" />
          </svg>
        </div>
        <div className="text-white text-center z-10">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.968 7.968 0 009 4.804z" />
          </svg>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
        <p className="text-xs text-gray-500 mb-3">{book.category}</p>

        {/* Availability Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-700">Availability</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getAvailabilityColor()}`}>
              {book.available_copies}/{book.total_copies}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                availabilityPercentage >= 50 ? 'bg-green-500' : 'bg-orange-500'
              }`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* ISBN */}
        <p className="text-xs text-gray-500 mb-4">ISBN: {book.isbn}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/books/${book.book_id}`)}
            className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200 py-2 rounded-lg font-semibold transition"
          >
            Details
          </button>
          {book.available_copies > 0 ? (
            <button
              onClick={() => onBorrow(book.book_id)}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <span>Borrow</span>
            </button>
          ) : (
            <button disabled className="flex-1 bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold cursor-not-allowed">
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookCard
