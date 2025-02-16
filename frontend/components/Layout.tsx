import Link from 'next/link'
import React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <nav>
          <Link
            href="/"
            style={{ margin: '1rem' }}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            style={{ margin: '1rem' }}
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            style={{ margin: '1rem' }}
          >
            Login
          </Link>
          <Link
            href="/register"
            style={{ margin: '1rem' }}
          >
            Register
          </Link>
        </nav>
      </header>

      <main style={{ padding: '1rem' }}>{children}</main>
    </div>
  )
}

export default Layout
