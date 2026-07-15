import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ArticleLayout } from '@/components/ArticleLayout'

export default function Post() {
  const router = useRouter()
  const { slug } = router.query

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    async function loadPost() {
      try {
        const response = await fetch(`http://localhost:5000/posts/${slug}`)

        if (!response.ok) {
          setPost(null)
          return
        }

        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error(error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (loading) {
    return (
      <main style={{ maxWidth: '700px', margin: '80px auto', padding: '24px' }}>
        <p>Loading post...</p>
      </main>
    )
  }

  if (!post || !post.title) {
    return (
      <main style={{ maxWidth: '700px', margin: '80px auto', padding: '24px' }}>
        <h1>Post could not be loaded</h1>
        <p>Please make sure the backend server is running and the post exists.</p>
      </main>
    )
  }

  const meta = {
    author: 'Spencer Sharp',
    date: post.createdDate || new Date().toISOString(),
    title: post.title,
    description: post.body,
  }

  return (
    <ArticleLayout meta={meta}>
      {post.body}
    </ArticleLayout>
  )
}