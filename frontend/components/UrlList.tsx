import React from 'react'

interface URLItem {
  slug: string
  originalUrl: string
  visits: number
}

interface UrlListProps {
  urls: URLItem[]
}

const UrlList: React.FC<UrlListProps> = ({ urls }) => {
  return (
    <div>
      <h2>Your URLs</h2>

      {urls.length === 0 ? (
        <p>No URLs found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                Slug
              </th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                Original URL
              </th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                Visits
              </th>
            </tr>
          </thead>

          <tbody>
            {urls.map((url) => (
              <tr key={url.slug}>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  {url.slug}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.originalUrl}
                  </a>
                </td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  {url.visits}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UrlList
