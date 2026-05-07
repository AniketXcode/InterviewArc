import React, { useEffect, useRef, useState } from 'react'
import DailyIframe from '@daily-co/daily-js'
import Vapi from '@vapi-ai/web'
import { HeadTTS } from '@met4citizen/headtts'
import maleVideo from '../assets/videos/male-ai.mp4'
import femaleVideo from '../assets/videos/female-ai.mp4'
import Timer from './Timer'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import axios from 'axios'
import { ServerUrl } from '../App'
import { useDispatch } from 'react-redux'
import {
  BsArrowRight,
  BsBroadcast,
  BsCameraVideo,
  BsChatQuote,
  BsCheck2Circle,
  BsClockHistory,
  BsSoundwave,
  BsStars
} from 'react-icons/bs'
import {
  buildTavusEchoMessage,
  getTavusRuntimeConfig
} from '../utils/tavus'
import {
  createInterviewVapiAssistant,
  getVapiVoiceGender,
  getVapiRuntimeConfig
} from '../utils/vapi'
import {
  getHeadTtsEndpoints,
  getHeadTtsRuntimeConfig,
  getHeadTtsVoiceGender,
  isHeadTtsSupported
} from '../utils/headtts'
import { setUserData } from '../redux/userSlice'

let vapiCleanupPromise = Promise.resolve()
const AUTO_ADVANCE_DELAY_MS = 3000
const FEMALE_BROWSER_VOICE_PREFERENCES = [
  'aria',
  'jenny',
  'sonia',
  'heera',
  'samantha',
  'google uk english female',
  'google us english',
  'female',
  'zira'
]
const MALE_BROWSER_VOICE_PREFERENCES = [
  'guy',
  'davis',
  'david',
  'mark',
  'ravi',
  'google uk english male',
  'male'
]

const getBrowserVoiceIdentity = (voice) =>
  `${voice?.name || ''} ${voice?.voiceURI || ''} ${voice?.lang || ''}`.toLowerCase()

const pickPreferredBrowserVoice = (voices, preferences) => {
  for (const preference of preferences) {
    const naturalVoice = voices.find((voice) => {
      const identity = getBrowserVoiceIdentity(voice)
      return (
        identity.includes(preference) &&
        (
          identity.includes('natural') ||
          identity.includes('neural') ||
          identity.includes('online')
        )
      )
    })

    if (naturalVoice) {
      return naturalVoice
    }

    const directMatch = voices.find((voice) => getBrowserVoiceIdentity(voice).includes(preference))

    if (directMatch) {
      return directMatch
    }
  }

  return null
}

