import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import {
  BsArrowUpRight,
  BsBarChart,
  BsBriefcase,
  BsCheck2Circle,
  BsClockHistory,
  BsFileEarmarkArrowUp,
  BsListOl,
  BsMic,
  BsPersonBadge,
  BsStars
} from 'react-icons/bs'

import axios from 'axios'
import { ServerUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { companyPackMeta, rolePackMeta } from '../utils/rewardsCatalog'

const setupHighlights = [
  {
    icon: <BsPersonBadge size={18} />,
    title: 'Role-specific prompts',
    desc: 'Shape the interview around the work you actually want.'
  },
  {
    icon: <BsMic size={18} />,
    title: 'Voice-enabled round',
    desc: 'Answer naturally with timer pressure and live AI pacing.'
  },
  {
    icon: <BsBarChart size={18} />,
    title: 'Actionable report',
    desc: 'Finish with feedback you can use in the next practice loop.'
  }
]

function Step1SetUp({ onStart, isEmbedded = false }) {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [mode, setMode] = useState('Technical')
  const [questionCount, setQuestionCount] = useState(5)
  const [interviewDuration, setInterviewDuration] = useState(10)
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [atsScore, setAtsScore] = useState(null)
  const [atsFeedback, setAtsFeedback] = useState('')
  const [resumeText, setResumeText] = useState('')

  const [analysisDone, setAnalysisDone] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [selectedRolePack, setSelectedRolePack] = useState('')
  const [selectedCompanyPack, setSelectedCompanyPack] = useState('')

  const ownedRolePacks = userData?.rewardInventory?.rolePacks || []
  const ownedCompanyPacks = userData?.rewardInventory?.companyPacks || []

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return

    setAnalyzing(true)
    setError('')

    const formdata = new FormData()
    formdata.append('resume', resumeFile)
    formdata.append('jobDescription', jobDescription)

    try {
      const result = await axios.post(
        ServerUrl + '/api/interview/resume',
        formdata,
        { withCredentials: true }
      )

      setRole(result.data.role || '')
      setExperience(result.data.experience || '')
      setProjects(result.data.projects || [])
      setSkills(result.data.skills || [])
      setAtsScore(result.data.atsScore || null)
      setAtsFeedback(result.data.atsFeedback || '')
      setResumeText(result.data.resumeText || '')
      setAnalysisDone(true)
    } catch (uploadError) {
      console.log(uploadError)
      setError('Resume analysis could not be completed. You can still continue manually.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleStart = async () => {
    if (!role || !experience || loading) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await axios.post(
        ServerUrl + '/api/interview/generate-questions',
        {
          role,
          experience,
          mode,
          questionCount,
          interviewDuration,
          resumeText,
          projects,
          skills,
          selectedRolePack,
          selectedCompanyPack
        },
        { withCredentials: true }
      )

      if (result.data.updatedUser) {
        dispatch(setUserData(result.data.updatedUser))
      } else if (userData) {
        dispatch(setUserData({
          ...userData,
          credits: result.data.creditsLeft
        }))
      }

      onStart({
        ...result.data,
        role,
        experience,
        mode,
        questionCount: result.data.questionCount || questionCount,
        interviewDuration: result.data.interviewDuration || interviewDuration,
        projects,
        skills,
        selectedRolePack,
        selectedCompanyPack
      })
    } catch (startError) {
      console.log(startError)
      const errorMsg = startError?.response?.data?.message || 'Interview setup could not be completed. Please try again.'
      setError(errorMsg)
      
      if (errorMsg.includes('Not enough credits')) {
        setTimeout(() => navigate('/pricing'), 2500)
      }
    } finally {
      setLoading(false)
    }
  }

  const wrapperClass = isEmbedded
    ? 'w-full'
    : 'min-h-screen px-3 py-6 sm:px-4 sm:py-8'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={wrapperClass}
    >
      <div className='grid gap-4 lg:gap-6 xl:grid-cols-[0.9fr_1.1fr]'>
        <div className='overflow-hidden rounded-[1.7rem] bg-slate-950 p-4 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.55)] sm:rounded-[2rem] sm:p-6 lg:p-7'>
          <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-300'>
            <BsStars size={15} />
            Interview setup
          </div>

          <h2 className='mt-5 text-2xl font-semibold leading-tight sm:mt-6 sm:text-3xl'>
            Build a practice round that actually matches your target role
          </h2>

          <p className='mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:leading-7'>
            Add your role, experience level, and interview mode. If you upload a resume, the AI can pull in more relevant context automatically.
          </p>

          <div className='mt-6 grid gap-3 sm:mt-8 sm:gap-4'>
            {setupHighlights.map((item) => (
              <div
                key={item.title}
                className='rounded-[1.2rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem] sm:p-5'
              >
                <div className='inline-flex rounded-xl bg-white/10 p-3 text-emerald-300'>
                  {item.icon}
                </div>
                <h3 className='mt-4 text-lg font-semibold text-white'>{item.title}</h3>
                <p className='mt-2 text-sm leading-6 text-slate-400'>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className='mt-5 rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-4 sm:mt-6 sm:rounded-[1.5rem] sm:p-5'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-sm text-slate-300'>Current credits</p>
                <p className='mt-2 text-2xl font-semibold text-white sm:text-3xl'>{userData?.credits || 0}</p>
              </div>
              <div>
                <p className='text-sm text-slate-300'>Mock interview tickets</p>
                <p className='mt-2 text-2xl font-semibold text-white sm:text-3xl'>
                  {userData?.rewardInventory?.consumables?.mockInterviewTickets || 0}
                </p>
              </div>
            </div>
            <p className='mt-4 text-sm leading-6 text-slate-400'>
              Each new interview uses 50 credits. If credits run low, one redeemed mock interview ticket is used automatically.
            </p>
          </div>
        </div>

        <div className='rounded-[1.7rem] border border-white/80 bg-white/86 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:rounded-[2rem] sm:p-5 md:p-7'>
          <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.24em] text-emerald-600 sm:text-sm'>Session details</p>
              <h2 className='mt-2 text-xl font-semibold text-slate-900 sm:text-2xl'>Customize your interview setup</h2>
            </div>

            {analysisDone && (
              <div className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-emerald-700'>
                <BsCheck2Circle size={14} />
                Resume analyzed
              </div>
            )}
          </div>

          <div className='mt-6 space-y-4 sm:mt-7 sm:space-y-5'>
            <div className='grid gap-5 md:grid-cols-2'>
              <label className='block'>
                <span className='mb-2 block text-sm font-medium text-slate-700'>Target role</span>
                <div className='relative'>
                  <BsPersonBadge className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                  <input
                    type='text'
                    placeholder='Frontend Developer'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className='w-full rounded-[1.25rem] border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white'
                  />
                </div>
              </label>

              <label className='block'>
                <span className='mb-2 block text-sm font-medium text-slate-700'>Experience level</span>
                <div className='relative'>
                  <BsBriefcase className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                  <input
                    type='text'
                    placeholder='2 years'
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className='w-full rounded-[1.25rem] border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white'
                  />
                </div>
              </label>
            </div>

            <div>
              <span className='mb-2 block text-sm font-medium text-slate-700'>Interview mode</span>
              <div className='grid gap-3 sm:grid-cols-2'>
                {['Technical', 'HR'].map((option) => {
                  const isActive = mode === option

                  return (
                    <button
                      key={option}
                      onClick={() => setMode(option)}
                      className={`rounded-[1.15rem] border px-4 py-4 text-left transition sm:rounded-[1.25rem] ${
                        isActive
                          ? 'border-cyan-200 bg-cyan-50'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-white'
                      }`}
                    >
                      <p className='text-sm font-semibold text-slate-900'>{option} interview</p>
                      <p className='mt-1 text-xs leading-5 text-slate-500'>
                        {option === 'Technical'
                          ? 'Focus on technical depth, problem solving, and role-specific knowledge.'
                          : 'Focus on communication, behavioral answers, and clarity under pressure.'}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className='grid gap-5 md:grid-cols-2'>
              <div>
                <span className='mb-2 block text-sm font-medium text-slate-700'>How many questions?</span>
                <div className='grid grid-cols-2 gap-3'>
                  {[3, 5, 7, 10].map((count) => {
                    const isActive = questionCount === count

                    return (
                      <button
                        key={count}
                        onClick={() => setQuestionCount(count)}
                        className={`rounded-[1.1rem] border px-3.5 py-3.5 text-left transition sm:rounded-[1.25rem] sm:px-4 sm:py-4 ${
                          isActive
                            ? 'border-cyan-200 bg-cyan-50'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-white'
                        }`}
                      >
                        <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'>
                          <BsListOl size={14} />
                          {count} questions
                        </div>
                        <p className='mt-1 text-xs leading-5 text-slate-500'>
                          {count <= 3
                            ? 'Short and focused round.'
                            : count <= 5
                              ? 'Balanced default interview.'
                              : count <= 7
                                ? 'Deeper skill coverage.'
                                : 'Long-form challenge session.'}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className='mb-2 block text-sm font-medium text-slate-700'>How much total time?</span>
                <div className='grid grid-cols-2 gap-3'>
                  {[5, 10, 15, 20].map((minutes) => {
                    const isActive = interviewDuration === minutes

                    return (
                      <button
                        key={minutes}
                        onClick={() => setInterviewDuration(minutes)}
                        className={`rounded-[1.1rem] border px-3.5 py-3.5 text-left transition sm:rounded-[1.25rem] sm:px-4 sm:py-4 ${
                          isActive
                            ? 'border-cyan-200 bg-cyan-50'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-white'
                        }`}
                      >
                        <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'>
                          <BsClockHistory size={14} />
                          {minutes} minutes
                        </div>
                        <p className='mt-1 text-xs leading-5 text-slate-500'>
                          {minutes <= 5
                            ? 'Fast practice sprint.'
                            : minutes <= 10
                              ? 'Standard mock pace.'
                              : minutes <= 15
                                ? 'More room for depth.'
                                : 'Full pressure simulation.'}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {(ownedRolePacks.length > 0 || ownedCompanyPacks.length > 0) && (
              <div className='rounded-[1.2rem] border border-amber-100 bg-amber-50/60 p-4 sm:rounded-[1.5rem] sm:p-5'>
                <div className='flex flex-col gap-2'>
                  <p className='text-sm font-semibold text-slate-900'>Unlocked focus packs</p>
                  <p className='text-sm leading-6 text-slate-500'>
                    Use your unlocked packs to make the interview round more targeted.
                  </p>
                </div>

                <div className='mt-5 grid gap-5 md:grid-cols-2'>
                  {ownedRolePacks.length > 0 && (
                    <div>
                      <span className='mb-2 block text-sm font-medium text-slate-700'>Role pack</span>
                      <select
                        value={selectedRolePack}
                        onChange={(e) => setSelectedRolePack(e.target.value)}
                        className='w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-emerald-300'
                      >
                        <option value=''>No extra role pack</option>
                        {ownedRolePacks.map((pack) => (
                          <option key={pack} value={pack}>
                            {rolePackMeta[pack]?.label || pack}
                          </option>
                        ))}
                      </select>
                      {selectedRolePack && (
                        <p className='mt-2 text-xs leading-5 text-slate-500'>
                          {rolePackMeta[selectedRolePack]?.desc}
                        </p>
                      )}
                    </div>
                  )}

                  {ownedCompanyPacks.length > 0 && (
                    <div>
                      <span className='mb-2 block text-sm font-medium text-slate-700'>Company pack</span>
                      <select
                        value={selectedCompanyPack}
                        onChange={(e) => setSelectedCompanyPack(e.target.value)}
                        className='w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-emerald-300'
                      >
                        <option value=''>No company pack</option>
                        {ownedCompanyPacks.map((pack) => (
                          <option key={pack} value={pack}>
                            {companyPackMeta[pack]?.label || pack}
                          </option>
                        ))}
                      </select>
                      {selectedCompanyPack && (
                        <p className='mt-2 text-xs leading-5 text-slate-500'>
                          {companyPackMeta[selectedCompanyPack]?.desc}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <label className='block'>
              <span className='mb-2 block text-sm font-medium text-slate-700'>Target Job Description</span>
              <textarea
                rows={3}
                placeholder='Paste the job description here for better context and ATS analysis...'
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className='w-full rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white resize-none'
              />
            </label>

            <div className='rounded-[1.2rem] border border-dashed border-slate-300 bg-slate-50/60 p-4 sm:rounded-[1.5rem] sm:p-5'>
              <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div className='flex items-start gap-3 sm:gap-4'>
                  <div className='rounded-2xl bg-white p-3 text-cyan-700 shadow-sm'>
                    <BsFileEarmarkArrowUp size={20} />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-slate-900'>Resume upload</p>
                    <p className='mt-1 text-sm leading-6 text-slate-500'>
                      Optional, but useful if you want the AI to tailor prompts around your background.
                    </p>
                    <p className='mt-2 text-xs uppercase tracking-[0.14em] text-slate-400'>
                      {resumeFile ? resumeFile.name : 'PDF only'}
                    </p>
                  </div>
                </div>

                <div className='flex flex-col gap-3 sm:flex-row'>
                  <label
                    htmlFor='resumeUpload'
                    className='inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-900 sm:w-auto'
                  >
                    Choose file
                  </label>

                  {resumeFile && (
                    <button
                      onClick={handleUploadResume}
                      disabled={analyzing}
                      className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto'
                    >
                      {analyzing ? 'Analyzing...' : 'Analyze resume'}
                      {!analyzing && <BsArrowUpRight size={14} />}
                    </button>
                  )}
                </div>
              </div>

              <input
                id='resumeUpload'
                type='file'
                accept='application/pdf'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setResumeFile(file)
                  setAnalysisDone(false)
                  setProjects([])
                  setSkills([])
                  setAtsScore(null)
                  setAtsFeedback('')
                  setResumeText('')
                  setError('')
                }}
              />
            </div>

            {analysisDone && (
              <div className='rounded-[1.2rem] border border-emerald-100 bg-emerald-50/70 p-4 sm:rounded-[1.5rem] sm:p-5'>
                <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                  <div>
                    <h3 className='text-lg font-semibold text-slate-900'>Resume insights</h3>
                    <p className='mt-1 text-sm leading-6 text-slate-500'>
                      The extracted context below will be used to make questions more relevant.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setResumeFile(null)
                      setAnalysisDone(false)
                      setProjects([])
                      setSkills([])
                      setAtsScore(null)
                      setAtsFeedback('')
                      setResumeText('')
                    }}
                    className='text-sm font-medium text-slate-600 transition hover:text-slate-900'
                  >
                    Clear resume
                  </button>
                </div>

                <div className='mt-5 grid gap-5 md:grid-cols-2'>
                  <div>
                    <p className='text-sm font-medium text-slate-700'>Projects</p>
                    {projects.length > 0 ? (
                      <ul className='mt-3 space-y-2 text-sm leading-6 text-slate-600'>
                        {projects.map((project, index) => (
                          <li key={`${project}-${index}`} className='flex items-start gap-2'>
                            <BsCheck2Circle className='mt-1 text-emerald-600' size={14} />
                            <span>{project}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='mt-3 text-sm text-slate-500'>No project details were extracted.</p>
                    )}
                  </div>

                  <div>
                    <p className='text-sm font-medium text-slate-700'>Skills</p>
                    <div className='mt-3 flex flex-wrap gap-2'>
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className='rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm'
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className='text-sm text-slate-500'>No skills were extracted.</p>
                      )}
                    </div>
                  </div>
                </div>

                {atsScore && (
                  <div className='mt-5 rounded-[1.25rem] border border-cyan-100 bg-white p-4 shadow-sm'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-medium text-slate-700'>ATS Match Score</p>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${atsScore > 75 ? 'bg-emerald-100 text-emerald-700' : atsScore > 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {atsScore}%
                      </span>
                    </div>
                    {atsFeedback && (
                      <p className='mt-2 text-sm leading-6 text-slate-600'>
                        {atsFeedback}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className='rounded-[1.25rem] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
                {error}
              </div>
            )}

            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: !role || !experience || loading ? 1 : 1.01 }}
              whileTap={{ scale: !role || !experience || loading ? 1 : 0.99 }}
              className='flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300'
            >
              {loading ? 'Generating interview...' : 'Start interview'}
              {!loading && <BsArrowUpRight size={15} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Step1SetUp
