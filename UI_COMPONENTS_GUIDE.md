cd backend
npm install

cd ../frontend
npm install# LibraryHub - UI Components Guide

## 🎨 Component Architecture

### Navigation Bar (`NavBar.jsx`)
- **Location**: `src/components/NavBar.jsx`
- **Features**:
  - Responsive navigation with gradient background
  - Dynamic user menu with dropdown
  - Authentication-aware links
  - Admin access indicator
  - Smooth transitions and hover effects

**Props**: None (uses context)

### Book Card (`BookCard.jsx`)
- **Location**: `src/components/BookCard.jsx`
- **Features**:
  - Beautiful book cover visualization
  - Availability bar with color coding
  - Quick action buttons (Details, Borrow)
  - Book metadata display
  - Responsive design

**Props**:
```javascript
{
  book: {
    book_id: number,
    title: string,
    author: string,
    isbn: string,
    category: string,
    total_copies: number,
    available_copies: number,
  },
  onBorrow: function
}
```

---

## 📄 Page Components

### Home Page (`HomePage.jsx`)
**Route**: `/`

**Features**:
- 🎯 Hero section with call-to-action
- ✨ Feature highlights
- 📚 Featured books showcase
- 🎬 Gradient animations
- 📱 Fully responsive design

**Layout**:
1. Navigation bar
2. Hero section (title, CTA buttons, illustration)
3. Features grid (3 cards)
4. Featured books section
5. Bottom CTA section

### Login Page (`LoginPage.jsx`)
**Route**: `/login`

**Features**:
- 🔐 Secure login form
- ✅ Email validation
- 🔑 Password field
- 📱 Mobile-responsive
- 🎨 Card-based design
- Link to registration

**Form Fields**:
- Email (required)
- Password (required)

### Register Page (`RegisterPage.jsx`)
**Route**: `/register`

**Features**:
- 📝 User registration form
- ✅ Full name input
- 🔄 Password confirmation
- 🛡️ Password validation (min 6 chars)
- 📱 Mobile-responsive
- Link to login

**Form Fields**:
- Full Name (required)
- Email (required)
- Password (required, min 6 chars)
- Confirm Password (required)

### Catalog Page (`CatalogPage.jsx`)
**Route**: `/books`

**Features**:
- 🔍 Advanced search with real-time filtering
- 📂 Category sidebar filtering
- 🔀 Multiple sorting options
- 📊 Pagination support
- 📱 Responsive grid layout
- Loading states
- Empty state handling

**Sidebar Filters**:
- Category selection
- Sort options:
  - Title (A-Z)
  - Author (A-Z)
  - Most Available

### Book Details Page (`BookDetailsPage.jsx`)
**Route**: `/books/:id`

**Features**:
- 📖 Large book cover visualization
- 📊 Detailed availability information
- 📈 Availability percentage bar
- 📋 Book metadata display
- 📝 Description section
- 📚 Borrowing information
- 🎯 Prominent borrow button
- 💡 Borrowing rules info box

**Displayed Info**:
- Title and author
- ISBN and category
- Description
- Total/available/borrowed copies
- Availability percentage
- Borrow button with availability check

### Dashboard Page (`DashboardPage.jsx`)
**Route**: `/dashboard`

**Features**:
- 👋 Personalized welcome banner
- 📊 Statistics cards (current borrows, total borrowed, overdue)
- 📚 Active borrows table
  - Book title, author, dates
  - Due date countdown
  - Color-coded status
- 📖 Borrowing history section
  - Scrollable list
  - Borrow/return dates
  - Fine information
- 🔐 Protected route (requires login)

**Stats Displayed**:
- Currently Borrowing count
- Total Books Borrowed count
- Overdue Books count

**Active Borrows Table Columns**:
- Book Title
- Author
- Borrowed Date
- Due Date
- Status (Days left, Due Tomorrow, Overdue)

### User Profile Page (`UserProfilePage.jsx`)
**Route**: `/profile`

**Features**:
- 👤 Profile avatar
- ✏️ Edit profile functionality
- 👁️ View/edit mode toggle
- 📋 Member information display
- 📚 Borrowing rules card
- ⚙️ Account settings card
- 🔐 Protected route (requires login)

**Editable Fields**:
- Full Name
- Email

**Display-only Fields**:
- Role (Member/Admin)
- Member Since date

---

## 🎯 Design System

### Color Palette
```
Primary: #1e40af (Blue)
Dark Primary: #1e3a8a (Dark Blue)
Success: #22c55e (Green)
Warning: #eab308 (Yellow)
Error: #ef4444 (Red)
Background: #f3f4f6 (Light Gray)
Text: #111827 (Dark Gray)
```

