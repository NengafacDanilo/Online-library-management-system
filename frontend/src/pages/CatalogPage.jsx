import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import BookCard from '../components/BookCard'
import { useBookStore } from '../context/bookStore'
import { useTransactionStore } from '../context/transactionStore'
import { useAuthStore } from '../context/authStore'
import { useNavigate } from 'react-router-dom'

const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const { books, isLoading, error, getAllBooks, searchBooks, getBooksByCategory } = useBookStore()
  const { borrowBook } = useTransactionStore()
  const categories = ['Computer Science', 'Software Development', 'Web Development', 'Programming']

  useEffect(() => {
    getAllBooks()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      await searchBooks(searchQuery)
    } else {
      await getAllBooks()
    }
  }

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category)
    if (category) {
      await getBooksByCategory(category)
    } else {
      await getAllBooks()
    }
  }

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

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'author') return a.author.localeCompare(b.author)
    if (sortBy === 'available') return b.available_copies - a.available_copies
    return 0
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Catalog</h1>
          <p className="text-gray-600">Discover and borrow from our collection of {books.length} books</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 bg-white p-4 rounded-xl shadow-md">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryFilter('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      !selectedCategory
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryFilter(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="title">Title (A-Z)</option>
                  <option value="author">Author (A-Z)</option>
                  <option value="available">Most Available</option>
                </select>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading books...</p>
              </div>
            ) : sortedBooks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {sortedBooks.map((book) => (
                  <BookCard key={book.book_id} book={book} onBorrow={handleBorrow} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogPage
