import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import {
  BsArrowLeft,
  BsAward,
  BsBag,
  BsBoxSeam,
  BsCheck2Circle,
  BsCoin,
  BsFire,
  BsGift,
  BsGlobeCentralSouthAsia,
  BsLightningCharge,
  BsPatchCheck,
  BsTicketPerforated,
  BsTrophy
} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { ServerUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import aiAnswersImage from '../assets/ai-ans.png'
import confidenceImage from '../assets/confi.png'
import creditImage from '../assets/credit.png'
import historyImage from '../assets/history.png'
import hrImage from '../assets/HR.png'
import interviewImage from '../assets/img1.png'
import mockImage from '../assets/MM.png'
import pdfImage from '../assets/pdf.png'
import resumeImage from '../assets/resume.png'
import techImage from '../assets/tech.png'

const hiddenStoreItemIds = new Set([
  'premium-report-access',
  'premium-report-pass',
  'mock-interview-ticket',
  'streak-shield'
])

const hiddenConsumableKeys = new Set([
  'premiumReportPasses',
  'mockInterviewTickets',
  'streakShields'
])

const productImages = {
  'retry-ticket': confidenceImage,
  'resume-review-credit': resumeImage,
  'role-pack-frontend': techImage,
  'role-pack-backend': aiAnswersImage,
  'company-pack-startup': mockImage,
  'company-pack-google': hrImage,
  'theme-neon-wave': historyImage,
  'pro-pass-7d': creditImage,
  'pro-pass-30d': pdfImage,
  'merch-tshirt': interviewImage,
  'merch-cap': mockImage,
  'merch-kit': creditImage,
  'merch-sleeve': historyImage,
  'merch-notebook': pdfImage,
  'merch-hoodie': confidenceImage
}

const consumableLabels = {
  premiumReportPasses: 'Premium report passes',
  mockInterviewTickets: 'Mock interview tickets',
  retryTickets: 'Retry tickets',
  resumeReviewCredits: 'Resume review credits',
  streakShields: 'Streak shields'
}

const previewStyles = {
  legendary: 'from-amber-400 via-orange-400 to-rose-400 text-white',
  epic: 'from-slate-900 via-slate-800 to-cyan-900 text-white',
  rare: 'from-cyan-500 via-emerald-500 to-teal-500 text-white',
  common: 'from-slate-700 via-slate-600 to-slate-500 text-white'
}

const categoryAccents = {
  Consumables: 'border-cyan-100 bg-cyan-50 text-cyan-700',
  'Interview Packs': 'border-emerald-100 bg-emerald-50 text-emerald-700',
  'Premium Tools': 'border-amber-100 bg-amber-50 text-amber-700',
  Themes: 'border-fuchsia-100 bg-fuchsia-50 text-fuchsia-700',
  'Big Rewards': 'border-rose-100 bg-rose-50 text-rose-700',
  'Merch Rewards': 'border-violet-100 bg-violet-50 text-violet-700'
}

function RewardsHub() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const [overview, setOverview] = useState(null)
  const [store, setStore] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [currentRank, setCurrentRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState('')
  const [orders, setOrders] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [checkoutItem, setCheckoutItem] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [devAction, setDevAction] = useState('')
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  })

  const visibleStore = useMemo(
    () => store.filter((item) => !hiddenStoreItemIds.has(item.id)),
    [store]
  )
  const showDevTools = import.meta.env.VITE_DEV_TEST_TOOLS === 'true'

  const visibleRecentPurchases = useMemo(
    () => (overview?.recentPurchases || []).filter((entry) => !hiddenStoreItemIds.has(entry.itemId)),
    [overview]
  )

  const refreshRewards = async () => {
    const [overviewResult, storeResult, leaderboardResult, ordersResult] = await Promise.all([
      axios.get(ServerUrl + '/api/user/rewards', { withCredentials: true }),
      axios.get(ServerUrl + '/api/user/store', { withCredentials: true }),
      axios.get(ServerUrl + '/api/user/leaderboard', { withCredentials: true }),
      axios.get(ServerUrl + '/api/user/store/orders', { withCredentials: true })
    ])

    setOverview(overviewResult.data)
    setStore(storeResult.data.items || [])
    setLeaderboard(leaderboardResult.data.topUsers || [])
    setCurrentRank(leaderboardResult.data.currentUser || null)
    setOrders(ordersResult.data.orders || [])
  }

  useEffect(() => {
    const loadRewards = async () => {
      try {
        await refreshRewards()
      } catch (loadError) {
        console.log(loadError)
        setError('Rewards hub could not be loaded right now.')
      } finally {
        setLoading(false)
      }
    }

    loadRewards()
  }, [])

  const buyItem = async (itemId) => {
    if (buyingId) {
      return
    }

    setBuyingId(itemId)
    setMessage('')
    setError('')

    try {
      const result = await axios.post(
        ServerUrl + '/api/user/store/purchase',
        { itemId },
        { withCredentials: true }
      )

      dispatch(setUserData(result.data.user))
      setMessage(result.data.message)
      await refreshRewards()
    } catch (purchaseError) {
      console.log(purchaseError)
      setError(purchaseError?.response?.data?.message || 'Purchase failed.')
    } finally {
      setBuyingId('')
    }
  }

  const openCheckout = (item) => {
    setCheckoutItem(item)
    setMessage('')
    setError('')
    setShippingAddress({
      fullName: userData?.preferredShippingAddress?.fullName || userData?.name || '',
      phone: userData?.preferredShippingAddress?.phone || '',
      addressLine1: userData?.preferredShippingAddress?.addressLine1 || '',
      addressLine2: userData?.preferredShippingAddress?.addressLine2 || '',
      city: userData?.preferredShippingAddress?.city || '',
      state: userData?.preferredShippingAddress?.state || '',
      postalCode: userData?.preferredShippingAddress?.postalCode || '',
      country: userData?.preferredShippingAddress?.country || 'India'
    })
  }

  const claimMerchOrder = async () => {
    if (!checkoutItem || checkoutLoading) {
      return
    }

    setCheckoutLoading(true)
    setMessage('')
    setError('')

    try {
      const result = await axios.post(
        ServerUrl + '/api/user/store/claim-order',
        {
          itemId: checkoutItem.id,
          shippingAddress
        },
        { withCredentials: true }
      )

      dispatch(setUserData(result.data.user))
      setMessage(`${result.data.message} Order #${result.data.order.orderNumber}`)
      setCheckoutItem(null)
      await refreshRewards()
    } catch (claimError) {
      console.log(claimError)
      setError(claimError?.response?.data?.message || 'Order claim failed.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const runDevAction = async (action) => {
    if (devAction) {
      return
    }

    const endpointMap = {
      coins: '/api/user/dev/add-test-coins',
      admin: '/api/user/dev/enable-admin',
      order: '/api/user/dev/create-demo-order'
    }

    setDevAction(action)
    setMessage('')
    setError('')

    try {
      const result = await axios.post(ServerUrl + endpointMap[action], {}, { withCredentials: true })
      if (result.data.user) {
        dispatch(setUserData(result.data.user))
      }
      setMessage(result.data.message)
      await refreshRewards()
    } catch (actionError) {
      console.log(actionError)
      setError(actionError?.response?.data?.message || 'Dev action failed.')
    } finally {
      setDevAction('')
    }
  }

  const categoryTabs = useMemo(() => {
    const categories = [...new Set(visibleStore.map((item) => item.category).filter(Boolean))]
    return ['All', ...categories]
  }, [visibleStore])

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') {
      return visibleStore
    }

    return visibleStore.filter((item) => item.category === activeCategory)
  }, [activeCategory, visibleStore])

  const inventorySummary = useMemo(() => {
    const inventory = overview?.inventory

    if (!inventory) {
      return { unlocks: [], consumables: [] }
    }

    const unlocks = [
      ...(inventory.rolePacks || []).map((pack) => ({
        label: pack.replace(/-/g, ' '),
        meta: 'Role pack'
      })),
      ...(inventory.companyPacks || []).map((pack) => ({
        label: pack.replace(/-/g, ' '),
        meta: 'Company pack'
      })),
      ...(inventory.merchClaims || []).map((item) => ({
        label: item.replace(/-/g, ' '),
        meta: 'Merch reward'
      })),
      ...(inventory.themes || []).map((theme) => ({
        label: theme.replace(/-/g, ' '),
        meta: 'Theme'
      }))
    ].filter(Boolean)

    const consumables = Object.entries(inventory.consumables || {})
      .filter(([key]) => !hiddenConsumableKeys.has(key))
      .filter(([, value]) => Number(value) > 0)
      .map(([key, value]) => ({
        label: consumableLabels[key] || key,
        count: value
      }))

    return { unlocks, consumables }
  }, [overview])

  if (loading) {
    return (
      <div className='min-h-screen bg-[#eef6f6] px-3 py-6 text-slate-900 sm:px-4 sm:py-8 md:px-6'>
        <div className='mx-auto max-w-6xl rounded-[1.8rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:rounded-4xl sm:p-8'>
          <p className='text-lg font-medium text-slate-700'>Loading rewards hub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#eef6f6] px-3 py-6 text-slate-900 sm:px-4 sm:py-8 md:px-6'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4'>
            <button
              onClick={() => navigate('/')}
              className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-sm transition hover:text-slate-900'
            >
              <BsArrowLeft size={16} />
            </button>

            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-4 py-2 text-sm text-amber-700 shadow-sm'>
                <BsGift size={14} className='text-cyan-500' />
                Coin store
              </div>
              <h1 className='mt-4 text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl md:text-4xl'>
                Redeem rewards like a real progression store
              </h1>
              <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:leading-7'>
                Practice interviews, earn coins, and spend them on curated packs, Pro access, merch rewards, and bigger long-term redemptions.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className='rounded-[1.25rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
            {message}
          </div>
        )}

        {error && (
          <div className='rounded-[1.25rem] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
            {error}
          </div>
        )}

        {showDevTools && (
          <div className='rounded-[1.7rem] border border-violet-100 bg-violet-50/80 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.2)] sm:rounded-[2rem] sm:p-6'>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              <div>
                <p className='text-xs uppercase tracking-[0.18em] text-violet-600'>Dev test tools</p>
                <h2 className='mt-2 text-xl font-semibold text-slate-900'>One-click reward testing</h2>
                <p className='mt-2 text-sm leading-6 text-slate-500'>
                  Use these temporary helpers to top up coins, enable admin access, and seed a demo reward order.
                </p>
              </div>

              <div className='grid gap-3 sm:grid-cols-3'>
                <button
                  onClick={() => runDevAction('coins')}
                  disabled={Boolean(devAction)}
                  className='rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300'
                >
                  {devAction === 'coins' ? 'Adding...' : 'Add 20k coins'}
                </button>
                <button
                  onClick={() => runDevAction('admin')}
                  disabled={Boolean(devAction)}
                  className='rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100'
                >
                  {devAction === 'admin' ? 'Enabling...' : 'Enable admin'}
                </button>
                <button
                  onClick={() => runDevAction('order')}
                  disabled={Boolean(devAction)}
                  className='rounded-full border border-violet-200 bg-white px-4 py-3 text-sm font-medium text-violet-700 transition hover:text-violet-900 disabled:cursor-not-allowed disabled:bg-slate-100'
                >
                  {devAction === 'order' ? 'Creating...' : 'Create demo order'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='grid gap-6 xl:grid-cols-[1.05fr_0.95fr]'>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className='overflow-hidden rounded-[1.7rem] border border-white/80 bg-slate-950 text-white shadow-[0_28px_80px_-40px_rgba(15,23,42,0.6)] sm:rounded-[2rem]'
          >
            <div className='bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.28),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.24),_transparent_38%)] p-4 sm:p-6 lg:p-7'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div>
                  <p className='text-xs uppercase tracking-[0.24em] text-emerald-300'>Wallet</p>
                  <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>{overview?.coins || userData?.coins || 0} coins</h2>
                  <p className='mt-2 text-sm text-slate-300'>
                    Level {overview?.level || userData?.level || 1} candidate with {overview?.xp || 0} XP in the bank.
                  </p>
                </div>

                <div className='w-full rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-left sm:w-auto sm:rounded-[1.5rem] sm:px-5 sm:text-right'>
                  <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>Subscription</p>
                  <p className='mt-2 text-lg font-semibold text-white'>
                    {overview?.subscription?.isActive ? 'PRO active' : 'Free tier'}
                  </p>
                  <p className='mt-1 text-sm text-slate-400'>
                    {overview?.subscription?.isActive && overview?.subscription?.expiresAt
                      ? `Expires ${new Date(overview.subscription.expiresAt).toLocaleDateString()}`
                      : 'Redeem Pro passes from the store'}
                  </p>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:grid-cols-4 sm:gap-4'>
                <div className='rounded-[1.2rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.4rem]'>
                  <p className='text-sm text-slate-400'>Current streak</p>
                  <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>{overview?.currentStreak || 0} days</p>
                </div>
                <div className='rounded-[1.2rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.4rem]'>
                  <p className='text-sm text-slate-400'>Completed rounds</p>
                  <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>{overview?.completedInterviews || 0}</p>
                </div>
                <div className='rounded-[1.2rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.4rem]'>
                  <p className='text-sm text-slate-400'>Highest score</p>
                  <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>{overview?.highestScore || 0}/10</p>
                </div>
                <div className='rounded-[1.2rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.4rem]'>
                  <p className='text-sm text-slate-400'>Current rank</p>
                  <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>#{currentRank?.rank || '-'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className='rounded-[1.7rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'
          >
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-cyan-50 p-3 text-cyan-700'>
                <BsLightningCharge size={18} />
              </div>
              <div>
                <h3 className='text-lg font-semibold text-slate-900'>Practice missions</h3>
                <p className='text-sm text-slate-500'>Quick goals that keep coins moving</p>
              </div>
            </div>

            <div className='mt-6 space-y-4'>
              {(overview?.challenges || []).map((challenge) => {
                const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100)

                return (
                  <div
                    key={challenge.id}
                    className='rounded-[1.2rem] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-[1.5rem]'
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <p className='text-sm font-semibold text-slate-900'>{challenge.title}</p>
                        <p className='mt-1 text-sm text-slate-500'>Reward: {challenge.reward} coins</p>
                      </div>
                      <div className='rounded-full bg-white px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-slate-500'>
                        {challenge.completed ? 'Completed' : `${challenge.progress}/${challenge.target}`}
                      </div>
                    </div>

                    <div className='mt-4 h-2 overflow-hidden rounded-full bg-slate-100'>
                      <div
                        className='h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400'
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <div className='-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0'>
          {categoryTabs.map((category) => {
            const active = activeCategory === category

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'border-slate-900 bg-slate-950 text-white'
                    : 'border-white/80 bg-white/90 text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className='rounded-[1.7rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'
        >
          <div className='flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-emerald-700'>
                <BsBag size={13} />
                Store catalog
              </div>
              <h2 className='mt-3 text-xl font-semibold text-slate-900 sm:text-2xl'>Redeemable products</h2>
              <p className='mt-2 text-sm leading-6 text-slate-500 sm:leading-7'>
                Role packs, company packs, premium access, and merch now lead the store with more visual product cards.
              </p>
            </div>

            <div className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 sm:w-auto sm:justify-start'>
              <BsCoin size={14} className='text-emerald-600' />
              Available now: {overview?.coins || userData?.coins || 0} coins
            </div>
          </div>

          <div className='mt-6 grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3'>
            {filteredItems.map((item) => {
              const isOwnedUnlock = item.owned && item.productType !== 'consumable'
              const ctaLabel = isOwnedUnlock
                ? 'Owned'
                : buyingId === item.id
                  ? 'Redeeming...'
                  : item.affordable
                    ? 'Redeem now'
                    : 'Need more coins'
              const productImage = productImages[item.id]

              return (
                <div
                  key={item.id}
                  className='overflow-hidden rounded-[1.3rem] border border-slate-100 bg-white shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)] sm:rounded-[1.6rem]'
                >
                  <div className={`relative overflow-hidden bg-gradient-to-br ${previewStyles[item.rarity] || previewStyles.common}`}>
                    {productImage && (
                      <img
                        src={productImage}
                        alt={item.title}
                        className='h-56 w-full object-cover object-center opacity-90'
                      />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-900/35 to-transparent' />
                    <div className='absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-5'>
                      <div className='rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.14em]'>
                        {item.previewLabel}
                      </div>
                      <div className='rounded-full bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.14em]'>
                        {item.rarity}
                      </div>
                    </div>

                    <div className='absolute inset-x-0 bottom-0 p-4 sm:p-5'>
                      <p className='text-2xl font-semibold leading-tight text-white sm:text-3xl'>{item.title}</p>
                      <p className='mt-3 max-w-xs text-sm leading-6 text-white/80'>{item.previewText}</p>
                    </div>
                  </div>

                  <div className='space-y-4 p-4 sm:space-y-5 sm:p-5'>
                    <div className='flex flex-wrap gap-2'>
                      <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${categoryAccents[item.category] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                        {item.category}
                      </span>
                      <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600'>
                        {item.productType}
                      </span>
                    </div>

                    <p className='text-sm leading-7 text-slate-500'>{item.description}</p>

                    <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
                      <div className='inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700'>
                        <BsCoin size={14} />
                        {item.coinCost}
                      </div>

                      {item.productType === 'consumable' && item.balance > 0 && (
                        <div className='inline-flex w-fit items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700'>
                          <BsTicketPerforated size={14} />
                          In inventory: {item.balance}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        item.category === 'Merch Rewards'
                          ? openCheckout(item)
                          : buyItem(item.id)
                      }
                      disabled={isOwnedUnlock || buyingId === item.id || !item.affordable}
                      className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300'
                    >
                      {isOwnedUnlock && <BsCheck2Circle size={15} />}
                      {item.category === 'Merch Rewards' && !isOwnedUnlock && item.affordable
                        ? 'Claim with address'
                        : ctaLabel}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <div className='grid gap-4 sm:gap-6 xl:grid-cols-[0.9fr_1.1fr]'>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className='space-y-6'
          >
            <div className='rounded-[1.7rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'>
              <div className='flex items-start gap-3'>
                <div className='rounded-xl bg-emerald-50 p-3 text-emerald-700'>
                  <BsPatchCheck size={18} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>Owned unlocks</h3>
                  <p className='text-sm text-slate-500'>Permanent rewards already attached to your account</p>
                </div>
              </div>

              <div className='mt-6 flex flex-wrap gap-3'>
                {inventorySummary.unlocks.length > 0 ? (
                  inventorySummary.unlocks.map((item) => (
                    <div
                      key={`${item.label}-${item.meta}`}
                      className='rounded-[1.25rem] border border-emerald-100 bg-emerald-50/80 px-4 py-3'
                    >
                      <p className='text-sm font-semibold capitalize text-slate-900'>{item.label}</p>
                      <p className='mt-1 text-xs uppercase tracking-[0.14em] text-emerald-700'>{item.meta}</p>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-slate-500'>
                    Redeem your first pack, Pro unlock, or merch reward to start building your collection.
                  </p>
                )}
              </div>
            </div>

            <div className='rounded-[1.7rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'>
              <div className='flex items-start gap-3'>
                <div className='rounded-xl bg-cyan-50 p-3 text-cyan-700'>
                  <BsTicketPerforated size={18} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>Consumable balances</h3>
                  <p className='text-sm text-slate-500'>These stack as you redeem more products</p>
                </div>
              </div>

              <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                {inventorySummary.consumables.length > 0 ? (
                  inventorySummary.consumables.map((item) => (
                    <div
                      key={item.label}
                      className='rounded-[1.35rem] border border-slate-100 bg-slate-50/80 px-4 py-4'
                    >
                      <p className='text-sm font-semibold text-slate-900'>{item.label}</p>
                      <p className='mt-2 text-2xl font-semibold text-cyan-700'>{item.count}</p>
                    </div>
                  ))
                ) : (
                  <div className='rounded-[1.35rem] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-4 text-sm text-slate-500 sm:col-span-2'>
                    No consumables stocked yet. Redeem retry tickets or resume review credits from the catalog above.
                  </div>
                )}
              </div>
            </div>

            <div className='rounded-[1.7rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'>
              <div className='flex items-start gap-3'>
                <div className='rounded-xl bg-amber-50 p-3 text-amber-700'>
                  <BsAward size={18} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>Badges earned</h3>
                  <p className='text-sm text-slate-500'>Practice milestones already unlocked</p>
                </div>
              </div>

              <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                {(overview?.badges || []).length > 0 ? (
                  overview.badges.map((badge) => (
                    <div
                      key={badge.key}
                      className='rounded-[1.35rem] border border-amber-100 bg-amber-50/70 p-4'
                    >
                      <p className='text-sm font-semibold text-slate-900'>{badge.label}</p>
                      <p className='mt-2 text-sm leading-6 text-slate-500'>{badge.description}</p>
                    </div>
                  ))
                ) : (
                  <div className='rounded-[1.35rem] border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-500 sm:col-span-2'>
                    Complete a few interviews and strong scores will start filling this wall.
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='space-y-6'
          >
            <div className='rounded-[1.7rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'>
              <div className='flex items-start gap-3'>
                <div className='rounded-xl bg-slate-100 p-3 text-slate-700'>
                  <BsFire size={18} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>Recent redemptions</h3>
                  <p className='text-sm text-slate-500'>Your latest coin purchases and unlock moments</p>
                </div>
              </div>

              <div className='mt-6 space-y-3'>
                {visibleRecentPurchases.length > 0 ? (
                  visibleRecentPurchases.map((entry) => (
                    <div
                      key={`${entry.itemId}-${entry.purchasedAt}`}
                    className='flex flex-col gap-3 rounded-[1.1rem] border border-slate-100 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-[1.3rem]'
                  >
                      <div>
                        <p className='text-sm font-semibold text-slate-900'>{entry.title}</p>
                        <p className='mt-1 text-xs uppercase tracking-[0.14em] text-slate-400'>{entry.category}</p>
                      </div>
                      <div className='sm:text-right'>
                        <p className='text-sm font-semibold text-amber-700'>{entry.coinCost} coins</p>
                        <p className='mt-1 text-xs uppercase tracking-[0.12em] text-slate-400'>
                          {new Date(entry.purchasedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='rounded-[1.35rem] border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-500'>
                    Your redemption history will appear here once you pick your first visible store item.
                  </div>
                )}
              </div>
            </div>

            <div className='rounded-[1.7rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'>
              <div className='flex items-start gap-3'>
                <div className='rounded-xl bg-violet-50 p-3 text-violet-700'>
                  <BsBoxSeam size={18} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>My merch orders</h3>
                  <p className='text-sm text-slate-500'>Track claimed rewards with shipping details and status</p>
                </div>
              </div>

              <div className='mt-6 space-y-3'>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className='rounded-[1.2rem] border border-slate-100 bg-slate-50/80 px-4 py-4'
                    >
                      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                        <div>
                          <p className='text-sm font-semibold text-slate-900'>{order.title}</p>
                          <p className='mt-1 text-xs uppercase tracking-[0.14em] text-slate-400'>
                            {order.orderNumber}
                          </p>
                        </div>
                        <div className='sm:text-right'>
                          <p className='text-sm font-semibold capitalize text-emerald-700'>{order.status}</p>
                          <p className='mt-1 text-xs uppercase tracking-[0.12em] text-slate-400'>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className='mt-3 text-sm leading-6 text-slate-500'>
                        {order.shippingAddress?.fullName}, {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='rounded-[1.35rem] border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-500'>
                    Claim a merch reward and your shipping order history will appear here.
                  </div>
                )}
              </div>
            </div>

            <div className='rounded-[1.7rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'>
              <div className='flex items-start gap-3'>
                <div className='rounded-xl bg-cyan-50 p-3 text-cyan-700'>
                  <BsGlobeCentralSouthAsia size={18} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>Leaderboard</h3>
                  <p className='text-sm text-slate-500'>Top users by XP, coins, and streak consistency</p>
                </div>
              </div>

              {currentRank && (
                <div className='mt-5 rounded-[1.3rem] border border-emerald-100 bg-emerald-50/80 px-4 py-4'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm text-slate-500'>Your current position</p>
                      <p className='mt-2 text-lg font-semibold text-slate-900'>Rank #{currentRank.rank}</p>
                    </div>
                    <div className='sm:text-right'>
                      <p className='text-sm font-semibold text-emerald-700'>Level {currentRank.level}</p>
                      <p className='mt-1 text-sm text-slate-500'>{currentRank.xp} XP</p>
                    </div>
                  </div>
                </div>
              )}

              <div className='mt-5 space-y-3'>
                {leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className='flex flex-col gap-3 rounded-[1.1rem] border border-slate-100 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-[1.3rem]'
                  >
                    <div className='flex items-center gap-3 sm:gap-4'>
                      <div className='flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700'>
                        #{entry.rank}
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-slate-900'>{entry.name}</p>
                        <p className='mt-1 text-xs uppercase tracking-[0.14em] text-slate-400'>
                          {entry.interviewsCompleted} interviews completed
                        </p>
                      </div>
                    </div>

                    <div className='sm:text-right'>
                      <p className='text-sm font-semibold text-slate-900'>Level {entry.level}</p>
                      <p className='mt-1 text-sm text-slate-500'>{entry.xp} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)]'>
              <div className='flex items-center gap-3'>
                <div className='rounded-xl bg-white/10 p-3 text-emerald-300'>
                  <BsTrophy size={18} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold'>Best ways to spend coins first</h3>
                  <p className='text-sm text-slate-300'>Recommended path for fast value</p>
                </div>
              </div>

              <div className='mt-6 grid gap-3'>
                <div className='rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-4'>
                  <p className='text-sm font-semibold text-white'>1. Retry tickets or resume credits</p>
                  <p className='mt-2 text-sm leading-6 text-slate-300'>
                    These are the fastest low-cost redemptions if you want immediate utility from your coins.
                  </p>
                </div>
                <div className='rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-4'>
                  <p className='text-sm font-semibold text-white'>2. Role or company packs</p>
                  <p className='mt-2 text-sm leading-6 text-slate-300'>
                    These change question quality immediately and make practice feel more targeted.
                  </p>
                </div>
                <div className='rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-4'>
                  <p className='text-sm font-semibold text-white'>3. Premium tools and Pro passes</p>
                  <p className='mt-2 text-sm leading-6 text-slate-300'>
                    Best after you have a solid streak and want deeper subscription perks or long-term value.
                  </p>
                </div>
                <div className='rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-4'>
                  <p className='text-sm font-semibold text-white'>4. Merch rewards for long-term goals</p>
                  <p className='mt-2 text-sm leading-6 text-slate-300'>
                    T-shirt, cap, kit, notebook, sleeve, and hoodie now sit in the store as long-term milestone rewards.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {checkoutItem && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-6 backdrop-blur-sm'>
            <div className='w-full max-w-2xl rounded-[1.8rem] border border-white/80 bg-white p-5 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.55)] sm:p-6'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <p className='text-xs uppercase tracking-[0.18em] text-violet-600'>Merch checkout</p>
                  <h3 className='mt-2 text-2xl font-semibold text-slate-900'>{checkoutItem.title}</h3>
                  <p className='mt-2 text-sm leading-6 text-slate-500'>
                    Fill the shipping details so your reward order can be tracked in the admin panel too.
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutItem(null)}
                  className='rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900'
                >
                  Close
                </button>
              </div>

              <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                {[
                  ['fullName', 'Full name'],
                  ['phone', 'Phone number'],
                  ['addressLine1', 'Address line 1'],
                  ['addressLine2', 'Address line 2'],
                  ['city', 'City'],
                  ['state', 'State'],
                  ['postalCode', 'Postal code'],
                  ['country', 'Country']
                ].map(([key, label]) => (
                  <label key={key} className={`flex flex-col gap-2 ${key === 'addressLine1' || key === 'addressLine2' ? 'sm:col-span-2' : ''}`}>
                    <span className='text-sm font-medium text-slate-700'>{label}</span>
                    <input
                      value={shippingAddress[key]}
                      onChange={(event) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          [key]: event.target.value
                        }))
                      }
                      className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-300 focus:bg-white'
                      placeholder={label}
                    />
                  </label>
                ))}
              </div>

              <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700'>
                  <BsCoin size={14} />
                  {checkoutItem.coinCost} coins
                </div>

                <button
                  onClick={claimMerchOrder}
                  disabled={checkoutLoading}
                  className='inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300'
                >
                  {checkoutLoading ? 'Placing order...' : 'Place reward order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RewardsHub
