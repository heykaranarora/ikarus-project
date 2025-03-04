import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-wide">
              3D Viewer
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition">
              Home
            </Link>
            <Link to="/viewmodel" className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition">
              view Model
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-2">
          <Link to="/" className="block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition">
            Home
          </Link>
          <Link to="/viewmodel" className="block px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition">
           View Models
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
