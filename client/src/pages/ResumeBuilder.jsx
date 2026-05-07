import React, { useMemo, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import {
  BsArrowLeft,
  BsBarChart,
  BsBriefcase,
  BsCheck2Circle,
  BsCodeSlash,
  BsDownload,
  BsFileEarmarkText,
  BsGeoAlt,
  BsGlobe2,
  BsLightningCharge,
  BsPatchCheck,
  BsPersonCheck,
  BsPlus,
  BsStars,
  BsTelephone,
  BsTools
} from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const atsSignals = [
  'Clear role-aligned summary',
  'Action verbs with measurable impact',
  'Readable skill keywords',
  'Simple ATS-friendly layout'
]

const resumeTemplates = [
  {
    id: 'software',
    name: 'Software Engineer',
    badge: 'Tech role',
    icon: BsCodeSlash,
    accentClass: 'from-sky-500 to-emerald-400',
    chipClass: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    pdfAccent: [14, 165, 233],
    pdfAccentDark: [2, 132, 199],
    data: {
      role: 'Frontend Developer',
      summary: 'Frontend developer with hands-on experience building responsive React applications, integrating REST APIs, and improving page performance. Strong in component architecture, state management, accessibility, and translating product requirements into polished user experiences.',
      experience: [
        {
          title: 'Frontend Developer',
          company: 'Product Studio',
          duration: 'Jan 2024 - Present',
          description: 'Built reusable React components for dashboard workflows, reducing repeated UI work by 35%. Integrated authentication, API error states, and analytics events to improve product reliability and user visibility.'
        },
        {
          title: 'Web Developer Intern',
          company: 'Digital Labs',
          duration: 'Jun 2023 - Dec 2023',
          description: 'Shipped landing pages and internal tools with React, Tailwind CSS, and Firebase. Improved Lighthouse performance score from 72 to 91 by optimizing images, lazy loading routes, and reducing unused scripts.'
        }
      ],
      education: [
        { degree: 'B.Tech in Computer Science', institution: 'Your University', duration: '2020 - 2024' }
      ],
      skills: 'React, JavaScript, TypeScript, Tailwind CSS, Redux, Node.js, REST APIs, Git, Firebase, Performance Optimization'
    }
  },
  {
    id: 'business',
    name: 'Business Analyst',
    badge: 'Strategy role',
    icon: BsBarChart,
    accentClass: 'from-emerald-500 to-lime-400',
    chipClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    pdfAccent: [16, 185, 129],
    pdfAccentDark: [5, 150, 105],
    data: {
      role: 'Business Analyst',
      summary: 'Business analyst skilled at converting ambiguous requirements into clear product workflows, dashboards, and stakeholder-ready insights. Experienced with SQL, Excel, user research, documentation, and cross-functional delivery.',
      experience: [
        {
          title: 'Business Analyst',
          company: 'Growth Operations',
          duration: 'Feb 2024 - Present',
          description: 'Mapped customer onboarding journeys and identified process gaps that reduced ticket escalations by 22%. Created weekly KPI dashboards for leadership using SQL extracts, Excel models, and concise business narratives.'
        },
        {
          title: 'Operations Intern',
          company: 'ScaleWorks',
          duration: 'Jul 2023 - Jan 2024',
          description: 'Documented product requirements, coordinated sprint handoffs, and maintained issue trackers for a 6-member product team. Helped standardize reporting templates across sales and customer success.'
        }
      ],
      education: [
        { degree: 'BBA / MBA / Relevant Degree', institution: 'Your Institute', duration: '2020 - 2024' }
      ],
      skills: 'SQL, Excel, Power BI, Requirement Gathering, User Stories, Process Mapping, Stakeholder Management, KPI Reporting, Jira'
    }
  },
  {
    id: 'fresher',
    name: 'Fresher Starter',
    badge: 'Entry level',
    icon: BsPersonCheck,
    accentClass: 'from-cyan-500 to-violet-500',
    chipClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300',
    pdfAccent: [6, 182, 212],
    pdfAccentDark: [8, 145, 178],
    data: {
      role: 'Entry-Level Professional',
      summary: 'Motivated graduate with strong fundamentals, project experience, and a quick learning mindset. Comfortable working with teams, documenting work clearly, and using modern tools to solve practical business and technology problems.',
      experience: [
        {
          title: 'Academic Project Lead',
          company: 'Final Year Project',
          duration: 'Aug 2023 - Apr 2024',
          description: 'Led a 4-member team to design and present a working project prototype. Managed task planning, research, documentation, testing, and final presentation for faculty evaluation.'
        },
        {
          title: 'Intern / Volunteer',
          company: 'Campus or Organization',
          duration: 'May 2023 - Jul 2023',
          description: 'Supported day-to-day coordination, prepared reports, and collaborated with peers to complete assigned tasks on time. Built confidence in communication, ownership, and structured problem-solving.'
        }
      ],
      education: [
        { degree: 'Bachelor Degree / Diploma', institution: 'Your College', duration: '2020 - 2024' }
      ],
      skills: 'Communication, Problem Solving, MS Excel, Google Workspace, Research, Documentation, Team Collaboration, Presentation Skills'
    }
  }
]

function ResumeBuilder() {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState(resumeTemplates[0].id)

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: ''
  })

  const [experience, setExperience] = useState([
    { title: '', company: '', duration: '', description: '' }
  ])

  const [education, setEducation] = useState([
    { degree: '', institution: '', duration: '' }
  ])

  const [skills, setSkills] = useState('')

  const skillsCount = useMemo(
    () => skills.split(',').map((item) => item.trim()).filter(Boolean).length,
    [skills]
  )

  const activeTemplate = useMemo(
    () => resumeTemplates.find((template) => template.id === selectedTemplate) || resumeTemplates[0],
    [selectedTemplate]
  )

  const resumeReadiness = useMemo(() => {
    let completed = 0

    if (personalInfo.name.trim()) completed += 1
    if (personalInfo.role.trim()) completed += 1
    if (personalInfo.email.trim()) completed += 1
    if (personalInfo.phone.trim()) completed += 1
    if (personalInfo.summary.trim().length > 40) completed += 1
    if (experience.some((item) => item.title.trim() || item.company.trim() || item.description.trim())) completed += 1
    if (education.some((item) => item.degree.trim() || item.institution.trim())) completed += 1
    if (skillsCount >= 4) completed += 1

    const score = Math.round((completed / 8) * 100)

    return {
      completed,
      total: 8,
      score,
      label: score >= 85 ? 'Strong' : score >= 60 ? 'Good start' : 'Needs detail'
    }
  }, [education, experience, personalInfo, skillsCount])

  const handleInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const handleExpChange = (index, e) => {
    const updated = [...experience]
    updated[index][e.target.name] = e.target.value
    setExperience(updated)
  }

  const handleEduChange = (index, e) => {
    const updated = [...education]
    updated[index][e.target.name] = e.target.value
    setEducation(updated)
  }

  const applyTemplate = (template) => {
    setSelectedTemplate(template.id)
    setPersonalInfo((current) => ({
      ...current,
      role: template.data.role,
      summary: template.data.summary
    }))
    setExperience(template.data.experience)
    setEducation(template.data.education)
    setSkills(template.data.skills)
  }

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const margin = 16
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const contentWidth = pageWidth - margin * 2
    const accent = activeTemplate.pdfAccent
    const accentDark = activeTemplate.pdfAccentDark
    const textPrimary = [15, 23, 42]
    const textMuted = [100, 116, 139]
    const lineColor = [226, 232, 240]
    let currentY = 18

    const ensureSpace = (requiredHeight = 18) => {
      if (currentY + requiredHeight <= pageHeight - 16) return
      doc.addPage()
      currentY = 18
    }

    const drawSectionHeading = (title) => {
      ensureSpace(16)
      doc.setFillColor(...accent)
      doc.roundedRect(margin, currentY - 1, 20, 6.5, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.text('SECTION', margin + 10, currentY + 3.2, { align: 'center' })
      doc.setTextColor(...accentDark)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(title, margin + 25, currentY + 3.2)
      currentY += 9
      doc.setDrawColor(...lineColor)
      doc.setLineWidth(0.4)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 6
    }

    doc.setFillColor(248, 250, 252)
    doc.roundedRect(margin, currentY, contentWidth, 28, 5, 5, 'F')

    doc.setFillColor(...accent)
    doc.rect(margin, currentY, 5, 28, 'F')

    doc.setTextColor(...textPrimary)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.text(personalInfo.name || 'Your Name', margin + 10, currentY + 10)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...accentDark)
    doc.setFontSize(10)
    doc.text(personalInfo.role || activeTemplate.data.role, margin + 10, currentY + 15.2)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textMuted)
    doc.setFontSize(9)
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin
    ].filter(Boolean).join('  |  ')
    doc.text(contactInfo || 'Email  |  Phone  |  Location', margin + 10, currentY + 21.5)

    doc.setTextColor(...accentDark)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(activeTemplate.name.toUpperCase(), pageWidth - margin - 2, currentY + 8, { align: 'right' })

    doc.setTextColor(...textMuted)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated from InterviewArc`, pageWidth - margin - 2, currentY + 16, { align: 'right' })

    currentY += 36

    if (personalInfo.summary) {
      drawSectionHeading('Professional Summary')
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(margin, currentY - 1, contentWidth, 20, 3, 3, 'F')
      doc.setTextColor(...textPrimary)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10.5)
      const splitSummary = doc.splitTextToSize(personalInfo.summary, pageWidth - margin * 2)
      doc.text(splitSummary, margin + 4, currentY + 5)
      currentY += Math.max(20, splitSummary.length * 5 + 9)
    }

    const populatedExperience = experience.filter((exp) => exp.title || exp.company || exp.description)

    if (populatedExperience.length > 0) {
      drawSectionHeading('Experience')

      populatedExperience.forEach((exp) => {
        const descriptionLines = exp.description
          ? doc.splitTextToSize(exp.description, contentWidth - 8)
          : []
        const blockHeight = Math.max(18, 13 + descriptionLines.length * 4.5)

        ensureSpace(blockHeight + 6)
        doc.setFillColor(255, 255, 255)
        doc.roundedRect(margin, currentY - 1.5, contentWidth, blockHeight, 3, 3, 'F')
        doc.setDrawColor(...lineColor)
        doc.roundedRect(margin, currentY - 1.5, contentWidth, blockHeight, 3, 3, 'S')

        doc.setTextColor(...textPrimary)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.text(exp.title || 'Job Title', margin + 4, currentY + 4)

        doc.setTextColor(...accentDark)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9.5)
        doc.text(exp.duration || 'Date', pageWidth - margin - 4, currentY + 4, { align: 'right' })

        doc.setTextColor(...textMuted)
        doc.setFont('helvetica', 'italic')
        doc.text(exp.company || 'Company Name', margin + 4, currentY + 9)

        if (exp.description) {
          const bulletText = descriptionLines.map((line, index) => `${index === 0 ? '- ' : '  '}${line}`)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(...textPrimary)
          doc.setFontSize(9.5)
          doc.text(bulletText, margin + 4, currentY + 15)
        }

        currentY += blockHeight + 4
      })
    }

    const populatedEducation = education.filter((edu) => edu.degree || edu.institution || edu.duration)

    if (populatedEducation.length > 0) {
      drawSectionHeading('Education')

      populatedEducation.forEach((edu) => {
        ensureSpace(18)

        doc.setTextColor(...textPrimary)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text(edu.institution || 'University Name', margin, currentY)

        doc.setTextColor(...accentDark)
        doc.setFont('helvetica', 'normal')
        doc.text(edu.duration || 'Year', pageWidth - margin, currentY, { align: 'right' })

        currentY += 5
        doc.setTextColor(...textMuted)
        doc.setFont('helvetica', 'italic')
        doc.text(edu.degree || 'Degree', margin, currentY)
        currentY += 9
      })
    }

    if (skills) {
      drawSectionHeading('Skills')

      const normalizedSkills = skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .join('  |  ')

      ensureSpace(18)
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(margin, currentY - 1, contentWidth, 16, 3, 3, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...textPrimary)
      doc.setFontSize(10)
      const splitSkills = doc.splitTextToSize(normalizedSkills, contentWidth - 8)
      doc.text(splitSkills, margin + 4, currentY + 5)
      currentY += Math.max(16, splitSkills.length * 5 + 6)
    }

    doc.save(`${personalInfo.name ? personalInfo.name.replace(/\s+/g, '_') : 'My_ATS'}_Resume.pdf`)
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#f4fbfb] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(43,218,237,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.04),transparent_42%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.1),transparent_30%),radial-gradient(circle_at_bottom,rgba(148,163,184,0.06),transparent_42%)]' />
      <div className='pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10' />
      <div className='pointer-events-none absolute right-[-120px] top-12 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10' />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <Navbar />

        <main className='flex-1 px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10'>
          <div className='mx-auto max-w-6xl space-y-6'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div className='space-y-4'>
                <button
                  onClick={() => navigate('/')}
                  className='inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-white'
                >
                  <BsArrowLeft size={14} /> Back
                </button>

                <div className='space-y-3'>
                  <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-4 py-2 text-sm text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/70 dark:text-emerald-300'>
                    <BsStars size={15} className='text-cyan-500' />
                    Premium ATS workspace
                  </div>

                  <h1 className='max-w-3xl text-3xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl'>
                    Build an ATS-friendly resume that looks
                    <span className='mx-2 mt-2 inline-block rounded-[1.4rem] bg-gradient-to-r from-emerald-500 to-cyan-400 px-4 py-1.5 text-white shadow-lg shadow-cyan-200/60 sm:mt-0 sm:rounded-[2rem] sm:px-5'>
                      clean and premium
                    </span>
                  </h1>

                  <p className='max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base'>
                    Fill in the essentials, keep the structure recruiter-friendly, and export a clean PDF that stays easy for ATS systems to parse.
                  </p>
                </div>
              </div>

              <button
                onClick={generatePDF}
                className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-md dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 lg:w-auto'
              >
                <BsDownload size={16} />
                Download PDF
              </button>
            </div>

            <div className='grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:gap-6'>
              <div className='space-y-4 sm:space-y-5'>
                <div className='overflow-hidden rounded-[1.7rem] border border-white/80 bg-slate-950 text-white shadow-[0_28px_80px_-40px_rgba(15,23,42,0.6)] sm:rounded-[2rem]'>
                  <div className='bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.24),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.22),_transparent_40%)] p-5 sm:p-6'>
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                      <div>
                        <p className='text-xs uppercase tracking-[0.24em] text-emerald-300'>ATS readiness</p>
                        <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>{resumeReadiness.score}%</h2>
                        <p className='mt-2 text-sm text-slate-300'>
                          {resumeReadiness.label} profile with {resumeReadiness.completed}/{resumeReadiness.total} key sections filled.
                        </p>
                      </div>

                      <div className='rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-left sm:text-right'>
                        <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>Quick status</p>
                        <p className='mt-2 text-lg font-semibold text-white'>Resume-ready</p>
                        <p className='mt-1 text-sm text-slate-400'>Simple format, no ATS noise</p>
                      </div>
                    </div>

                    <div className='mt-5 h-2 overflow-hidden rounded-full bg-white/10'>
                      <div
                        className='h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 transition-all duration-500'
                        style={{ width: `${resumeReadiness.score}%` }}
                      />
                    </div>

                    <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4'>
                      <div className='rounded-[1.15rem] border border-white/10 bg-white/5 p-4'>
                        <p className='text-sm text-slate-400'>Skills added</p>
                        <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>{skillsCount}</p>
                      </div>
                      <div className='rounded-[1.15rem] border border-white/10 bg-white/5 p-4'>
                        <p className='text-sm text-slate-400'>Experience blocks</p>
                        <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>{experience.length}</p>
                      </div>
                      <div className='rounded-[1.15rem] border border-white/10 bg-white/5 p-4'>
                        <p className='text-sm text-slate-400'>Education blocks</p>
                        <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>{education.length}</p>
                      </div>
                      <div className='rounded-[1.15rem] border border-white/10 bg-white/5 p-4'>
                        <p className='text-sm text-slate-400'>Summary</p>
                        <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>
                          {personalInfo.summary.trim() ? 'Ready' : 'Add'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='rounded-[1.6rem] border border-white/80 bg-white/88 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-slate-900/75 sm:p-5'>
                  <div className='flex items-start gap-3'>
                    <div className='rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'>
                      <BsBriefcase size={18} />
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>Resume templates</h3>
                      <p className='mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        Pick a realistic starter template, then edit it into your own profile.
                      </p>
                    </div>
                  </div>

                  <div className='mt-5 grid gap-3'>
                    {resumeTemplates.map((template) => {
                      const TemplateIcon = template.icon
                      const isSelected = selectedTemplate === template.id

                      return (
                        <button
                          key={template.id}
                          type='button'
                          onClick={() => applyTemplate(template)}
                          className={`group w-full rounded-[1.15rem] border p-4 text-left transition ${
                            isSelected
                              ? 'border-emerald-300 bg-emerald-50/80 shadow-sm dark:border-emerald-400/40 dark:bg-emerald-500/10'
                              : 'border-slate-100 bg-slate-50/80 hover:border-slate-200 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                          }`}
                        >
                          <div className='flex items-center justify-between gap-3'>
                            <div className='flex items-center gap-3'>
                              <div className={`rounded-2xl bg-gradient-to-r ${template.accentClass} p-2.5 text-white shadow-sm`}>
                                <TemplateIcon size={17} />
                              </div>
                              <div>
                                <p className='text-sm font-semibold text-slate-900 dark:text-white'>{template.name}</p>
                                <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>{template.data.role}</p>
                              </div>
                            </div>
                            <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${template.chipClass}`}>
                              {isSelected ? 'Active' : template.badge}
                            </span>
                          </div>
                          <p className='mt-3 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400'>
                            {template.data.summary}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className='rounded-[1.6rem] border border-white/80 bg-white/88 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-slate-900/75 sm:p-5'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>Live resume feel</h3>
                      <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>Preview the first impression before export.</p>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${activeTemplate.chipClass}`}>
                      {activeTemplate.name}
                    </span>
                  </div>

                  <div className='mt-5 overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950'>
                    <div className={`h-2 bg-gradient-to-r ${activeTemplate.accentClass}`} />
                    <div className='p-5'>
                      <div className='flex flex-col gap-2 border-b border-slate-100 pb-4 dark:border-white/10'>
                        <h4 className='text-2xl font-bold leading-tight text-slate-950 dark:text-white'>
                          {personalInfo.name || 'Your Name'}
                        </h4>
                        <p className='text-sm font-semibold text-emerald-700 dark:text-emerald-300'>
                          {personalInfo.role || activeTemplate.data.role}
                        </p>
                        <p className='text-xs leading-5 text-slate-500 dark:text-slate-400'>
                          {[personalInfo.email || 'email@example.com', personalInfo.phone || '+91 00000 00000', personalInfo.location || 'City, Country'].join(' | ')}
                        </p>
                      </div>

                      <div className='mt-4 space-y-4'>
                        <div>
                          <p className='text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Summary</p>
                          <p className='mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300'>
                            {personalInfo.summary || activeTemplate.data.summary}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Experience</p>
                          <div className='mt-2 rounded-xl bg-slate-50 p-3 dark:bg-white/5'>
                            <p className='text-sm font-semibold text-slate-900 dark:text-white'>
                              {experience[0]?.title || activeTemplate.data.experience[0].title}
                            </p>
                            <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                              {experience[0]?.company || activeTemplate.data.experience[0].company} | {experience[0]?.duration || activeTemplate.data.experience[0].duration}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className='text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Skills</p>
                          <div className='mt-2 flex flex-wrap gap-2'>
                            {(skills || activeTemplate.data.skills)
                              .split(',')
                              .map((item) => item.trim())
                              .filter(Boolean)
                              .slice(0, 6)
                              .map((item) => (
                                <span key={item} className='rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300'>
                                  {item}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='rounded-[1.6rem] border border-white/80 bg-white/88 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-slate-900/75 sm:p-5'>
                  <div className='flex items-start gap-3'>
                    <div className='rounded-2xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300'>
                      <BsPatchCheck size={18} />
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>ATS signals to hit</h3>
                      <p className='mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        Keep the resume easy to scan for both recruiters and automated screeners.
                      </p>
                    </div>
                  </div>

                  <div className='mt-5 space-y-3'>
                    {atsSignals.map((item) => (
                      <div
                        key={item}
                        className='flex items-start gap-3 rounded-[1.1rem] border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/5'
                      >
                        <BsCheck2Circle size={16} className='mt-0.5 text-emerald-600' />
                        <span className='text-sm text-slate-600 dark:text-slate-300'>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='rounded-[1.6rem] border border-white/80 bg-white/88 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-slate-900/75 sm:p-5'>
                  <div className='flex items-start gap-3'>
                    <div className='rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'>
                      <BsLightningCharge size={18} />
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>Premium writing hints</h3>
                      <p className='mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        Better phrasing makes the PDF feel stronger without breaking ATS readability.
                      </p>
                    </div>
                  </div>

                  <div className='mt-5 grid gap-3'>
                    <div className='rounded-[1.15rem] border border-slate-100 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5'>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>Summary</p>
                      <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        Start with role, years or level, strongest tools, and one measurable strength.
                      </p>
                    </div>
                    <div className='rounded-[1.15rem] border border-slate-100 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5'>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>Experience</p>
                      <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        Use action verbs plus numbers: improved, built, reduced, shipped, increased, automated.
                      </p>
                    </div>
                    <div className='rounded-[1.15rem] border border-slate-100 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5'>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>Skills</p>
                      <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        Keep tools comma-separated and relevant to the target role for better keyword matching.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4 sm:space-y-5'>
                <motion.div className='rounded-[1.7rem] border border-white/80 bg-white/86 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-900/75 sm:rounded-[2rem] sm:p-6'>
                  <div className='flex items-start gap-3'>
                    <div className='rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'>
                      <BsFileEarmarkText size={18} />
                    </div>
                    <div>
                      <p className='text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300'>Section 1</p>
                      <h2 className='mt-1 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl'>Personal information</h2>
                    </div>
                  </div>

                  <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                    <div className='relative'>
                      <input name='name' placeholder='Full Name' value={personalInfo.name} onChange={handleInfoChange} className='w-full rounded-[1.15rem] border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10' />
                    </div>
                    <div className='relative'>
                      <BsBriefcase className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                      <input name='role' placeholder='Target Role (e.g., Frontend Developer)' value={personalInfo.role} onChange={handleInfoChange} className='w-full rounded-[1.15rem] border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10' />
                    </div>
                    <div className='relative'>
                      <HiOutlineMail className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                      <input name='email' placeholder='Email Address' value={personalInfo.email} onChange={handleInfoChange} className='w-full rounded-[1.15rem] border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10' />
                    </div>
                    <div className='relative'>
                      <BsTelephone className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                      <input name='phone' placeholder='Phone Number' value={personalInfo.phone} onChange={handleInfoChange} className='w-full rounded-[1.15rem] border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10' />
                    </div>
                    <div className='relative'>
                      <BsGeoAlt className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                      <input name='location' placeholder='Location (City, Country)' value={personalInfo.location} onChange={handleInfoChange} className='w-full rounded-[1.15rem] border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10' />
                    </div>
                    <div className='relative sm:col-span-2'>
                      <BsGlobe2 className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500' />
                      <input name='linkedin' placeholder='LinkedIn / Portfolio URL' value={personalInfo.linkedin} onChange={handleInfoChange} className='w-full rounded-[1.15rem] border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10' />
                    </div>
                    <textarea name='summary' placeholder='Professional Summary' rows={4} value={personalInfo.summary} onChange={handleInfoChange} className='resize-none rounded-[1.15rem] border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10 sm:col-span-2' />
                  </div>
                </motion.div>

                <motion.div className='rounded-[1.7rem] border border-white/80 bg-white/86 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-900/75 sm:rounded-[2rem] sm:p-6'>
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300'>Section 2</p>
                      <h2 className='mt-1 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl'>Experience</h2>
                    </div>
                    <button
                      onClick={() => setExperience([...experience, { title: '', company: '', duration: '', description: '' }])}
                      className='inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-cyan-500/15'
                    >
                      <BsPlus size={16} />
                      Add entry
                    </button>
                  </div>

                  <div className='mt-5 space-y-4'>
                    {experience.map((exp, index) => (
                      <div key={index} className='grid gap-4 rounded-[1.3rem] border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5 sm:grid-cols-2'>
                        <input name='title' placeholder='Job Title' value={exp.title} onChange={(e) => handleExpChange(index, e)} className='rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400' />
                        <input name='company' placeholder='Company Name' value={exp.company} onChange={(e) => handleExpChange(index, e)} className='rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400' />
                        <input name='duration' placeholder='Duration (e.g., Jan 2020 - Present)' value={exp.duration} onChange={(e) => handleExpChange(index, e)} className='rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 sm:col-span-2' />
                        <textarea name='description' placeholder='Impact, achievements, tools used, and measurable results' rows={4} value={exp.description} onChange={(e) => handleExpChange(index, e)} className='resize-none rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 sm:col-span-2' />
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className='grid gap-4 md:grid-cols-2 sm:gap-5'>
                  <motion.div className='rounded-[1.7rem] border border-white/80 bg-white/86 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-900/75 sm:rounded-[2rem] sm:p-6'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='text-xs uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300'>Section 3</p>
                        <h2 className='mt-1 text-xl font-semibold text-slate-900 dark:text-white'>Education</h2>
                      </div>
                      <button
                        onClick={() => setEducation([...education, { degree: '', institution: '', duration: '' }])}
                        className='inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/15'
                      >
                        <BsPlus size={16} />
                        Add
                      </button>
                    </div>

                    <div className='mt-5 space-y-4'>
                      {education.map((edu, index) => (
                        <div key={index} className='grid gap-3 rounded-[1.2rem] border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5'>
                          <input name='degree' placeholder='Degree / Major' value={edu.degree} onChange={(e) => handleEduChange(index, e)} className='rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400' />
                          <input name='institution' placeholder='University / Institution' value={edu.institution} onChange={(e) => handleEduChange(index, e)} className='rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400' />
                          <input name='duration' placeholder='Year (e.g., 2018 - 2022)' value={edu.duration} onChange={(e) => handleEduChange(index, e)} className='rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400' />
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div className='rounded-[1.7rem] border border-white/80 bg-white/86 p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-900/75 sm:rounded-[2rem] sm:p-6'>
                    <div className='flex items-start gap-3'>
                      <div className='rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'>
                        <BsTools size={18} />
                      </div>
                      <div>
                        <p className='text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300'>Section 4</p>
                        <h2 className='mt-1 text-xl font-semibold text-slate-900 dark:text-white'>Skills</h2>
                      </div>
                    </div>

                    <textarea
                      placeholder='React, Node.js, Python, Project Management...'
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className='mt-5 h-[210px] w-full resize-none rounded-[1.15rem] border border-slate-200 bg-slate-50/70 p-4 text-sm outline-none transition focus:border-emerald-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10'
                    />

                    <div className='mt-4 rounded-[1.15rem] border border-slate-100 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5'>
                      <div className='flex items-center justify-between gap-3'>
                        <p className='text-sm font-semibold text-slate-900 dark:text-white'>Keyword density</p>
                        <div className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'>
                          <BsBarChart size={13} />
                          {skillsCount} skills
                        </div>
                      </div>
                      <p className='mt-3 flex items-center gap-2 text-xs leading-6 text-slate-500 dark:text-slate-400'>
                        <BsStars className='text-cyan-500' />
                        Separate skills with commas for better ATS parsing and cleaner recruiter scanning.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default ResumeBuilder
