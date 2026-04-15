import React, { useEffect, useState } from 'react'
import { BsArrowRight, BsBarChart, BsCheck2Circle, BsRobot, BsStars } from 'react-icons/bs'
import { IoSparkles } from 'react-icons/io5'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import axios from 'axios'
import { ServerUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

const authBenefits = [
  'Start realistic AI mock interviews in seconds',
  'Track improvement with saved history and reports',
  'Practice role-specific questions with adaptive feedback'
]

function Auth({ isModel = false }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!isModel && userData) {
      navigate('/', { replace: true })
    }
  }, [isModel, navigate, userData])

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true)
      setAuthError('')

      const response = await signInWithPopup(auth, provider)

      const User = response.user
      const name = User.displayName
      const email = User.email

      const result = await axios.post(
        ServerUrl + '/api/auth/google',
        { name, email },
        { withCredentials: true }
      )

      dispatch(setUserData(result.data))

      if (!isModel) {
        navigate('/', { replace: true })
      }
    } catch (error) {
      console.log(error)
      dispatch(setUserData(null))
      setAuthError('Google sign-in did not finish. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isModel) {
    return (
      <div className='w-full py-4'>
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className='w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.5)] backdrop-blur-xl'
        >
          <div className='border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-7 py-7 text-center'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 text-white shadow-lg shadow-cyan-200/60'>
              <BsRobot size={22} />
            </div>

            <h1 className='mt-5 text-2xl font-semibold text-slate-900'>Continue with InterviewArc</h1>
            <p className='mt-3 text-sm leading-6 text-slate-500'>
              Sign in to unlock AI interviews, saved reports, and progress tracking.
            </p>
          </div>

          <div className='px-7 py-7'>
            <div className='mb-6 rounded-[1.5rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-xl bg-white p-2 text-cyan-700'>
                  <IoSparkles size={18} />
                </div>
                <div>
                  <p className='text-sm font-semibold text-slate-900'>One account, full interview workflow</p>
                  <p className='mt-1 text-xs leading-5 text-slate-500'>Practice, review, and continue where you left off.</p>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className='flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-5 py-3.5 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70'
            >
              <FcGoogle size={20} />
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </motion.button>

            {authError && <p className='mt-4 text-center text-sm text-red-500'>{authError}</p>}

            <p className='mt-5 text-center text-xs leading-5 text-slate-400'>
              Secure authentication powered by Google.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#f4fbfb] px-6 py-10 text-slate-900'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_25%),radial-gradient(circle_at_top_right,rgba(43,218,237,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.04),transparent_40%)]' />
      <div className='pointer-events-none absolute left-[-90px] top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='pointer-events-none absolute right-[-120px] top-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl' />

      <div className='relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-2xl'
        >
          <div
            onClick={() => navigate('/')}
            className='inline-flex cursor-pointer items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur'
          >
            <div className='rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-400 p-2 text-white'>
              <BsRobot size={16} />
            </div>
            <span className='text-sm font-medium text-slate-700'>Back to InterviewArc</span>
          </div>

          <div className='mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-4 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur'>
            <BsStars size={15} className='text-cyan-500' />
            Interview prep that feels structured, not random
          </div>

          <h1 className='mt-6 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl'>
            Sign in and turn every practice round into
            <span className='mx-2 inline-block rounded-[2rem] bg-gradient-to-r from-emerald-500 to-cyan-400 px-5 py-1.5 text-white shadow-lg shadow-cyan-200/60'>
              measurable progress
            </span>
          </h1>

          <p className='mt-6 max-w-xl text-lg leading-8 text-slate-600'>
            Access realistic AI interviews, detailed feedback, and saved performance history so you can practice with a clear direction.
          </p>

          <div className='mt-8 space-y-4'>
            {authBenefits.map((item) => (
              <div
                key={item}
                className='flex items-start gap-3 rounded-[1.5rem] border border-white/80 bg-white/70 px-4 py-4 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'
              >
                <div className='rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 p-2 text-cyan-700'>
                  <BsCheck2Circle size={16} />
                </div>
                <p className='text-sm leading-7 text-slate-600'>{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className='relative'
        >
          <div className='absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/60 to-cyan-200/60 blur-3xl' />

          <div className='relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/92 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl'>
            <div className='border-b border-slate-100 bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50/80 px-8 py-8'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-xs uppercase tracking-[0.24em] text-emerald-600'>Welcome back</p>
                  <h2 className='mt-3 text-3xl font-semibold text-slate-900'>Continue with AI Interview</h2>
                </div>

                <div className='rounded-2xl bg-slate-950 p-3 text-white shadow-md'>
                  <IoSparkles size={18} />
                </div>
              </div>

              <p className='mt-4 max-w-md text-sm leading-7 text-slate-500'>
                Use your Google account to start practicing, review older sessions, and keep your interview prep in one place.
              </p>
            </div>

            <div className='px-8 py-8'>
              <div className='mb-6 grid gap-4 sm:grid-cols-2'>
                <div className='rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-xl bg-white p-2 text-emerald-600 shadow-sm'>
                      <BsBarChart size={16} />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-slate-900'>Track improvement</p>
                      <p className='mt-1 text-xs leading-5 text-slate-500'>Saved analytics and reports after every session.</p>
                    </div>
                  </div>
                </div>

                <div className='rounded-[1.5rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-xl bg-white p-2 text-cyan-600 shadow-sm'>
                      <BsArrowRight size={16} />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-slate-900'>Jump back in fast</p>
                      <p className='mt-1 text-xs leading-5 text-slate-500'>Start a new round without extra setup friction.</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className='flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-5 py-4 text-sm font-medium text-white shadow-xl shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70'
              >
                <FcGoogle size={20} />
                {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
              </motion.button>

              {authError && <p className='mt-4 text-center text-sm text-red-500'>{authError}</p>}

              <p className='mt-5 text-center text-xs leading-6 text-slate-400'>
                Secure sign-in powered by Google. Your progress stays tied to your account.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Auth
