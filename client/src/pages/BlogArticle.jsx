import React from 'react'
import { BsArrowLeft, BsCalendar3, BsClock } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { blogPosts } from '../data/blogPosts'

function BlogArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = blogPosts.find((item) => item.slug === slug) || blogPosts[0]

  return (
    <div className='min-h-screen bg-[#f4fbfb] text-slate-900 dark:bg-slate-950 dark:text-white'>
      <Seo title={post.title} description={post.excerpt} keywords={post.keywords} type='article' />
      <Navbar />
      <main className='px-4 py-10 md:px-6'>
        <article className='mx-auto max-w-3xl'>
          <button onClick={() => navigate('/resources')} className='mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200'>
            <BsArrowLeft size={15} />
            Resources
          </button>
          <p className='text-sm font-medium uppercase tracking-[0.26em] text-cyan-600 dark:text-cyan-300'>{post.company} guide</p>
          <h1 className='mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl'>{post.title}</h1>
          <p className='mt-5 text-base leading-8 text-slate-600 dark:text-slate-300'>{post.excerpt}</p>
          <div className='mt-6 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-300'>
            <span className='inline-flex items-center gap-2'>
              <BsClock size={14} />
              {post.readTime}
            </span>
            <span className='inline-flex items-center gap-2'>
              <BsCalendar3 size={14} />
              {new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className='mt-10 space-y-8 rounded-3xl border border-white/80 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900'>
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className='text-2xl font-semibold'>{section.heading}</h2>
                <p className='mt-3 text-base leading-8 text-slate-600 dark:text-slate-300'>{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default BlogArticle
