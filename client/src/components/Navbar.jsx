import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import { BsBook, BsChevronRight, BsCoin, BsGift, BsGraphUpArrow, BsMoonStars, BsRobot, BsSun } from 'react-icons/bs'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaUserAstronaut } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import AuthModel from './AuthModel'
import { persistAuthToken } from '../utils/authToken'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { userData } = useSelector((state) => state.user)
  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + '/api/auth/logout', { withCredentials: true })

      persistAuthToken('')
      dispatch(setUserData(null))

      setShowCreditPopup(false)
      setShowUserPopup(false)

      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleProtectedAction = (callback) => {
    if (!userData) {
      setShowAuth(true)
      return
    }

    callback()
  }

  return (
    <div className='sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 sm:px-4 md:px-6'>
      <motion.div
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='mx-auto flex w-full max-w-6xl items-center justify-between gap-3'
      >
        <div onClick={() => navigate('/')} className='flex cursor-pointer items-center gap-3'>
          <div className='rounded-lg bg-teal-600 p-2.5 text-white sm:p-3'>
            <BsRobot size={17} />
          </div>

          <div>
            <h1 className='text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base md:text-lg'>
              InterviewArc
            </h1>
            <p className='hidden text-xs tracking-[0.18em] text-slate-400 lg:block'>
              AI INTERVIEW PREP
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 sm:gap-3 md:gap-4'>
          <div className='relative'>
            <button
              onClick={() =>
                handleProtectedAction(() => {
                  setShowCreditPopup(!showCreditPopup)
                  setShowUserPopup(false)
                })
              }
              className='flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 md:px-4'
            >
              <div className='rounded-md bg-teal-50 p-1 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'>
                <BsCoin size={14} />
              </div>
              <span className='hidden text-xs uppercase tracking-[0.12em] text-slate-400 sm:inline'>Credits</span>
              <span>{userData?.credits || 0}</span>
              <span className='hidden text-slate-300 sm:inline'>/</span>
              <span className='hidden text-xs uppercase tracking-[0.12em] text-teal-700 sm:inline'>Coins</span>
              <span className='hidden text-teal-700 sm:inline'>{userData?.coins || 0}</span>
            </button>

            {showCreditPopup && (
              <div className='absolute right-0 mt-3 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-slate-900 sm:w-72'>
                <div className='border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-slate-950'>
                  <p className='text-xs uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300'>Credits</p>
                  <h3 className='mt-1 text-sm font-semibold text-slate-900'>Keep your interview streak going</h3>
                </div>

                <div className='px-5 py-4'>
                  <p className='text-sm leading-6 text-slate-500'>
                    Credits power interview generation. Coins unlock rewards, premium insights, and special packs.
                  </p>

                  <div className='mt-4 grid gap-3'>
                    <div className='rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300'>
                      <div className='flex items-center justify-between'>
                        <span>Credits</span>
                        <span className='font-semibold text-slate-900'>{userData?.credits || 0}</span>
                      </div>
                      <div className='mt-2 flex items-center justify-between'>
                        <span>Coins</span>
                        <span className='font-semibold text-teal-700'>{userData?.coins || 0}</span>
                      </div>
                      <div className='mt-2 flex items-center justify-between'>
                        <span>Interview tickets</span>
                        <span className='font-semibold text-cyan-700'>
                          {userData?.rewardInventory?.consumables?.mockInterviewTickets || 0}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/rewards')}
                      className='inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-slate-900'
                    >
                      Open Rewards Hub
                      <BsGift size={15} />
                    </button>

                    <button
                      onClick={() => navigate('/pricing')}
                      className='inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800'
                    >
                      Buy More Credits
                      <BsChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/resources')}
            className='hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-teal-300 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white lg:inline-flex'
          >
            <BsBook size={15} />
            Resources
          </button>

          <button
            onClick={() => handleProtectedAction(() => navigate('/history'))}
            className='hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-teal-300 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white md:inline-flex'
          >
            <BsGraphUpArrow size={15} />
            Progress
          </button>

          <button
            onClick={() => handleProtectedAction(() => navigate('/rewards'))}
            className='hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-teal-300 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 md:inline-flex'
          >
            <BsGift size={15} />
            Rewards
          </button>

          <button
            onClick={toggleTheme}
            className='inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-teal-300 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white'
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <BsSun size={16} /> : <BsMoonStars size={16} />}
          </button>

          <div className='relative'>
            <button
              onClick={() =>
                handleProtectedAction(() => {
                  setShowUserPopup(!showUserPopup)
                  setShowCreditPopup(false)
                })
              }
              className='flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800'
            >
              {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={16} />}
            </button>

            {showUserPopup && (
              <div className='absolute right-0 mt-3 w-[min(14rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-slate-900 sm:w-56'>
                <div className='border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-slate-950'>
                  <p className='text-sm font-semibold text-slate-900'>{userData?.name}</p>
                  <p className='mt-1 text-xs uppercase tracking-[0.18em] text-slate-400'>Account</p>
                </div>

                <div className='p-3'>
                  <button
                    onClick={() => navigate('/resume-builder')}
                    className='flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
                  >
                    ATS Resume Builder
                    <BsChevronRight size={14} />
                  </button>

                  <button
                    onClick={() => navigate('/history')}
                    className='flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
                  >
                    Interview History
                    <BsChevronRight size={14} />
                  </button>

                  <button
                    onClick={() => navigate('/rewards')}
                    className='flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
                  >
                    Rewards Hub
                    <BsChevronRight size={14} />
                  </button>

                  {userData?.isAdmin && (
                    <button
                      onClick={() => navigate('/admin/reward-orders')}
                      className='flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
                    >
                      Admin Orders
                      <BsChevronRight size={14} />
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className='mt-1 flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm text-red-500 transition hover:bg-red-50'
                  >
                    <HiOutlineLogout size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default Navbar
