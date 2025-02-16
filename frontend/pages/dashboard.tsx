import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import URLForm from '../components/UrlForm'
import URLList from '../components/UrlList'

interface URLItem {
  slug: string
  originalUrl: string
  visits: number
}

const Dashboard: React.FC = () => {
  const [urls, setUrls] = useState<URLItem[]>([])
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchUrls = async () => {
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/users/urls', {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUrls(
        response.data.data.map((item: any) => ({
          slug: item.id,
          originalUrl: item.attributes.originalUrl,
          visits: item.attributes.visits,
        }))
      )
    } catch (err: any) {
      setError('Failed to fetch URLs. Please login again.')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
    } else {
      fetchUrls()
    }
  }, [])

  const handleUrlCreated = (data: any) => {
    setUrls((prev) => [
      ...prev,
      {
        slug: data.slug,
        originalUrl: data.originalUrl,
        visits: data.visits,
      },
    ])
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <URLForm onUrlCreated={handleUrlCreated} />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <URLList urls={urls} />
    </div>
  )
}

export default Dashboard