### Typography
- **H1**: 3.75rem (60px) - Bold
- **H2**: 2.25rem (36px) - Bold
- **H3**: 1.875rem (30px) - Bold
- **H4**: 1.5rem (24px) - Bold
- **Body**: 1rem (16px) - Regular
- **Small**: 0.875rem (14px) - Regular
- **Extra Small**: 0.75rem (12px) - Regular

### Spacing
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Border Radius
- Small: 0.5rem (8px)
- Medium: 1rem (16px)
- Large: 1.5rem (24px)
- Extra Large: 2rem (32px)

### Shadows
- Small: `shadow-md`
- Medium: `shadow-lg`
- Large: `shadow-xl`

---

## 🔧 Reusable Patterns

### Button Styles

**Primary Button** (CTA)
```jsx
<button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition">
  Click Me
</button>
```

**Secondary Button** (Alternative)
```jsx
<button className="bg-gray-100 text-gray-800 hover:bg-gray-200 py-2 rounded-lg font-semibold transition">
  Click Me
</button>
```

**Icon Button**
```jsx
<button className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">...</svg>
  <span>Label</span>
</button>
```

### Form Input Styles
```jsx
<input
  type="text"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
  placeholder="Enter text"
/>
```

### Card Pattern
```jsx
<div className="bg-white rounded-2xl shadow-lg p-8">
  {/* Content */}
</div>
```

### Grid Layouts
- **2 Column**: `grid grid-cols-2 gap-6`
- **3 Column**: `grid md:grid-cols-3 gap-6`
- **Responsive**: `grid lg:grid-cols-4 gap-8`

---

## 📱 Responsive Breakpoints

Using Tailwind CSS breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Responsive Patterns
```jsx
// Mobile-first approach
<div className="grid md:grid-cols-2 lg:grid-cols-3">
  {/* Single column on mobile, 2 on tablet, 3 on desktop */}
</div>

// Hidden on mobile
<div className="hidden md:block">
  {/* Only visible on medium screens and above */}
</div>
```

---

## 🎬 Animations & Transitions

### Hover Effects
```css
.transition
.hover:shadow-lg
.hover:bg-blue-700
.duration-300
```

### Loading Spinner
```jsx
<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
```

### Fade In
```jsx
<div className="opacity-0 animate-fadeIn">Content</div>
```

---

## 🔐 Protected Routes

All authenticated routes should check for `token` in auth store:

```jsx
useEffect(() => {
  if (!token) {
    navigate('/login')
    return
  }
  // Component logic
}, [token])
```

---

## 📊 Data Display Components

### Status Badge
```jsx
<span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
  Active
</span>
```

### Availability Bar
```jsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className="h-2 rounded-full bg-green-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Statistics Card
```jsx
<div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
  <p className="text-gray-600 text-sm font-semibold mb-1">Label</p>
  <p className="text-4xl font-bold text-gray-900">Value</p>
</div>
```

---

## 🎨 Tailwind CSS Classes Used

### Backgrounds
- `bg-gradient-to-r from-blue-600 to-blue-800`
- `bg-white`, `bg-gray-50`, `bg-gray-100`
- `bg-blue-50`, `bg-red-50`, `bg-green-50`

### Text
- `text-gray-900` (dark text)
- `text-gray-600` (medium text)
- `text-gray-500` (light text)
- `font-bold`, `font-semibold`, `font-normal`

### Borders
- `border border-gray-300`
- `border-l border-blue-200`
- `border-t border-gray-200`

### Shadows
- `shadow-md`, `shadow-lg`, `shadow-xl`

### Spacing
- Padding: `p-4`, `px-4 py-3`, `py-12`
- Margin: `mb-4`, `mt-2`, `mx-auto`
- Gap: `gap-4`, `gap-6`, `gap-8`

---

## 🚀 Component Usage Examples

### Using BookCard Component
```jsx
import BookCard from '../components/BookCard'

<BookCard 
  book={bookObject} 
  onBorrow={(bookId) => handleBorrow(bookId)}
/>
```

### Using AuthStore in Components
```jsx
import { useAuthStore } from '../context/authStore'

const { user, token, login, logout } = useAuthStore()
```

### Using BookStore in Components
```jsx
import { useBookStore } from '../context/bookStore'

const { books, isLoading, getAllBooks, searchBooks } = useBookStore()
```

---

## 📋 Future Component Ideas

- ⭐ Book reviews component
- 🔔 Notification toast system
- 📅 Calendar date picker
- 🎯 Modal dialogs
- 📊 Analytics dashboard
- 🔐 Permission-based UI components
- 🎞️ Image carousel
- 💬 Comments section
- 🏆 Leaderboard
- 🎁 Reward badges

---

## 📝 Notes

- All components use Tailwind CSS for styling
- Zustand stores manage global state
- React Router handles navigation
- Axios handles API calls with automatic token injection
- Components are fully responsive and mobile-friendly
- Dark mode ready (can be extended)
- Accessibility features included (semantic HTML, ARIA labels where needed)
