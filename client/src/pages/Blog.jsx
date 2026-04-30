import React from 'react'
import { BsArrowRight, BsBook, BsClock } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { blogPosts } from '../data/blogPosts'

function Blog() {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-[#f4fbfb] text-slate-900 dark:bg-slate-950 dark:text-white'>
      <Seo
        title='Interview Resources'
        description='Read interview preparation guides for Amazon interviews, technical rounds, HR questions, and AI mock interview practice.'
        keywords='interview preparation blog, Amazon interview guide, technical interview tips, HR interview questions'
      />
      <Navbar />
      <main className='px-4 py-10 md:px-6'>
        <div className='mx-auto max-w-6xl'>
          <section className='max-w-3xl'>
            <p className='mb-3 text-sm font-medium uppercase tracking-[0.26em] text-cyan-600 dark:text-cyan-300'>Resources</p>
            <h1 className='text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl'>Interview prep guides for high-intent search traffic</h1>
            <p className='mt-5 text-base leading-8 text-slate-600 dark:text-slate-300'>
              Practical articles for candidates preparing for company loops, technical rounds, behavioral interviews, and resume-led conversations.
            </p>
          </section>

          <section className='mt-10 grid gap-5 md:grid-cols-3'>
            {blogPosts.map((post) => (
              <article key={post.slug} className='flex h-full flex-col rounded-3xl border border-white/80 bg-white p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900'>
                <div className='mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300'>
                  <BsBook size={19} />
                </div>
                <p className='text-xs font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300'>{post.company}</p>
                <h2 className='mt-3 text-xl font-semibold leading-7'>{post.title}</h2>
                <p className='mt-3 flex-1 text-sm leading-7 text-slate-500 dark:text-slate-300'>{post.excerpt}</p>
                <div className='mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm dark:border-white/10'>
                  <span className='inline-flex items-center gap-2 text-slate-500 dark:text-slate-300'>
                    <BsClock size={14} />
                    {post.readTime}
                  </span>
                  <button onClick={() => navigate(`/resources/${post.slug}`)} className='inline-flex items-center gap-2 font-medium text-cyan-700 dark:text-cyan-300'>
                    Read
                    <BsArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Blog
