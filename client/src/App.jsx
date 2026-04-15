import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Temp'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
import ResumeBuilder from './pages/ResumeBuilder'
import RewardsHub from './pages/RewardsHub'
import AdminRewardOrders from './pages/AdminRewardOrders'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { useLocation } from 'react-router-dom'

export const ServerUrl  = "http://localhost:8000"

function App() {

  const dispatch = useDispatch()
  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {withCredentials:true})
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()

  },[dispatch])

  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageWrapper><Home/></PageWrapper>}/>
        <Route path='/auth' element={<PageWrapper><Auth/></PageWrapper>}/>
        <Route path='/interview' element={<PageWrapper><InterviewPage/></PageWrapper>}/>
        <Route path='/history' element={<PageWrapper><InterviewHistory/></PageWrapper>}/>
        <Route path='/pricing' element={<PageWrapper><Pricing/></PageWrapper>}/>
        <Route path='/report/:id' element={<PageWrapper><InterviewReport/></PageWrapper>}/>
        <Route path='/resume-builder' element={<PageWrapper><ResumeBuilder/></PageWrapper>}/>
        <Route path='/rewards' element={<PageWrapper><RewardsHub/></PageWrapper>}/>
        <Route path='/admin/reward-orders' element={<PageWrapper><AdminRewardOrders/></PageWrapper>}/>
      </Routes>
    </AnimatePresence>
  )
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)

export default App
