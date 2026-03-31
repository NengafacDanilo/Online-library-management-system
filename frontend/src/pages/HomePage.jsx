import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../context/bookStore'
import { useAuthStore } from '../context/authStore'
import NavBar from '../components/NavBar'
import BookCard from '../components/BookCard'
import { useTransactionStore } from '../context/transactionStore'

const HomePage = () => {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const { books, isLoading, getAllBooks } = useBookStore()
  const { borrowBook } = useTransactionStore()

  useEffect(() => {
    getAllBooks(6, 0)
  }, [])

  const handleBorrow = async (bookId) => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      await borrowBook(bookId, 7)
      alert('Book borrowed successfully!')
    } catch (error) {
      alert('Failed to borrow book: ' + error.response?.data?.error)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Digital Library Awaits
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover thousands of books, manage your borrowing, and explore new worlds. All in one place.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/books')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
                >
                  Browse Catalog
                </button>
                {!token && (
                  <button
                    onClick={() => navigate('/register')}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-lg blur-3xl opacity-30"></div>
                <svg className="relative w-full h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="50" y="60" width="120" height="280" fill="white" rx="8" opacity="0.9" />
                  <rect x="100" y="80" width="120" height="280" fill="white" rx="8" opacity="0.7" />
                  <rect x="150" y="100" width="120" height="280" fill="white" rx="8" opacity="0.5" />
                  <path d="M80 100 L160 60 L170 200" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose LibraryHub?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📚', title: 'Vast Collection', desc: 'Thousands of books across all categories' },
            { icon: '⚡', title: 'Quick Borrowing', desc: 'Borrow and return books in seconds' },
            { icon: '📱', title: 'Easy Management', desc: 'Track your borrowing history and due dates' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Books */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Featured Books</h2>
            <button
              onClick={() => navigate('/books')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book.book_id} book={book} onBorrow={handleBorrow} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to explore?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of book lovers and start your reading journey today
          </p>
          <button
            onClick={() => navigate(token ? '/books' : '/register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            {token ? 'Browse Books' : 'Sign Up Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
