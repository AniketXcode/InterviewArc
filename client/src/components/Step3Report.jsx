import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  BsArrowLeft,
  BsAward,
  BsArrowRepeat,
  BsBarChart,
  BsCheck2Circle,
  BsCoin,
  BsDownload,
  BsLock,
  BsStars
} from 'react-icons/bs'
import axios from 'axios'
import { ServerUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { premiumReportStoreItem } from '../utils/rewardsCatalog'

function Step3Report({
  report,
  isEmbedded = false,
  backPath = '/history',
  onRestart = null
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const [unlockingPremium, setUnlockingPremium] = React.useState(false)
  const [unlockMessage, setUnlockMessage] = React.useState('')
  const [unlockError, setUnlockError] = React.useState('')

  if (!report) {
    return (
      <div className={isEmbedded ? 'w-full' : 'min-h-screen flex items-center justify-center px-4 py-10'}>
        <div className='rounded-[2rem] border border-white/80 bg-white/86 px-8 py-10 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
          <p className='text-lg font-medium text-slate-700'>Loading report...</p>
        </div>
      </div>
    )
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
    rewardSummary = null
  } = report

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: 'Confidence', value: confidence },
    { label: 'Communication', value: communication },
    { label: 'Correctness', value: correctness }
  ]

  let performanceText = ''
  let shortTagline = ''
  let advice = ''

  if (finalScore >= 8) {
    performanceText = 'Ready for job opportunities.'
    shortTagline = 'Excellent clarity and structured responses.'
    advice =
      'Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.'
  } else if (finalScore >= 5) {
    performanceText = 'Needs minor improvement before interviews.'
    shortTagline = 'Good foundation, refine articulation.'
    advice =
      'Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.'
  } else {
    performanceText = 'Significant improvement required.'
    shortTagline = 'Work on clarity and confidence.'
    advice =
      'Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.'
  }

  const percentage = (finalScore / 10) * 100
  const hasPremiumReportAccess = Boolean(userData?.rewardInventory?.premiumReportAccess)

  const premiumInsight = hasPremiumReportAccess
    ? finalScore >= 8
      ? 'You are showing strong readiness. Start targeting company-specific and higher-pressure rounds next.'
      : finalScore >= 6
        ? 'Your fundamentals are solid. Focus your next two sessions on stronger examples and cleaner answer openings.'
        : 'Build consistency first. Shorter, structured answers and regular daily practice will raise both confidence and clarity.'
    : ''

  const downloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4')

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - margin * 2

    let currentY = 25

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(34, 197, 94)
    doc.text('AI Interview Performance Report', pageWidth / 2, currentY, {
      align: 'center'
    })

    currentY += 5

    doc.setDrawColor(34, 197, 94)
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2)

    currentY += 15

    doc.setFillColor(240, 253, 244)
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, 'F')

    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: 'center'
    })

    currentY += 30

    doc.setFillColor(249, 250, 251)
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, 'F')

    doc.setFontSize(12)
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10)
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18)
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26)

    currentY += 45

    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(220)
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4)

    doc.setFont('helvetica', 'bold')
    doc.text('Professional Advice', margin + 10, currentY + 10)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20)
    doc.text(splitAdvice, margin + 10, currentY + 20)

    currentY += 50

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['#', 'Question', 'Score', 'Feedback']],
      body: questionWiseScore.map((question, index) => [
        `${index + 1}`,
        question.question,
        `${question.score}/10`,
        question.feedback
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: 'top'
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 'auto' }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    })

    doc.save('AI_Interview_Report.pdf')
  }

  const unlockPremiumReport = async () => {
    if (unlockingPremium) {
      return
    }

    setUnlockingPremium(true)
    setUnlockMessage('')
    setUnlockError('')

    try {
      const result = await axios.post(
        ServerUrl + '/api/user/store/purchase',
        { itemId: premiumReportStoreItem.id },
        { withCredentials: true }
      )

      dispatch(setUserData(result.data.user))
      setUnlockMessage(result.data.message)
    } catch (error) {
      console.log(error)
      setUnlockError(error?.response?.data?.message || 'Premium report could not be unlocked.')
    } finally {
      setUnlockingPremium(false)
    }
  }

  const outerClass = isEmbedded
    ? 'w-full'
    : 'min-h-screen px-4 py-8 sm:px-6 lg:px-8'

  return (
    <div className={outerClass}>
      <div className='space-y-6'>
        {unlockMessage && (
          <div className='rounded-[1.25rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
            {unlockMessage}
          </div>
        )}

        {unlockError && (
          <div className='rounded-[1.25rem] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
            {unlockError}
          </div>
        )}

        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-start gap-4'>
            {!isEmbedded && (
              <button
                onClick={() => navigate(backPath)}
                className='mt-1 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/85 text-slate-700 shadow-sm backdrop-blur transition hover:text-slate-900'
              >
                <BsArrowLeft size={16} />
              </button>
            )}

            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur'>
                <BsStars size={14} className='text-cyan-500' />
                Final report ready
              </div>
              <h1 className='mt-4 text-3xl font-semibold text-slate-900 md:text-4xl'>
                Interview analytics dashboard
              </h1>
              <p className='mt-2 text-sm leading-7 text-slate-500'>
                Review your overall score, question breakdown, and practical areas to improve next.
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-3 sm:flex-row'>
            {onRestart && (
              <button
                onClick={onRestart}
                className='inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-900'
              >
                <BsArrowRepeat size={15} />
                Practice again
              </button>
            )}

            <button
              onClick={downloadPDF}
              className='inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800'
            >
              <BsDownload size={15} />
              Download PDF
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6'>
            {rewardSummary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='rounded-[2rem] border border-amber-100 bg-amber-50/80 p-7 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]'
              >
                <div className='flex items-center gap-3'>
                  <div className='rounded-full bg-white p-2 text-amber-600 shadow-sm'>
                    <BsCoin size={16} />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-slate-900'>Rewards earned</h3>
                    <p className='mt-1 text-sm text-slate-500'>This round now contributes to your progression loop.</p>
                  </div>
                </div>

                <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                  <div className='rounded-[1.25rem] bg-white px-4 py-4'>
                    <p className='text-sm text-slate-500'>Coins earned</p>
                    <p className='mt-2 text-2xl font-semibold text-slate-900'>{rewardSummary.coinsEarned || 0}</p>
                  </div>
                  <div className='rounded-[1.25rem] bg-white px-4 py-4'>
                    <p className='text-sm text-slate-500'>XP earned</p>
                    <p className='mt-2 text-2xl font-semibold text-slate-900'>{rewardSummary.xpEarned || 0}</p>
                  </div>
                </div>

                {(rewardSummary.badges || []).length > 0 && (
                  <div className='mt-5 flex flex-wrap gap-2'>
                    {rewardSummary.badges.map((badge) => (
                      <div
                        key={badge.key}
                        className='rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-emerald-700'
                      >
                        {badge.label}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='rounded-[2rem] border border-white/80 bg-white/86 p-7 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'
            >
              <h3 className='text-sm uppercase tracking-[0.18em] text-slate-400'>
                Overall performance
              </h3>

              <div className='mx-auto mt-6 h-28 w-28'>
                <CircularProgressbar
                  value={percentage}
                  text={`${finalScore}/10`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: '#10b981',
                    textColor: '#0f172a',
                    trailColor: '#e5e7eb'
                  })}
                />
              </div>

              <p className='mt-5 font-semibold text-slate-900'>{performanceText}</p>
              <p className='mt-2 text-sm leading-6 text-slate-500'>{shortTagline}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='rounded-[2rem] border border-white/80 bg-white/86 p-7 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'
            >
              <h3 className='text-lg font-semibold text-slate-900'>Skill evaluation</h3>

              <div className='mt-6 space-y-5'>
                {skills.map((skill) => (
                  <div key={skill.label}>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <span className='text-slate-600'>{skill.label}</span>
                      <span className='font-semibold text-emerald-600'>{skill.value}</span>
                    </div>

                    <div className='h-3 rounded-full bg-slate-100'>
                      <div
                        className='h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400'
                        style={{ width: `${skill.value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='rounded-[2rem] border border-emerald-100 bg-emerald-50/70 p-7 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]'
            >
              <div className='flex items-start gap-3'>
                <div className='rounded-full bg-white p-2 text-emerald-600 shadow-sm'>
                  <BsCheck2Circle size={16} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>Professional advice</h3>
                  <p className='mt-3 text-sm leading-7 text-slate-600'>{advice}</p>
                </div>
              </div>
            </motion.div>

            {hasPremiumReportAccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='rounded-[2rem] border border-cyan-100 bg-cyan-50/80 p-7 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]'
              >
                <div className='flex items-start gap-3'>
                  <div className='rounded-full bg-white p-2 text-cyan-700 shadow-sm'>
                    <BsAward size={16} />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-slate-900'>Premium insight</h3>
                    <p className='mt-3 text-sm leading-7 text-slate-600'>{premiumInsight}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {!hasPremiumReportAccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='rounded-[2rem] border border-amber-100 bg-amber-50/80 p-7 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]'
              >
                <div className='flex items-start gap-3'>
                  <div className='rounded-full bg-white p-2 text-amber-600 shadow-sm'>
                    <BsLock size={16} />
                  </div>
                  <div className='w-full'>
                    <h3 className='text-lg font-semibold text-slate-900'>Unlock premium report insights</h3>
                    <p className='mt-3 text-sm leading-7 text-slate-600'>
                      Redeem permanent premium insights right from this screen and keep advanced guidance available for future reports too.
                    </p>

                    <div className='mt-5 flex flex-col gap-3 sm:flex-row sm:items-center'>
                      <div className='inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700'>
                        <BsCoin size={14} className='text-emerald-600' />
                        {premiumReportStoreItem.coinCost} coins
                      </div>

                      <button
                        onClick={unlockPremiumReport}
                        disabled={unlockingPremium}
                        className='inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300'
                      >
                        {unlockingPremium ? 'Redeeming...' : 'Redeem premium insight'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className='space-y-6 lg:col-span-2'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='rounded-[2rem] border border-white/80 bg-white/86 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:p-7'
            >
              <div className='flex items-center gap-3'>
                <div className='rounded-xl bg-cyan-50 p-3 text-cyan-700'>
                  <BsBarChart size={18} />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>Performance trend</h3>
                  <p className='text-sm text-slate-500'>Question-wise score movement across the full round</p>
                </div>
              </div>

              <div className='mt-6 h-72'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={questionScoreData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
                    <XAxis dataKey='name' stroke='#94a3b8' />
                    <YAxis domain={[0, 10]} stroke='#94a3b8' />
                    <Tooltip />
                    <Area
                      type='monotone'
                      dataKey='score'
                      stroke='#22c55e'
                      fill='#bbf7d0'
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='rounded-[2rem] border border-white/80 bg-white/86 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:p-7'
            >
              <h3 className='text-lg font-semibold text-slate-900'>Question breakdown</h3>

              <div className='mt-6 space-y-5'>
                {questionWiseScore.map((question, index) => (
                  <div
                    key={`${question.question}-${index}`}
                    className='rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-5'
                  >
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                      <div>
                        <p className='text-xs uppercase tracking-[0.14em] text-slate-400'>
                          Question {index + 1}
                        </p>
                        <p className='mt-2 text-base font-semibold leading-7 text-slate-900'>
                          {question.question || 'Question not available'}
                        </p>
                      </div>

                      <div className='rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700'>
                        {question.score ?? 0}/10
                      </div>
                    </div>

                    <div className='mt-4 rounded-[1.25rem] border border-emerald-100 bg-white p-4'>
                      <p className='text-xs uppercase tracking-[0.14em] text-emerald-600'>AI feedback</p>
                      <p className='mt-2 text-sm leading-7 text-slate-600'>
                        {question.feedback && question.feedback.trim() !== ''
                          ? question.feedback
                          : 'No feedback available for this question.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step3Report
