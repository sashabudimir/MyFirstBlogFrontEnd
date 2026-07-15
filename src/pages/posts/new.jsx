import { useState } from 'react'
import { useRouter } from 'next/router'

export default function NewPost() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors(data.errors || ['Something went wrong'])
        return
      }

      const slug = title.trim().toLowerCase().replaceAll(' ', '-')
      router.push(`/posts/${slug}`)
    } catch (error) {
      setErrors(['Unable to connect to the backend server'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ maxWidth: '700px', margin: '80px auto', padding: '24px' }}>
      <h1>Create New Post</h1>

      {errors.length > 0 && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="title">Title</label>
          <br />
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '6px',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="description">Description</label>
          <br />
          <input
            id="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '6px',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </main>
  )
}