function Step2Interview({ interviewData, onFinish, isEmbedded = false }) {
  const dispatch = useDispatch()
  const safeInterviewData = interviewData || {}
  const { interviewId, questions = [], userName, role, mode } = safeInterviewData
  const [isIntroPhase, setIsIntroPhase] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isAIPlaying, setIsAIPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false)
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(null)
  const [voiceGender, setVoiceGender] = useState(() => getVapiVoiceGender())
  const [subtitle, setSubtitle] = useState('')
  const [micSupported, setMicSupported] = useState(true)
  const [submissionError, setSubmissionError] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const [elevenLabsConfig, setElevenLabsConfig] = useState(null)
  const [isElevenLabsReady, setIsElevenLabsReady] = useState(false)
  const [isVapiSessionReady, setIsVapiSessionReady] = useState(false)
  const [tavusSession, setTavusSession] = useState(null)
  const [isTavusSessionReady, setIsTavusSessionReady] = useState(false)
  const [isHeadTtsReady, setIsHeadTtsReady] = useState(false)
  const [voiceEngineOverride, setVoiceEngineOverride] = useState(null)

  const recognitionRef = useRef(null)
  const videoRef = useRef(null)
  const vapiRef = useRef(null)
  const headTtsRef = useRef(null)
  const elevenLabsAudioRef = useRef(null)
  const elevenLabsAudioUrlRef = useRef(null)
  const previousSpokenTextRef = useRef('')
  const activeHeadTtsSourceRef = useRef(null)
  const tavusCallRef = useRef(null)
  const tavusVideoRef = useRef(null)
  const tavusMediaStreamRef = useRef(null)
  const tavusConversationIdRef = useRef(null)
  const isMicOnRef = useRef(true)
  const isAIPlayingRef = useRef(false)
  const micSupportedRef = useRef(true)
  const isFinishingRef = useRef(false)
  const hasVapiCallStartedRef = useRef(false)
  const shouldResumeMicRef = useRef(true)
  const shouldRestartRecognitionRef = useRef(true)
  const speechResolveRef = useRef(null)
  const speechFallbackTimeoutRef = useRef(null)
  const autoAdvanceTimeoutRef = useRef(null)
  const autoAdvanceIntervalRef = useRef(null)
  const isAdvancingRef = useRef(false)

  const currentQuestion = questions[currentIndex]
  const videoSource = voiceGender === 'male' ? maleVideo : femaleVideo
  const tavusConfig = getTavusRuntimeConfig()
  const vapiConfig = getVapiRuntimeConfig()
  const vapiVoiceGender = getVapiVoiceGender(vapiConfig)
  const headTtsConfig = getHeadTtsRuntimeConfig()
  const headTtsPreloadVoicesKey = headTtsConfig.preloadVoices.join('|')
  const speechRecognitionLanguage =
    import.meta.env.VITE_SPEECH_RECOGNITION_LANGUAGE?.trim() || 'hi-IN'
  const hasVapiConfigured = Boolean(vapiConfig.publicKey)
  const isElevenLabsStatusResolved = tavusConfig.enabled || elevenLabsConfig !== null
  const hasHeadTtsSupport = isHeadTtsSupported()
  const shouldPreferElevenLabs = Boolean(elevenLabsConfig?.enabled)
  const shouldPreferHeadTts = headTtsConfig.enabled && hasHeadTtsSupport
  const nonVapiFallbackVoiceEngine = shouldPreferElevenLabs
    ? 'elevenlabs'
    : shouldPreferHeadTts
      ? 'headtts'
      : 'browser'
  const fallbackVoiceEngine = hasVapiConfigured
    ? 'vapi'
    : nonVapiFallbackVoiceEngine
  const shouldUseTavus = voiceEngineOverride
    ? voiceEngineOverride === 'tavus'
    : tavusConfig.enabled
  const shouldUseElevenLabs = voiceEngineOverride
    ? voiceEngineOverride === 'elevenlabs'
    : !tavusConfig.enabled && !hasVapiConfigured && shouldPreferElevenLabs
  const shouldUseHeadTts = voiceEngineOverride
    ? voiceEngineOverride === 'headtts'
    : !tavusConfig.enabled && !hasVapiConfigured && isElevenLabsStatusResolved && !shouldUseElevenLabs && shouldPreferHeadTts
  const shouldUseVapi = voiceEngineOverride
    ? voiceEngineOverride === 'vapi'
    : !tavusConfig.enabled && hasVapiConfigured
  const isVoiceReady = shouldUseTavus
    ? isTavusSessionReady
    : shouldUseElevenLabs
      ? isElevenLabsReady
    : shouldUseHeadTts
      ? isHeadTtsReady
    : shouldUseVapi
      ? isVapiSessionReady
      : Boolean(selectedVoice)
  const progressPercent = questions.length
    ? ((currentIndex + (feedback ? 1 : 0)) / questions.length) * 100
    : 0
  const answerWordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0
  const safeTimeLeft = Math.max(0, timeLeft)
  const compactTimeLeft = `${String(Math.floor(safeTimeLeft / 60)).padStart(2, '0')}:${String(safeTimeLeft % 60).padStart(2, '0')}`
  const voiceEngineLabel = shouldUseTavus
    ? 'Tavus live avatar'
    : shouldUseElevenLabs
      ? 'ElevenLabs voice'
    : shouldUseHeadTts
      ? 'Free neural voice'
    : shouldUseVapi
      ? 'Vapi voice agent'
      : 'Browser voice'
  const ignoredVapiErrorTypes = new Set([
    'audio-processing-setup-error',
    'video-recording-setup-error'
  ])

  const stringifyErrorPart = (value) => {
    if (!value) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)

    if (Array.isArray(value)) {
      return value.map((item) => stringifyErrorPart(item)).filter(Boolean).join(', ')
    }

    if (typeof value === 'object') {
      return (
        value.message ||
        value.errorMsg ||
        value.details ||
        value.reason ||
        value.type ||
        value.statusText ||
        ''
      )
    }

    return ''
  }

  const fallbackFromTavus = (reason) => {
    setIsTavusSessionReady(false)
    setTavusSession(null)
    setVoiceEngineOverride(fallbackVoiceEngine)

    if (fallbackVoiceEngine === 'vapi') {
      setVoiceError(reason || 'Tavus could not connect. Switched to Vapi voice automatically.')
      return
    }

    setVoiceError(reason || 'Tavus could not connect. Switched to browser voice automatically.')
  }

  const fallbackFromVapi = async (reason) => {
    setIsVapiSessionReady(false)
    hasVapiCallStartedRef.current = false
    setVoiceEngineOverride(nonVapiFallbackVoiceEngine)

    if (nonVapiFallbackVoiceEngine === 'elevenlabs') {
      setVoiceError(reason || 'Vapi could not connect. Switched to ElevenLabs voice automatically.')
    } else if (nonVapiFallbackVoiceEngine === 'headtts') {
      setVoiceError(reason || 'Vapi could not connect. Switched to the free neural voice automatically.')
    } else {
      setVoiceError(reason || 'Vapi could not connect. Switched to browser voice automatically.')
    }

    if (speechFallbackTimeoutRef.current) {
      clearTimeout(speechFallbackTimeoutRef.current)
      speechFallbackTimeoutRef.current = null
    }

    if (speechResolveRef.current) {
      speechResolveRef.current()
      speechResolveRef.current = null
    }

    if (vapiRef.current) {
      await vapiRef.current.stop().catch(() => {})
      vapiRef.current = null
    }
  }

  const stopActiveElevenLabsAudio = () => {
    if (elevenLabsAudioRef.current) {
      elevenLabsAudioRef.current.onended = null
      elevenLabsAudioRef.current.pause()
      elevenLabsAudioRef.current = null
    }

    if (elevenLabsAudioUrlRef.current) {
      URL.revokeObjectURL(elevenLabsAudioUrlRef.current)
      elevenLabsAudioUrlRef.current = null
    }
  }

  const fallbackFromElevenLabs = (reason) => {
    stopActiveElevenLabsAudio()
    setIsElevenLabsReady(false)
    setVoiceEngineOverride(shouldPreferHeadTts ? 'headtts' : 'browser')

    if (speechFallbackTimeoutRef.current) {
      clearTimeout(speechFallbackTimeoutRef.current)
      speechFallbackTimeoutRef.current = null
    }

    setVoiceError(reason || 'ElevenLabs voice could not start. Switched to fallback voice automatically.')
  }

  const stopActiveHeadTtsSource = () => {
    if (!activeHeadTtsSourceRef.current) {
      return
    }

    try {
      activeHeadTtsSourceRef.current.onended = null
      activeHeadTtsSourceRef.current.stop()
    } catch {
      return
    } finally {
      activeHeadTtsSourceRef.current = null
    }
  }

  const teardownHeadTts = () => {
    stopActiveHeadTtsSource()

    if (!headTtsRef.current) {
      return
    }

    headTtsRef.current.clear?.()
    headTtsRef.current.ws?.close?.()
    headTtsRef.current.ww?.terminate?.()
    headTtsRef.current = null
  }

  const fallbackFromHeadTts = (reason) => {
    teardownHeadTts()
    setIsHeadTtsReady(false)
    setVoiceEngineOverride('browser')

    if (speechFallbackTimeoutRef.current) {
      clearTimeout(speechFallbackTimeoutRef.current)
      speechFallbackTimeoutRef.current = null
    }

    setVoiceError(reason || 'Free neural voice could not start. Switched to browser voice automatically.')
  }

  const getVapiErrorMessage = (error) => {
    const message = [
      stringifyErrorPart(error?.error),
      stringifyErrorPart(error?.message),
      stringifyErrorPart(error?.details)
    ].find(Boolean) || 'Unknown Vapi error'
    const normalizedMessage = message.toLowerCase()

    if (normalizedMessage.includes('out of conversational credits')) {
      return 'Voice agent credits are unavailable right now. Switched to browser voice automatically.'
    }

    if (normalizedMessage.includes('insufficient credits')) {
      return 'Voice agent credits are unavailable right now. Switched to browser voice automatically.'
    }

    if (error?.type === 'audio-observer-setup-error') {
      return 'Vapi connected, but assistant speech tracking could not start correctly.'
    }

    if (error?.type === 'daily-call-join-error' || error?.type === 'start-method-error') {
      return `Vapi could not connect: ${message}`
    }

    return `Vapi error: ${message}`
  }

  const syncTavusParticipantMedia = (callObject) => {
    if (!callObject || !tavusVideoRef.current) {
      return
    }

    const participants = Object.values(callObject.participants() || {})
    const remoteParticipant = participants.find((participant) => !participant.local)

    if (!remoteParticipant) {
      return
    }

    const tracks = []
    const videoTrack = remoteParticipant?.tracks?.video?.persistentTrack
    const audioTrack = remoteParticipant?.tracks?.audio?.persistentTrack

    if (videoTrack) {
      tracks.push(videoTrack)
    }

    if (audioTrack) {
      tracks.push(audioTrack)
    }

    if (!tracks.length) {
      return
    }

    const stream = new MediaStream(tracks)
    tavusMediaStreamRef.current = stream
    tavusVideoRef.current.srcObject = stream
    tavusVideoRef.current
      .play()
      .catch(() => {})
  }

  const resetVideoPlayback = () => {
    if (shouldUseTavus) {
      return
    }

    videoRef.current?.pause()

    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  const finalizeSpeechPlayback = () => {
    if (speechFallbackTimeoutRef.current) {
      clearTimeout(speechFallbackTimeoutRef.current)
      speechFallbackTimeoutRef.current = null
    }

    stopActiveElevenLabsAudio()
    stopActiveHeadTtsSource()
    resetVideoPlayback()
    setIsAIPlaying(false)

    if (shouldUseVapi && shouldResumeMicRef.current && isMicOnRef.current) {
      setVapiMute(false)
    }

    if (!shouldUseVapi && shouldResumeMicRef.current && isMicOnRef.current && micSupportedRef.current) {
      setTimeout(() => {
        startMic()
      }, 180)
    }

    const resolvePlayback = speechResolveRef.current
    speechResolveRef.current = null

    setTimeout(() => {
      setSubtitle('')
      resolvePlayback?.()
    }, 250)
  }

  useEffect(() => {
    isMicOnRef.current = isMicOn
  }, [isMicOn])

  useEffect(() => {
    setVoiceEngineOverride(null)
    setVoiceError('')
    setElevenLabsConfig(null)
    setIsElevenLabsReady(false)
    setIsTavusSessionReady(false)
    setIsVapiSessionReady(false)
    setIsHeadTtsReady(false)
    setTavusSession(null)
    previousSpokenTextRef.current = ''
    stopActiveElevenLabsAudio()
    teardownHeadTts()
  }, [interviewId])

  useEffect(() => {
    if (shouldUseVapi) {
      setVoiceGender(vapiVoiceGender)
    }
  }, [shouldUseVapi, vapiVoiceGender])

  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying
  }, [isAIPlaying])

  useEffect(() => {
    micSupportedRef.current = micSupported
  }, [micSupported])

  const setVapiMute = (mute) => {
    if (!shouldUseVapi || !hasVapiCallStartedRef.current || !vapiRef.current) {
      return
    }

    try {
      vapiRef.current.setMuted(mute)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!interviewData || tavusConfig.enabled) {
      return
    }

    let isDisposed = false

    const loadElevenLabsStatus = async () => {
      try {
        const result = await axios.get(ServerUrl + '/api/interview/elevenlabs/status', {
          withCredentials: true
        })

        if (isDisposed) {
          return
        }

        setElevenLabsConfig(result.data)
        setIsElevenLabsReady(Boolean(result.data?.enabled))

        if (result.data?.voiceGender) {
          setVoiceGender(result.data.voiceGender === 'male' ? 'male' : 'female')
        }
      } catch (error) {
        console.log(error)

        if (!isDisposed) {
          setElevenLabsConfig({ enabled: false })
          setIsElevenLabsReady(false)
        }
      }
    }

    loadElevenLabsStatus()

    return () => {
      isDisposed = true
    }
  }, [interviewData, tavusConfig.enabled])

  useEffect(() => {
    if (!interviewData || !shouldUseHeadTts || headTtsRef.current) {
      return
    }

    let isDisposed = false

    const startHeadTts = async () => {
      try {
        const preferredVoice = headTtsConfig.preferredVoice
        const preloadVoices = Array.from(
          new Set([
            preferredVoice,
            ...(headTtsConfig.preloadVoices.length ? headTtsConfig.preloadVoices : ['af_bella', 'am_fenrir'])
          ])
        )

        const headTts = new HeadTTS({
          endpoints: getHeadTtsEndpoints(),
          voices: preloadVoices,
          defaultVoice: preferredVoice,
          defaultSpeed: headTtsConfig.speed
        })

        headTtsRef.current = headTts

        await headTts.connect()
        await headTts.setup({
          voice: preferredVoice,
          language: 'en-us',
          speed: headTtsConfig.speed,
          audioEncoding: 'wav'
        })

        if (isDisposed) {
          teardownHeadTts()
          return
        }

        setVoiceGender(getHeadTtsVoiceGender(preferredVoice))
        setIsHeadTtsReady(true)
        setVoiceError('')
      } catch (error) {
        console.log(error)

        if (!isDisposed) {
          fallbackFromHeadTts('Free neural voice could not load on this device. Switched to browser voice automatically.')
        }
      }
    }

    startHeadTts()

    return () => {
      isDisposed = true
      setIsHeadTtsReady(false)
      teardownHeadTts()
    }
  }, [
    headTtsPreloadVoicesKey,
    headTtsConfig.preferredVoice,
    headTtsConfig.speed,
    interviewData,
    shouldUseHeadTts
  ])

  useEffect(() => {
    if (!interviewData || shouldUseHeadTts || shouldUseVapi || shouldUseTavus) {
      return
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return

      const femaleVoice = pickPreferredBrowserVoice(voices, FEMALE_BROWSER_VOICE_PREFERENCES)

      if (femaleVoice) {
        setSelectedVoice(femaleVoice)
        setVoiceGender('female')
        return
      }

      const maleVoice = pickPreferredBrowserVoice(voices, MALE_BROWSER_VOICE_PREFERENCES)

      if (maleVoice) {
        setSelectedVoice(maleVoice)
        setVoiceGender('male')
        return
      }

      setSelectedVoice(voices[0])
      setVoiceGender(
        MALE_BROWSER_VOICE_PREFERENCES.some((preference) =>
          getBrowserVoiceIdentity(voices[0]).includes(preference)
        )
          ? 'male'
          : 'female'
      )
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [shouldUseHeadTts, shouldUseTavus, shouldUseVapi])

  useEffect(() => {
    if (!interviewData || !shouldUseTavus || tavusCallRef.current) {
      return
    }

    let isDisposed = false
    let callObject = null

    const startTavusSession = async () => {
      try {
        const result = await axios.post(
          ServerUrl + '/api/interview/tavus/session',
          {
            role,
            experience: safeInterviewData.experience,
            mode,
            questionCount: questions.length,
            interviewDuration: safeInterviewData.interviewDuration,
            projects: safeInterviewData.projects || [],
            skills: safeInterviewData.skills || [],
            resumeText: safeInterviewData.resumeText || '',
            selectedRolePack: safeInterviewData.selectedRolePack || '',
            selectedCompanyPack: safeInterviewData.selectedCompanyPack || '',
            userName
          },
          { withCredentials: true }
        )

        if (isDisposed) {
          return
        }

        setTavusSession(result.data)
        tavusConversationIdRef.current = result.data.conversationId

        callObject = DailyIframe.createCallObject()
        tavusCallRef.current = callObject

        const handleParticipantUpdate = () => {
          syncTavusParticipantMedia(callObject)
        }

        const handleAppMessage = (event) => {
          const payload = event?.data
          const eventType = payload?.event_type

          if (eventType === 'conversation.replica_started_speaking') {
            setIsAIPlaying(true)
          }

          if (eventType === 'conversation.replica_stopped_speaking') {
            finalizeSpeechPlayback()
          }

          const utteranceText =
            payload?.properties?.text ||
            payload?.properties?.utterance ||
            payload?.utterance

          if (utteranceText && typeof utteranceText === 'string') {
            setSubtitle(utteranceText)
          }
        }

        callObject.on('joined-meeting', async () => {
          setIsTavusSessionReady(true)
          setVoiceError('')
          await callObject.setLocalAudio(false).catch(() => {})
          await callObject.setLocalVideo(false).catch(() => {})
          syncTavusParticipantMedia(callObject)
        })
        callObject.on('participant-joined', handleParticipantUpdate)
        callObject.on('participant-updated', handleParticipantUpdate)
        callObject.on('track-started', handleParticipantUpdate)
        callObject.on('app-message', handleAppMessage)
        callObject.on('error', (event) => {
          console.log(event)
          fallbackFromTavus(event?.errorMsg || event?.message || 'Tavus live avatar could not connect correctly.')
        })
        callObject.on('left-meeting', () => {
          setIsTavusSessionReady(false)
        })

        await callObject.join({
          url: result.data.conversationUrl,
          token: result.data.meetingToken || undefined
        })
      } catch (error) {
        console.log(error)
        fallbackFromTavus(error?.response?.data?.message || 'Tavus session could not be started.')
      }
    }

    startTavusSession()

    return () => {
      isDisposed = true
      setIsTavusSessionReady(false)

      if (tavusMediaStreamRef.current) {
        tavusMediaStreamRef.current.getTracks().forEach((track) => track.stop())
        tavusMediaStreamRef.current = null
      }

      const activeCall = callObject || tavusCallRef.current

      if (activeCall) {
        activeCall.leave().catch(() => {})
        activeCall.destroy().catch(() => {})
      }

      if (tavusConversationIdRef.current) {
        axios.post(
          ServerUrl + '/api/interview/tavus/end',
          { conversationId: tavusConversationIdRef.current },
          { withCredentials: true }
        ).catch(() => {})
      }

      tavusCallRef.current = null
      tavusConversationIdRef.current = null
    }
  }, [
    interviewData,
    mode,
    questions.length,
    role,
    safeInterviewData.companyPack,
    safeInterviewData.experience,
    safeInterviewData.interviewDuration,
    safeInterviewData.projects,
    safeInterviewData.resumeText,
    safeInterviewData.selectedCompanyPack,
    safeInterviewData.selectedRolePack,
    safeInterviewData.skills,
    shouldUseTavus,
    userName
  ])

  useEffect(() => {
    if (!interviewData || !shouldUseVapi || vapiRef.current) {
      return
    }

    let isDisposed = false
    let currentVapi = null

    const startVoiceSession = async () => {
      await vapiCleanupPromise

      if (isDisposed) {
        return
      }

      const vapi = new Vapi(vapiConfig.publicKey)
      currentVapi = vapi
      vapiRef.current = vapi

      const handleSpeechStart = () => {
        setIsAIPlaying(true)
        videoRef.current?.play()
      }

      const handleSpeechEnd = () => {
        finalizeSpeechPlayback()
      }

      const handleCallStart = () => {
        hasVapiCallStartedRef.current = true
        setVoiceError('')
        setMicSupported(true)
        setIsVapiSessionReady(true)
        setVapiMute(!isMicOnRef.current)
      }

      const handleCallEnd = () => {
        hasVapiCallStartedRef.current = false
        setIsVapiSessionReady(false)
        resetVideoPlayback()
        setIsAIPlaying(false)

        if (!isFinishingRef.current) {
          fallbackFromVapi('The Vapi voice session ended. Switched to browser voice automatically.')
        }
      }

      const handleMessage = (message) => {
        const isTranscriptMessage =
          message?.type === 'transcript' ||
          message?.type === "transcript[transcriptType='final']"

        if (!isTranscriptMessage) {
          return
        }

        const role = message?.role || message?.transcript?.role || message?.conversation?.role
        const transcriptType =
          message?.transcriptType ||
          message?.transcript?.transcriptType ||
          message?.transcript?.type
        const transcriptText =
          (typeof message?.transcript === 'string' && message.transcript) ||
          message?.transcript?.text ||
          message?.transcript?.transcript ||
          message?.text ||
          ''

        if (role === 'assistant' && transcriptText) {
          setSubtitle(transcriptText)
        }

        if (role === 'user' && transcriptType === 'final' && transcriptText) {
          setAnswer((prev) => `${prev} ${transcriptText}`.trim())
        }
      }

      const handleError = async (error) => {
        console.log(error)

        if (ignoredVapiErrorTypes.has(error?.type)) {
          return
        }

        const errorMessage = getVapiErrorMessage(error)
        setVoiceError(errorMessage)

        if (!hasVapiCallStartedRef.current) {
          await fallbackFromVapi(errorMessage)
        }

        if (speechResolveRef.current) {
          speechResolveRef.current()
          speechResolveRef.current = null
        }

        if (speechFallbackTimeoutRef.current) {
          clearTimeout(speechFallbackTimeoutRef.current)
          speechFallbackTimeoutRef.current = null
        }

        if (autoAdvanceTimeoutRef.current) {
          clearTimeout(autoAdvanceTimeoutRef.current)
          autoAdvanceTimeoutRef.current = null
        }
      }

      vapi.on('speech-start', handleSpeechStart)
      vapi.on('speech-end', handleSpeechEnd)
      vapi.on('call-start', handleCallStart)
      vapi.on('call-end', handleCallEnd)
      vapi.on('message', handleMessage)
      vapi.on('error', handleError)

      try {
        if (vapiConfig.useExistingAssistant && vapiConfig.assistantId) {
          await vapi.start(vapiConfig.assistantId)
          return
        }

        await vapi.start(createInterviewVapiAssistant())
      } catch (error) {
        handleError(error)
      }
    }

    startVoiceSession()

    return () => {
      isDisposed = true

      if (speechResolveRef.current) {
        speechResolveRef.current()
        speechResolveRef.current = null
      }

      if (speechFallbackTimeoutRef.current) {
        clearTimeout(speechFallbackTimeoutRef.current)
        speechFallbackTimeoutRef.current = null
      }

      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current)
        autoAdvanceTimeoutRef.current = null
      }

      setIsVapiSessionReady(false)
      hasVapiCallStartedRef.current = false
      const vapiInstance = currentVapi || vapiRef.current

      if (vapiInstance) {
        vapiCleanupPromise = vapiInstance.stop().catch(() => {})
      }

      vapiRef.current = null
    }
  }, [shouldUseVapi, vapiConfig.assistantId, vapiConfig.publicKey, vapiConfig.useExistingAssistant])

  const stopMic = () => {
    if (shouldUseVapi) {
      setVapiMute(true)
      return
    }

    shouldRestartRecognitionRef.current = false

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const startMic = () => {
    if (shouldUseVapi) {
      if (!isVapiSessionReady || !isMicOnRef.current || isAIPlaying) {
        return
      }

      setVapiMute(false)
      return
    }

    if (!micSupported || !isMicOn || isAIPlaying) {
      return
    }

    shouldRestartRecognitionRef.current = true

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch {
        return
      }
    }
  }

  const speakText = (text, { resumeMic = true } = {}) => {
    return new Promise((resolve) => {
      if (shouldUseTavus) {
        if (!tavusCallRef.current || !isTavusSessionReady) {
          resolve()
          return
        }

        shouldResumeMicRef.current = resumeMic
        stopMic()
        setSubtitle(text)
        setIsAIPlaying(true)
        speechResolveRef.current = resolve
        speechFallbackTimeoutRef.current = setTimeout(() => {
          finalizeSpeechPlayback()
        }, Math.max(4500, text.length * 95))

        tavusCallRef.current.sendAppMessage(buildTavusEchoMessage(text), '*')
        return
      }

      if (shouldUseElevenLabs) {
        if (!isElevenLabsReady) {
          resolve()
          return
        }

        shouldResumeMicRef.current = resumeMic
        stopMic()
        stopActiveElevenLabsAudio()
        setSubtitle(text)
        setIsAIPlaying(true)
        videoRef.current?.play().catch(() => {})
        speechResolveRef.current = resolve
        speechFallbackTimeoutRef.current = setTimeout(() => {
          finalizeSpeechPlayback()
        }, Math.max(5000, text.length * 105))

        axios.post(
          ServerUrl + '/api/interview/elevenlabs/speech',
          {
            text,
            previousText: previousSpokenTextRef.current
          },
          {
            withCredentials: true,
            responseType: 'blob'
          }
        )
          .then(async (result) => {
            const audioBlob = result?.data

            if (!audioBlob || !(audioBlob instanceof Blob) || !audioBlob.size) {
              throw new Error('Empty ElevenLabs audio response.')
            }

            const audioUrl = URL.createObjectURL(audioBlob)
            const audio = new Audio(audioUrl)

            elevenLabsAudioRef.current = audio
            elevenLabsAudioUrlRef.current = audioUrl
            previousSpokenTextRef.current = text

            audio.onended = () => {
              stopActiveElevenLabsAudio()
              finalizeSpeechPlayback()
            }

            await audio.play()
          })
          .catch((error) => {
            console.log(error)
            fallbackFromElevenLabs(
              error?.response?.data?.message || 'ElevenLabs voice could not synthesize speech. Switched to fallback voice automatically.'
            )

            if (speechResolveRef.current) {
              speechResolveRef.current()
              speechResolveRef.current = null
            }
          })

        return
      }

      if (shouldUseVapi) {
        if (!vapiRef.current || !isVapiSessionReady) {
          resolve()
          return
        }

        shouldResumeMicRef.current = resumeMic
        setSubtitle(text)
        stopMic()
        speechResolveRef.current = resolve
        speechFallbackTimeoutRef.current = setTimeout(() => {
          finalizeSpeechPlayback()
        }, Math.max(4000, text.length * 90))
        vapiRef.current.say(text)
        return
      }

      if (shouldUseHeadTts) {
        if (!headTtsRef.current || !isHeadTtsReady) {
          resolve()
          return
        }

        shouldResumeMicRef.current = resumeMic
        stopMic()
        stopActiveHeadTtsSource()
        setSubtitle(text)
        setIsAIPlaying(true)
        speechResolveRef.current = resolve
        speechFallbackTimeoutRef.current = setTimeout(() => {
          finalizeSpeechPlayback()
        }, Math.max(5000, text.length * 110))

        const humanText = text
          .replace(/:/g, ': ... ')
          .replace(/,/g, ', ... ')
          .replace(/\./g, '. ... ')

        headTtsRef.current.settings.audioCtx.resume?.().catch(() => {})

        headTtsRef.current
          .synthesize({ input: humanText })
          .then(async (messages) => {
            for (const message of messages || []) {
              const audioBuffer = message?.data?.audio

              if (!audioBuffer || !headTtsRef.current) {
                continue
              }

              await new Promise((playResolve) => {
                const source = headTtsRef.current.settings.audioCtx.createBufferSource()
                activeHeadTtsSourceRef.current = source
                source.buffer = audioBuffer
                source.connect(headTtsRef.current.settings.audioCtx.destination)
                source.onended = () => {
                  if (activeHeadTtsSourceRef.current === source) {
                    activeHeadTtsSourceRef.current = null
                  }
                  playResolve()
                }
                source.start(0)
              })
            }

            finalizeSpeechPlayback()
          })
          .catch((error) => {
            console.log(error)
            fallbackFromHeadTts('Free neural voice could not synthesize speech. Switched to browser voice automatically.')

            if (speechResolveRef.current) {
              speechResolveRef.current()
              speechResolveRef.current = null
            }
          })

        return
      }

      if (!window.speechSynthesis || !selectedVoice) {
        resolve()
        return
      }

      window.speechSynthesis.cancel()

      const humanText = text
        .replace(/,/g, ', ... ')
        .replace(/\./g, '. ... ')

      const utterance = new SpeechSynthesisUtterance(humanText)

      utterance.voice = selectedVoice
      utterance.rate = voiceGender === 'female' ? 0.9 : 0.94
      utterance.pitch = voiceGender === 'female' ? 0.92 : 0.98
      utterance.volume = 1

      utterance.onstart = () => {
        setIsAIPlaying(true)
        stopMic()
        videoRef.current?.play()
      }

      utterance.onend = () => {
        if (resumeMic && isMicOn) {
          startMic()
        }

        finalizeSpeechPlayback()
        resolve()
      }

      setSubtitle(text)
      window.speechSynthesis.speak(utterance)
    })
  }

  useEffect(() => {
    if (!interviewData || !isVoiceReady) {
      return
    }

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it is great to meet you today. I hope you are feeling confident and ready.`
        )

        await speakText(
          'I will ask you a few questions. Answer naturally, and take your time. Let us begin.'
        )

        setIsIntroPhase(false)
        return
      }

      if (!currentQuestion) {
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 700))

      if (currentIndex === questions.length - 1) {
        await speakText('Alright, this one may be a bit more challenging.')
      }

      await speakText(currentQuestion.question)
    }

    runIntro()
  }, [isVoiceReady, isIntroPhase, currentIndex, currentQuestion, questions.length, userName])

  useEffect(() => {
    if (isIntroPhase || !currentQuestion || feedback) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isIntroPhase, currentQuestion, feedback, currentIndex])

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60)
    }
  }, [isIntroPhase, currentQuestion, currentIndex])

  useEffect(() => {
    if (!interviewData) {
      return
    }

    if (shouldUseVapi) {
      setMicSupported(true)
      micSupportedRef.current = true
      return
    }

    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionApi) {
      setMicSupported(false)
      micSupportedRef.current = false
      shouldRestartRecognitionRef.current = false
      setIsMicOn(false)
      setVoiceError('Voice-to-text is not supported in this browser. Please type your answer or use Chrome/Edge.')
      return
    }

    setMicSupported(true)
    micSupportedRef.current = true

    const recognition = new SpeechRecognitionApi()
    recognition.lang = speechRecognitionLanguage
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      setAnswer((prev) => `${prev} ${transcript}`.trim())
    }

    recognition.onerror = (event) => {
      if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
        shouldRestartRecognitionRef.current = false
        setMicSupported(false)
        micSupportedRef.current = false
        setIsMicOn(false)
        setVoiceError('Microphone permission was blocked. Please allow mic access and restart the interview.')
      }
    }

    recognition.onend = () => {
      if (
        shouldRestartRecognitionRef.current &&
        isMicOnRef.current &&
        !isAIPlayingRef.current &&
        micSupportedRef.current
      ) {
        try {
          recognition.start()
        } catch {
          return
        }
      }
    }

    recognitionRef.current = recognition

    return () => {
      shouldRestartRecognitionRef.current = false
      recognition.stop()
      recognition.abort()
      recognitionRef.current = null
    }
  }, [shouldUseVapi])

  const toggleMic = () => {
    if (!micSupported) {
      return
    }

    const nextMicState = !isMicOn
    setIsMicOn(nextMicState)

    if (shouldUseVapi) {
      isMicOnRef.current = nextMicState
      setVapiMute(!nextMicState || isAIPlaying)
      return
    }

    if (!nextMicState) {
      stopMic()
    } else {
      startMic()
    }
  }

  const clearAutoAdvanceTimers = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current)
      autoAdvanceTimeoutRef.current = null
    }

    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current)
      autoAdvanceIntervalRef.current = null
    }

    setIsAutoAdvancing(false)
    setAutoAdvanceCountdown(null)
  }

  const scheduleAutoAdvance = () => {
    clearAutoAdvanceTimers()
    setIsAutoAdvancing(true)
    setAutoAdvanceCountdown(Math.ceil(AUTO_ADVANCE_DELAY_MS / 1000))

    const startedAt = Date.now()

    autoAdvanceIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, AUTO_ADVANCE_DELAY_MS - elapsed)
      setAutoAdvanceCountdown(Math.max(1, Math.ceil(remaining / 1000)))
    }, 250)

    autoAdvanceTimeoutRef.current = setTimeout(() => {
      clearAutoAdvanceTimers()
      handleNext()
    }, AUTO_ADVANCE_DELAY_MS)
  }

  const submitAnswer = async ({ autoAdvance = true } = {}) => {
    if (isSubmitting || !currentQuestion) return

    stopMic()
    setIsSubmitting(true)
    clearAutoAdvanceTimers()
    setSubmissionError('')

    try {
      const result = await axios.post(
        ServerUrl + '/api/interview/submit-answer',
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft
        },
        { withCredentials: true }
      )

      setFeedback(result.data.feedback)
      await Promise.race([
        speakText(result.data.feedback, { resumeMic: false }),
        new Promise((resolve) => setTimeout(resolve, 7000))
      ])

      if (autoAdvance) {
        scheduleAutoAdvance()
      }
    } catch (error) {
      console.log(error)
      clearAutoAdvanceTimers()
      setSubmissionError('Your answer could not be submitted. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const finishInterview = async () => {
    stopMic()
    stopActiveElevenLabsAudio()
    setIsMicOn(false)
    setSubmissionError('')
    setIsFinishing(true)
    isFinishingRef.current = true

    try {
      const result = await axios.post(
        ServerUrl + '/api/interview/finish',
        { interviewId },
        { withCredentials: true }
      )

      if (shouldUseTavus && tavusConversationIdRef.current) {
        await axios.post(
          ServerUrl + '/api/interview/tavus/end',
          { conversationId: tavusConversationIdRef.current },
          { withCredentials: true }
        ).catch(() => {})
      }

      if (shouldUseVapi) {
        await vapiRef.current?.stop().catch(() => {})
      }

      if (result.data.updatedUser) {
        dispatch(setUserData(result.data.updatedUser))
      }

      onFinish(result.data)
    } catch (error) {
      console.log(error)
      setSubmissionError('The interview could not be finalized. Please try again.')
      setIsFinishing(false)
      isFinishingRef.current = false
      isAdvancingRef.current = false
    }
  }

  const handleNext = async () => {
    if (isAdvancingRef.current) {
      return
    }

    isAdvancingRef.current = true
    clearAutoAdvanceTimers()
    setAnswer('')
    setFeedback('')
    setSubmissionError('')

    if (currentIndex + 1 >= questions.length) {
      finishInterview()
      return
    }

    await speakText('Alright, let us move to the next question.', {
      resumeMic: false
    })

    setCurrentIndex((prev) => prev + 1)
  }

  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer({ autoAdvance: true })
    }
  }, [timeLeft, isIntroPhase, currentQuestion, isSubmitting, feedback])

  useEffect(() => {
    isAdvancingRef.current = false
    clearAutoAdvanceTimers()
  }, [currentIndex])

  useEffect(() => {
    return () => {
      isFinishingRef.current = true
      clearAutoAdvanceTimers()

      if (recognitionRef.current) {
        shouldRestartRecognitionRef.current = false
        recognitionRef.current.stop()
        recognitionRef.current.abort()
      }

      if (!shouldUseVapi) {
        window.speechSynthesis.cancel()
      }

      stopActiveElevenLabsAudio()
      teardownHeadTts()
    }
  }, [shouldUseVapi])

  const wrapperClass = isEmbedded ? 'w-full' : 'min-h-screen px-3 py-6 sm:px-4 sm:py-8'

  if (!interviewData) {
    return null
  }

  return (
    <div className={wrapperClass}>
      <div className='grid gap-3 lg:gap-6 xl:grid-cols-[0.9fr_1.1fr]'>
        <div className='space-y-3 sm:space-y-5'>
          <div className='overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-white/10 dark:bg-slate-950 dark:text-white'>
            <div className='border-b border-slate-200 bg-white px-3.5 py-3.5 dark:border-white/10 dark:bg-slate-950 sm:px-6 sm:py-5'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <p className='text-[11px] uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300 sm:text-xs'>AI interviewer</p>
                  <h2 className='mt-1.5 text-lg font-semibold tracking-tight sm:mt-2 sm:text-2xl'>Live interview in progress</h2>
                </div>

                <div className='inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 sm:px-3 sm:text-xs'>
                  <span className={`h-2 w-2 rounded-full ${isAIPlaying ? 'bg-teal-500' : 'bg-slate-400'}`} />
                  {isAIPlaying ? 'AI speaking' : isMicOn ? 'Listening mode' : 'Mic paused'}
                </div>
              </div>
            </div>

            <div className='p-3.5 sm:p-6'>
              <div className='overflow-hidden rounded-lg border border-slate-200 bg-black dark:border-white/10'>
                {shouldUseTavus ? (
                  <div className='relative aspect-video w-full bg-slate-950'>
                    <video
                      ref={tavusVideoRef}
                      autoPlay
                      playsInline
                      className='h-full w-full object-cover'
                    />

                    {!isTavusSessionReady && (
                      <div className='absolute inset-0 flex items-center justify-center bg-slate-950/85 px-6 text-center'>
                        <div>
                          <p className='text-xs uppercase tracking-[0.22em] text-emerald-300'>Tavus live avatar</p>
                          <p className='mt-3 text-sm leading-7 text-slate-200'>
                            Connecting your real-time interviewer stream...
                          </p>
                          {tavusSession?.status && (
                            <p className='mt-2 text-xs uppercase tracking-[0.14em] text-slate-400'>
                              Session status: {tavusSession.status}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <video
                    src={videoSource}
                    key={videoSource}
                    ref={videoRef}
                    muted
                    playsInline
                    preload='auto'
                    className='aspect-video w-full object-cover'
                  />
                )}
              </div>

              <div className='mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-900 sm:mt-5 sm:p-4'>
                <div className='-mx-0.5 flex snap-x items-center gap-2 overflow-x-auto px-0.5 pb-1 text-[10px] uppercase tracking-[0.14em] text-slate-500 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:text-[11px]'>
                  <span className='inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 dark:border-white/10 dark:bg-slate-950 sm:px-3'>
                    <BsCameraVideo size={12} />
                    {voiceEngineLabel}
                  </span>
                  <span className='inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 dark:border-white/10 dark:bg-slate-950 sm:px-3'>
                    <BsBroadcast size={12} />
                    {role || 'Interview session'}
                  </span>
                  <span className='inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 dark:border-white/10 dark:bg-slate-950 sm:px-3'>
                    <BsSoundwave size={12} />
                    {mode || 'Guided round'}
                  </span>
                </div>

                <div className='mt-2.5 rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950 sm:mt-4 sm:p-4'>
                  <div className='flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300 sm:text-[11px]'>
                    <BsChatQuote size={12} />
                    Live caption
                  </div>
                  <p className='mt-2 text-xs leading-5 text-slate-700 dark:text-slate-300 sm:mt-3 sm:text-sm sm:leading-7'>
                    {subtitle ||
                      (shouldUseVapi && !isVapiSessionReady
                        ? 'Connecting the Vapi voice agent. The first question will start as soon as it is ready.'
                        : shouldUseElevenLabs && !isElevenLabsReady
                          ? 'Connecting the ElevenLabs voice. The first question will start as soon as it is ready.'
                          : shouldUseHeadTts && !isHeadTtsReady
                            ? 'Loading the free neural voice model. The first question will start as soon as it is ready.'
                            : 'The AI interviewer will speak here. Once the question is asked, answer naturally by voice, typing, or both.')}
                  </p>
                </div>

                <div className='mt-3 grid grid-cols-3 gap-2 sm:hidden'>
                  <div className='rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950'>
                    <p className='text-[10px] uppercase tracking-[0.12em] text-slate-500'>Question</p>
                    <p className='mt-1 text-base font-semibold text-slate-950 dark:text-white'>{Math.min(currentIndex + 1, questions.length)}/{questions.length}</p>
                  </div>
                  <div className='rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950'>
                    <p className='text-[10px] uppercase tracking-[0.12em] text-slate-500'>Time</p>
                    <p className='mt-1 text-base font-semibold text-teal-700 dark:text-teal-300'>{compactTimeLeft}</p>
                  </div>
                  <div className='rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950'>
                    <p className='text-[10px] uppercase tracking-[0.12em] text-slate-500'>Words</p>
                    <p className='mt-1 text-base font-semibold text-slate-950 dark:text-white'>{answerWordCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-3 sm:gap-4'>
            <div className='rounded-[1.45rem] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur sm:rounded-[1.8rem] sm:p-5'>
              <p className='text-sm text-slate-500'>Current question</p>
              <p className='mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl'>
                {Math.min(currentIndex + 1, questions.length)}
              </p>
            </div>

            <div className='rounded-[1.45rem] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur sm:rounded-[1.8rem] sm:p-5'>
              <p className='text-sm text-slate-500'>Total questions</p>
              <p className='mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl'>{questions.length}</p>
            </div>

            <div className='col-span-2 rounded-[1.45rem] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur sm:col-span-1 sm:rounded-[1.8rem] sm:p-5'>
              <p className='text-sm text-slate-500'>Time left</p>
              <div className='mt-3 flex justify-center'>
                <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
              </div>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-5 md:p-7'>
          <div className='flex flex-col gap-3 border-b border-slate-100 pb-4 sm:gap-4 sm:pb-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-teal-700 sm:text-sm'>
                  {isIntroPhase ? 'Introduction' : `Question ${currentIndex + 1}`}
                </p>
                <h2 className='mt-1.5 text-xl font-semibold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl'>
                  {isIntroPhase ? `Welcome, ${userName || 'candidate'}` : 'Respond with clarity and structure'}
                </h2>
              </div>

              {!isIntroPhase && currentQuestion && (
                <div className='flex flex-wrap gap-2'>
                  <div className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 shadow-sm'>
                    {currentQuestion.difficulty || 'question'}
                  </div>
                  <div className='rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-sky-700 shadow-sm'>
                    {currentQuestion.timeLimit || 60}s
                  </div>
                </div>
              )}
            </div>

            <div>
                <div className='h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'>
                  <div
                  className='h-full rounded-full bg-teal-600 transition-all duration-500'
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {isFinishing ? (
            <div className='mt-8 animate-pulse'>
              <div className='mb-6 flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100/50 text-cyan-500'>
                  <BsStars size={24} />
                </div>
                <div>
                  <div className='mb-2 h-5 w-48 rounded-lg bg-slate-200' />
                  <div className='h-4 w-64 rounded-lg bg-slate-100' />
                </div>
              </div>
              <div className='space-y-4'>
                <div className='h-4 w-full rounded-lg bg-slate-100' />
                <div className='h-4 w-5/6 rounded-lg bg-slate-100' />
                <div className='h-4 w-4/6 rounded-lg bg-slate-100' />
              </div>
              <div className='mt-8 h-[200px] w-full rounded-3xl border border-slate-100 bg-slate-50' />
            </div>
          ) : (
            <>
              <div className='mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-white/10 dark:bg-slate-950 sm:mt-6 sm:p-5'>
                {isIntroPhase ? (
                  <div>
                    <div className='inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:bg-slate-900'>
                      <BsStars size={13} />
                      Getting started
                    </div>
                    <p className='mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-8'>
                      The AI interviewer is introducing the session. Listen first, then your first question will appear here and the timer will begin.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className='text-xs uppercase tracking-[0.14em] text-slate-400'>Prompt</p>
                    <p className='mt-3 text-xl font-semibold leading-8 tracking-tight text-slate-900 sm:text-[1.6rem] sm:leading-10'>
                      {currentQuestion?.question}
                    </p>
                  </div>
                )}
              </div>

              <div className='mt-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950 sm:mt-6 sm:p-4'>
                <div className='mb-3 flex flex-col gap-2 px-1 sm:mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
                  <div>
                    <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>Response area</p>
                    <p className='mt-1 text-xs leading-5 text-slate-500 sm:text-sm'>Type, speak, or combine both for a more natural answer.</p>
                  </div>
                  <div className='inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-slate-500'>
                    <BsSoundwave size={12} />
                    {isAIPlaying ? 'Avatar active' : 'Your turn'}
                  </div>
                </div>

                <textarea
                  placeholder={
                    isIntroPhase
                      ? 'The introduction is playing. You can start typing once the first question appears.'
                      : 'Type your answer here while you speak, or use this area as your full response space.'
                  }
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                  disabled={isIntroPhase}
                  className='min-h-[160px] w-full resize-none rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-800 outline-none transition focus:border-teal-300 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-slate-900 dark:text-white sm:min-h-[260px] sm:p-5 sm:text-base'
                />

                <div className='mt-3 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
                  <div className='flex flex-wrap gap-2'>
                    <span className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-slate-500'>
                      {answerWordCount} words
                    </span>
                    <span className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-slate-500'>
                      {micSupported
                        ? `${shouldUseVapi ? 'Vapi mic' : 'Mic'} ${isMicOn ? 'enabled' : 'muted'}`
                        : 'Voice input unavailable'}
                    </span>
                  </div>

                  <div className='inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-400 sm:text-xs'>
                    <BsClockHistory size={13} />
                    Answer before the timer ends
                  </div>
                </div>
              </div>

              {submissionError && (
                <div className='mt-5 rounded-[1.25rem] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
                  {submissionError}
                </div>
              )}

              {voiceError && (
                <div className='mt-5 rounded-[1.25rem] border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700'>
                  {voiceError}
                </div>
              )}

              {!feedback ? (
                <div className='mt-6 flex flex-col gap-4 sm:flex-row'>
                  <motion.button
                    onClick={toggleMic}
                    disabled={!micSupported || isIntroPhase}
                    whileTap={{ scale: !micSupported || isIntroPhase ? 1 : 0.96 }}
                    className='inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 sm:h-14 sm:w-auto'
                  >
                    {isMicOn ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}
                    {isMicOn ? 'Mute mic' : 'Enable mic'}
                  </motion.button>

                  <motion.button
                    onClick={submitAnswer}
                    disabled={isSubmitting || isIntroPhase}
                    whileTap={{ scale: isSubmitting || isIntroPhase ? 1 : 0.98 }}
                    className='w-full flex-1 rounded-md bg-teal-600 px-6 py-4 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300'
                  >
                    {isSubmitting ? 'Submitting answer...' : 'Submit answer'}
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-6 rounded-[1.35rem] border border-emerald-100 bg-[linear-gradient(180deg,rgba(236,253,245,0.9),rgba(220,252,231,0.72))] p-4 shadow-[0_20px_50px_-42px_rgba(34,197,94,0.45)] sm:rounded-[1.85rem] sm:p-5'
                >
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-full bg-white p-2 text-emerald-600 shadow-sm'>
                      <BsCheck2Circle size={16} />
                    </div>
                    <div>
                      <p className='text-sm font-medium uppercase tracking-[0.14em] text-emerald-700'>AI feedback</p>
                      <p className='mt-3 text-sm leading-7 text-slate-700'>{feedback}</p>
                    </div>
                  </div>

                  {isAutoAdvancing && (
                    <div className='mt-4 rounded-2xl border border-emerald-200/80 bg-white/70 px-4 py-3 text-sm text-emerald-800'>
                      {currentIndex + 1 >= questions.length
                        ? `Finishing this interview in ${autoAdvanceCountdown || 1}s.`
                        : `Next question starts in ${autoAdvanceCountdown || 1}s.`}
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 px-5 py-3.5 text-sm font-medium text-white transition hover:from-slate-900 hover:to-teal-900'
                  >
                    {isAutoAdvancing
                      ? currentIndex + 1 >= questions.length
                        ? 'Finish now'
                        : 'Continue now'
                      : currentIndex + 1 >= questions.length
                        ? 'Finish interview and view report'
                        : 'Move to next question'}
                    <BsArrowRight size={15} />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2Interview
