import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import SetupInterview from './pages/Interview/SetupInterview'
import InterviewRoom from './pages/Interview/InterviewRoom'
import InterviewSummary from './pages/Interview/InterviewSummary'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup-interview" element={<SetupInterview />} />
        <Route path="/interview" element={<InterviewRoom />} />
        <Route path="/interview-summary" element={<InterviewSummary />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
