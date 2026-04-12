import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import { BsChevronRight, BsCoin, BsGift, BsGraphUpArrow, BsRobot } from 'react-icons/bs'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaUserAstronaut } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import AuthModel from './AuthModel'
import { useTheme } from '../context/ThemeContext'
import { BsMoon, BsSun } from 'react-icons/bs'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { userData } = useSelector((state) => state.user)
  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + '/api/auth/logout', { withCredentials: true })

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
    <div className='sticky top-0 z-40 px-3 pt-4 sm:px-4 sm:pt-5 md:px-6'>
      <motion.div
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-[1.35rem] border border-white/70 bg-white/78 px-3 py-3 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:rounded-[1.7rem] sm:px-4 md:px-6'
      >
        <div onClick={() => navigate('/')} className='flex cursor-pointer items-center gap-3'>
          <div className='rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 p-2.5 text-white shadow-lg shadow-cyan-200/60 sm:p-3'>
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
              className='flex items-center gap-2 rounded-full border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:shadow-md md:px-4'
            >
              <div className='rounded-full bg-white p-1 text-emerald-600'>
                <BsCoin size={14} />
              </div>
              <span className='hidden text-xs uppercase tracking-[0.12em] text-slate-400 sm:inline'>Credits</span>
              <span>{userData?.credits || 0}</span>
              <span className='hidden text-slate-300 sm:inline'>/</span>
              <span className='hidden text-xs uppercase tracking-[0.12em] text-emerald-600 sm:inline'>Coins</span>
              <span className='hidden text-emerald-700 sm:inline'>{userData?.coins || 0}</span>
            </button>

            {showCreditPopup && (
              <div className='absolute right-0 mt-3 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.3rem] border border-white/80 bg-white/95 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.5)] backdrop-blur sm:w-72 sm:rounded-[1.5rem]'>
                <div className='border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-cyan-50 px-5 py-4'>
                  <p className='text-xs uppercase tracking-[0.2em] text-emerald-600'>Credits</p>
                  <h3 className='mt-1 text-sm font-semibold text-slate-900'>Keep your interview streak going</h3>
                </div>

                <div className='px-5 py-4'>
                  <p className='text-sm leading-6 text-slate-500'>
                    Credits power interview generation. Coins unlock rewards, premium insights, and special packs.
                  </p>

                  <div className='mt-4 grid gap-3'>
                    <div className='rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600'>
                      <div className='flex items-center justify-between'>
                        <span>Credits</span>
                        <span className='font-semibold text-slate-900'>{userData?.credits || 0}</span>
                      </div>
                      <div className='mt-2 flex items-center justify-between'>
                        <span>Coins</span>
                        <span className='font-semibold text-emerald-700'>{userData?.coins || 0}</span>
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
                      className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-900'
                    >
                      Open Rewards Hub
                      <BsGift size={15} />
                    </button>

                    <button
                      onClick={() => navigate('/pricing')}
                      className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800'
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
            onClick={() => handleProtectedAction(() => navigate('/history'))}
            className='hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-cyan-200 hover:text-slate-900 dark:hover:text-white md:inline-flex'
          >
            <BsGraphUpArrow size={15} />
            Progress
          </button>

          <button
            onClick={() => handleProtectedAction(() => navigate('/rewards'))}
            className='hidden items-center gap-2 rounded-full border border-amber-100 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-200 hover:text-slate-900 md:inline-flex'
          >
            <BsGift size={15} />
            Rewards
          </button>

          <button
            onClick={toggleTheme}
            className='flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          >
            {theme === 'dark' ? <BsSun size={15} /> : <BsMoon size={15} />}
          </button>

          <div className='relative'>
            <button
              onClick={() =>
                handleProtectedAction(() => {
                  setShowUserPopup(!showUserPopup)
                  setShowCreditPopup(false)
                })
              }
              className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800'
            >
              {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={16} />}
            </button>

            {showUserPopup && (
              <div className='absolute right-0 mt-3 w-[min(14rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.3rem] border border-white/80 bg-white/95 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.5)] backdrop-blur sm:w-56 sm:rounded-[1.5rem]'>
                <div className='border-b border-slate-100 bg-gradient-to-r from-slate-50 to-cyan-50 px-5 py-4'>
                  <p className='text-sm font-semibold text-slate-900'>{userData?.name}</p>
                  <p className='mt-1 text-xs uppercase tracking-[0.18em] text-slate-400'>Account</p>
                </div>

                <div className='p-3'>
                  <button
                    onClick={() => navigate('/resume-builder')}
                    className='flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
                  >
                    ATS Resume Builder
                    <BsChevronRight size={14} />
                  </button>

                  <button
                    onClick={() => navigate('/history')}
                    className='flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
                  >
                    Interview History
                    <BsChevronRight size={14} />
                  </button>

                  <button
                    onClick={() => navigate('/rewards')}
                    className='flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
                  >
                    Rewards Hub
                    <BsChevronRight size={14} />
                  </button>

                  {userData?.isAdmin && (
                    <button
                      onClick={() => navigate('/admin/reward-orders')}
                      className='flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
                    >
                      Admin Orders
                      <BsChevronRight size={14} />
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className='mt-1 flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm text-red-500 transition hover:bg-red-50'
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
