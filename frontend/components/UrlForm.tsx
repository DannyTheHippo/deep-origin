import axios from 'axios'
import React, { useState } from 'react'

interface URLFormProps {
  onUrlCreated?: (data: any) => void
}

const URLForm: React.FC<URLFormProps> = ({ onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShortUrl('')
    try {
      const payload: any = { originalUrl }

      if (slug) payload.slug = slug

      const response = await axios.post('http://localhost:3000/urls', payload)
      const data = response.data.data.attributes

      setShortUrl(`http://localhost:3000/${data.slug}`)

      if (onUrlCreated) onUrlCreated(data)
    } catch (err: any) {
      console.log(err.response.data.message)

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message || 'An error occurred')
      } else {
        setError('An error occurred')
      }
    }
  }

  const copyToClipboard = async () => {
    if (!shortUrl) return

    await navigator.clipboard.writeText(shortUrl)
    alert('Copied to clipboard!')
  }

  return (
    <div>
      <h2>Create a Short URL</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="originalUrl">Original URL:</label>
          <input
            type="url"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="slug">Custom Slug (optional):</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Alphanumeric only"
            pattern="[a-zA-Z0-9]+"
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Shorten URL</button>
      </form>

      {shortUrl && (
        <div style={{ marginTop: '1rem' }}>
          <p>
            Short URL: <a href={shortUrl}>{shortUrl}</a>
          </p>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
      )}
    </div>
  )
}

export default URLForm
