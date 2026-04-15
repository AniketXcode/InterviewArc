import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BsArrowLeft, BsBoxSeam, BsCheck2Circle } from 'react-icons/bs'
import { ServerUrl } from '../App'

const statusOptions = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']

function AdminRewardOrders() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const loadOrders = async () => {
    const result = await axios.get(ServerUrl + '/api/user/admin/reward-orders', {
      withCredentials: true
    })
    setOrders(result.data.orders || [])
  }

  useEffect(() => {
    const run = async () => {
      try {
        await loadOrders()
      } catch (loadError) {
        console.log(loadError)
        setError(loadError?.response?.data?.message || 'Admin orders could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  const updateStatus = async (orderId, status) => {
    if (updatingId) {
      return
    }

    setUpdatingId(orderId)
    setMessage('')
    setError('')

    try {
      const result = await axios.patch(
        `${ServerUrl}/api/user/admin/reward-orders/${orderId}`,
        { status },
        { withCredentials: true }
      )

      setMessage(result.data.message)
      await loadOrders()
    } catch (updateError) {
      console.log(updateError)
      setError(updateError?.response?.data?.message || 'Order update failed.')
    } finally {
      setUpdatingId('')
    }
  }

  if (!userData?.isAdmin) {
    return (
      <div className='min-h-screen bg-[#eef6f6] px-4 py-10 text-slate-900'>
        <div className='mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-white/90 p-8 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]'>
          <h1 className='text-2xl font-semibold'>Admin access required</h1>
          <p className='mt-3 text-sm leading-7 text-slate-500'>
            This page is only available for configured admin accounts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#eef6f6] px-3 py-6 text-slate-900 sm:px-4 sm:py-8 md:px-6'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/rewards')}
              className='inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-sm transition hover:text-slate-900'
            >
              <BsArrowLeft size={16} />
            </button>

            <div>
              <p className='text-xs uppercase tracking-[0.18em] text-emerald-600'>Admin panel</p>
              <h1 className='mt-2 text-2xl font-semibold sm:text-3xl'>Reward orders</h1>
              <p className='mt-2 text-sm leading-7 text-slate-500'>
                Track who claimed what, where it should be shipped, and move each order through fulfillment.
              </p>
            </div>
          </div>

          <div className='rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white'>
            {orders.length} orders
          </div>
        </div>

        {message && <div className='rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>{message}</div>}
        {error && <div className='rounded-[1.2rem] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>{error}</div>}

        <div className='grid gap-4'>
          {loading ? (
            <div className='rounded-[2rem] border border-white/80 bg-white/90 p-8 text-sm text-slate-500 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]'>
              Loading reward orders...
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className='rounded-[1.8rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]'
              >
                <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-xl bg-violet-50 p-3 text-violet-700'>
                        <BsBoxSeam size={18} />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-slate-900'>{order.title}</h3>
                        <p className='mt-1 text-xs uppercase tracking-[0.16em] text-slate-400'>{order.orderNumber}</p>
                      </div>
                    </div>

                    <div className='grid gap-3 sm:grid-cols-2'>
                      <div className='rounded-[1.2rem] bg-slate-50 px-4 py-3'>
                        <p className='text-xs uppercase tracking-[0.14em] text-slate-400'>Customer</p>
                        <p className='mt-2 text-sm font-semibold text-slate-900'>{order.userName}</p>
                        <p className='mt-1 text-sm text-slate-500'>{order.userEmail}</p>
                      </div>

                      <div className='rounded-[1.2rem] bg-slate-50 px-4 py-3'>
                        <p className='text-xs uppercase tracking-[0.14em] text-slate-400'>Shipping</p>
                        <p className='mt-2 text-sm font-semibold text-slate-900'>{order.shippingAddress?.fullName}</p>
                        <p className='mt-1 text-sm leading-6 text-slate-500'>
                          {order.shippingAddress?.addressLine1}, {order.shippingAddress?.addressLine2} {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                        </p>
                        <p className='mt-1 text-sm text-slate-500'>{order.shippingAddress?.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className='min-w-[220px] space-y-3 rounded-[1.4rem] border border-slate-100 bg-slate-50/80 p-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-slate-500'>Coins spent</span>
                      <span className='text-sm font-semibold text-amber-700'>{order.coinCost}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-slate-500'>Current status</span>
                      <span className='text-sm font-semibold capitalize text-emerald-700'>{order.status}</span>
                    </div>

                    <div>
                      <label className='text-xs uppercase tracking-[0.14em] text-slate-400'>Update status</label>
                      <select
                        value={order.status}
                        onChange={(event) => updateStatus(order._id, event.target.value)}
                        disabled={updatingId === order._id}
                        className='mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-300'
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {order.adminNotes && (
                      <div className='rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-500'>
                        <span className='font-semibold text-slate-700'>Admin note:</span> {order.adminNotes}
                      </div>
                    )}

                    <div className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs uppercase tracking-[0.14em] text-emerald-700'>
                      <BsCheck2Circle size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='rounded-[2rem] border border-white/80 bg-white/90 p-8 text-sm text-slate-500 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]'>
              No reward orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminRewardOrders
