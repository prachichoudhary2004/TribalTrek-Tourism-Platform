"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Mountain, User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <Mountain className="h-6 w-6" />
        Jharkhand Tourism
      </Link>

      {/* Desktop Navigation */}
      <ul className="navbar-links">
        <li>
          <Link href="/destinations">Destinations</Link>
        </li>
        <li>
          <Link href="/ai-features">Smart Features</Link>
        </li>
        <li>
          <Link href="/marketplace">Marketplace</Link>
        </li>
        <li>
          <Link href="/feedback">Feedback</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>

      {/* Authentication Section */}
      {!isLoading && (
        <>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 navbar-button"
              >
                <User className="h-4 w-4" />
                <span>{user?.name || 'User'}</span>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-50" style={{
                  background: 'linear-gradient(135deg, rgba(128, 0, 32, 0.2) 0%, rgba(30, 58, 138, 0.2) 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(244, 208, 63, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}>
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        color: '#f4d03f',
                        textShadow: '0 1px 3px rgba(244, 208, 63, 0.3)'
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        (e.target as HTMLAnchorElement).style.background = 'rgba(244, 208, 63, 0.1)';
                        (e.target as HTMLAnchorElement).style.borderRadius = '8px';
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        (e.target as HTMLAnchorElement).style.background = 'transparent';
                      }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" style={{ color: '#f4d03f' }} />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsUserMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        color: '#f4d03f',
                        textShadow: '0 1px 3px rgba(244, 208, 63, 0.3)'
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.target as HTMLButtonElement).style.background = 'rgba(244, 208, 63, 0.1)';
                        (e.target as HTMLButtonElement).style.borderRadius = '8px';
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.target as HTMLButtonElement).style.background = 'transparent';
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" style={{ color: '#f4d03f' }} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <button className="navbar-button">Get Started</button>
            </Link>
          )}
        </>
      )}

      {/* Mobile menu button */}
      <button className="mobile-menu-button md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link href="/destinations" onClick={() => setIsMenuOpen(false)}>
            Destinations
          </Link>
          <Link href="/ai-features" onClick={() => setIsMenuOpen(false)}>
            Smart Features
          </Link>
          <Link href="/marketplace" onClick={() => setIsMenuOpen(false)}>
            Marketplace
          </Link>
          <Link href="/feedback" onClick={() => setIsMenuOpen(false)}>
            Feedback
          </Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          
          {/* Mobile Authentication */}
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center text-white hover:text-yellow-300 transition-colors">
                    <User className="h-4 w-4 mr-2" />
                    Profile ({user?.name})
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center text-white hover:text-yellow-300 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <button className="navbar-button w-full">Get Started</button>
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  )
}
