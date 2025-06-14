'use client'

import { useState, useRef, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
  phase?: 'situatie' | 'taak' | 'actie' | 'resultaat' | 'reflectie' | 'complete'
}

interface STARRData {
  situatie: string
  taak: string
  actie: string
  resultaat: string
  reflectie: string
}

const STARR_PHASES = [
  {
    key: 'situatie',
    title: 'Situatie',
    icon: '📍',
    color: 'red',
    description: 'Beschrijf de situatie waarin je je bevond'
  },
  {
    key: 'taak',
    title: 'Taak',
    icon: '🎯',
    color: 'orange',
    description: 'Wat was je doel of opdracht?'
  },
  {
    key: 'actie',
    title: 'Actie',
    icon: '⚡',
    color: 'yellow',
    description: 'Welke acties heb je ondernomen?'
  },
  {
    key: 'resultaat',
    title: 'Resultaat',
    icon: '📊',
    color: 'green',
    description: 'Wat was het resultaat van je acties?'
  },
  {
    key: 'reflectie',
    title: 'Reflectie',
    icon: '🔄',
    color: 'blue',
    description: 'Wat heb je geleerd en wat ga je anders doen?'
  }
] as const

type PhaseKey = typeof STARR_PHASES[number]['key']

export default function STARRChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [currentPhase, setCurrentPhase] = useState<PhaseKey>('situatie')
  const [isComplete, setIsComplete] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [starrData, setSTARRData] = useState<STARRData>({
    situatie: '',
    taak: '',
    actie: '',
    resultaat: '',
    reflectie: ''
  })
  const [finalReport, setFinalReport] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateId(),
      type: 'bot',
      content: `Hallo! 👋 Ik ga je helpen met het maken van een STARR reflectie. 

STARR staat voor **Situatie**, **Taak**, **Actie**, **Resultaat** en **Reflectie**. Door deze stappen te doorlopen, kun je systematisch reflecteren op je ervaringen en daarvan leren.

Laten we beginnen met de **Situatie** 📍

**Beschrijf de situatie waarin je je bevond:**
- Wat was de context?
- Wie waren er betrokken?
- Wanneer en waar vond het plaats?
- Wat waren de omstandigheden?

Neem de tijd om de situatie zo volledig mogelijk te beschrijven.`,
      timestamp: new Date(),
      phase: 'situatie'
    }
    setMessages([welcomeMessage])
  }, [])

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const getPhaseQuestions = (phase: PhaseKey): string => {
    const questions = {
      situatie: `Geweldig! Nu gaan we verder naar de **Taak** 🎯

**Wat was je taak of doel in deze situatie?**
- Wat werd er van je verwacht?
- Welke doelen had je jezelf gesteld?
- Wat was je rol of verantwoordelijkheid?
- Waren er specifieke resultaten die je moest behalen?`,

      taak: `Uitstekend! Laten we nu kijken naar de **Actie** ⚡

**Welke concrete acties heb je ondernomen?**
- Wat heb je precies gedaan?
- Welke stappen heb je gezet?
- Hoe heb je je aangepakt?
- Welke keuzes heb je gemaakt en waarom?
- Heb je hulp gezocht of samengewerkt?`,

      actie: `Perfect! Nu naar het **Resultaat** 📊

**Wat was het resultaat van je acties?**
- Wat was de uitkomst?
- Heb je je doelen behaald?
- Hoe reageerden anderen?
- Wat ging goed en wat ging minder goed?
- Waren er onverwachte gevolgen?`,

      resultaat: `Mooi! Nu het belangrijkste onderdeel: de **Reflectie** 🔄

**Reflecteer op de hele ervaring:**
- Wat heb je geleerd van deze situatie?
- Wat zou je anders doen als je opnieuw in een vergelijkbare situatie komt?
- Welke sterke punten heb je ontdekt?
- Waar kun je nog aan werken?
- Hoe ga je deze lessen toepassen in de toekomst?`,

      reflectie: `Fantastisch! Je hebt alle onderdelen van de STARR reflectie doorlopen. 🎉

Ik ga nu een complete, professionele STARR reflectie voor je samenstellen op basis van al je antwoorden. Dit wordt een gestructureerd document dat je kunt gebruiken voor je portfolio, evaluaties of verdere ontwikkeling.`
    }
    
    return questions[phase]
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date(),
      phase: currentPhase
    }

    setMessages(prev => [...prev, userMessage])

    // Store the answer in STARR data
    setSTARRData(prev => ({
      ...prev,
      [currentPhase]: currentInput.trim()
    }))

    // Clear input
    setCurrentInput('')

    // Determine next phase
    const currentPhaseIndex = STARR_PHASES.findIndex(p => p.key === currentPhase)
    const isLastPhase = currentPhaseIndex === STARR_PHASES.length - 1

    if (isLastPhase) {
      // Complete the STARR process
      setIsComplete(true)
      
      const completionMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: getPhaseQuestions('reflectie'),
        timestamp: new Date(),
        phase: 'complete'
      }
      
      setTimeout(() => {
        setMessages(prev => [...prev, completionMessage])
      }, 1000)
    } else {
      // Move to next phase
      const nextPhase = STARR_PHASES[currentPhaseIndex + 1].key
      setCurrentPhase(nextPhase)
      
      const botResponse: Message = {
        id: generateId(),
        type: 'bot',
        content: getPhaseQuestions(currentPhase),
        timestamp: new Date(),
        phase: nextPhase
      }
      
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse])
      }, 1000)
    }
  }

  const generateSTARRReport = async () => {
    setIsGeneratingReport(true)
    
    try {
      const prompt = `Maak een professionele STARR reflectie op basis van de volgende antwoorden van een student. Maak er een goed gestructureerd, coherent verhaal van dat geschikt is voor een portfolio of evaluatie.

SITUATIE: ${starrData.situatie}

TAAK: ${starrData.taak}

ACTIE: ${starrData.actie}

RESULTAAT: ${starrData.resultaat}

REFLECTIE: ${starrData.reflectie}

Maak hiervan een professionele STARR reflectie met:
1. Een korte inleiding
2. Duidelijke kopjes voor elke STARR component
3. Vloeiende overgangen tussen de onderdelen
4. Een conclusie met belangrijkste leerpunten
5. Gebruik professionele taal maar houd het persoonlijk
6. Zorg dat het tussen de 400-600 woorden is

Format het als markdown met duidelijke headers.`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          aiModel: 'smart'
        }),
      })

      if (!response.ok) {
        throw new Error('Fout bij het genereren van de reflectie')
      }

      const data = await response.json()
      setFinalReport(data.response)
      
      const reportMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: `## 📋 Je Complete STARR Reflectie

${data.response}

---

**💡 Tips voor gebruik:**
- Bewaar deze reflectie in je portfolio
- Gebruik het voor evaluatiegesprekken
- Deel relevante delen met je begeleider
- Herhaal dit proces regelmatig voor continue ontwikkeling`,
        timestamp: new Date(),
        phase: 'complete'
      }
      
      setMessages(prev => [...prev, reportMessage])
      
    } catch (error) {
      console.error('Error generating STARR report:', error)
      
      const errorMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: `❌ Er is een fout opgetreden bij het genereren van je reflectie. Probeer het opnieuw of neem contact op met je begeleider.

**Je antwoorden zijn wel bewaard:**
- Situatie: ✅
- Taak: ✅  
- Actie: ✅
- Resultaat: ✅
- Reflectie: ✅`,
        timestamp: new Date(),
        phase: 'complete'
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    setMessages([])
    setCurrentInput('')
    setCurrentPhase('situatie')
    setIsComplete(false)
    setIsGeneratingReport(false)
    setSTARRData({
      situatie: '',
      taak: '',
      actie: '',
      resultaat: '',
      reflectie: ''
    })
    setFinalReport('')
    
    // Re-initialize with welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: `Hallo! 👋 Ik ga je helpen met het maken van een STARR reflectie. 

STARR staat voor **Situatie**, **Taak**, **Actie**, **Resultaat** en **Reflectie**. Door deze stappen te doorlopen, kun je systematisch reflecteren op je ervaringen en daarvan leren.

Laten we beginnen met de **Situatie** 📍

**Beschrijf de situatie waarin je je bevond:**
- Wat was de context?
- Wie waren er betrokken?
- Wanneer en waar vond het plaats?
- Wat waren de omstandigheden?

Neem de tijd om de situatie zo volledig mogelijk te beschrijven.`,
        timestamp: new Date(),
        phase: 'situatie'
      }
      setMessages([welcomeMessage])
    }, 100)
  }

  const getCurrentPhaseInfo = () => {
    return STARR_PHASES.find(p => p.key === currentPhase) || STARR_PHASES[0]
  }

  const getCompletedPhases = () => {
    return STARR_PHASES.filter(phase => starrData[phase.key as keyof STARRData])
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">STARR Reflectie Proces</h2>
          <button
            onClick={resetChat}
            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
          >
            🔄 Opnieuw beginnen
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 mb-4">
          {STARR_PHASES.map((phase, index) => {
            const isCompleted = starrData[phase.key as keyof STARRData]
            const isCurrent = phase.key === currentPhase && !isComplete
            
            return (
              <div key={phase.key} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-white text-blue-600 ring-2 ring-white' 
                      : 'bg-white bg-opacity-30 text-white'
                }`}>
                  {isCompleted ? '✓' : phase.icon}
                </div>
                {index < STARR_PHASES.length - 1 && (
                  <div className={`w-8 h-1 mx-2 rounded ${
                    isCompleted ? 'bg-green-500' : 'bg-white bg-opacity-30'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Current Phase Info */}
        {!isComplete && (
          <div className="text-white">
            <p className="text-lg font-semibold">
              {getCurrentPhaseInfo().icon} {getCurrentPhaseInfo().title}
            </p>
            <p className="text-blue-100 text-sm">
              {getCurrentPhaseInfo().description}
            </p>
          </div>
        )}
        
        {isComplete && (
          <div className="text-white">
            <p className="text-lg font-semibold">🎉 Reflectie Voltooid!</p>
            <p className="text-blue-100 text-sm">
              Alle onderdelen zijn ingevuld. Genereer nu je complete STARR reflectie.
            </p>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl rounded-lg p-4 ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {message.type === 'bot' ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              <div className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isGeneratingReport && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-gray-700 text-sm">Ik schrijf je STARR reflectie...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-6">
        {!isComplete ? (
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Beschrijf de ${getCurrentPhaseInfo().title.toLowerCase()}...`}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Druk op Enter om te verzenden, Shift+Enter voor een nieuwe regel
              </p>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Verzenden
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={generateSTARRReport}
              disabled={isGeneratingReport}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
            >
              {isGeneratingReport ? (
                <>
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Reflectie wordt gegenereerd...
                  </div>
                </>
              ) : (
                '📋 Genereer Complete STARR Reflectie'
              )}
            </button>
            <p className="text-gray-600 text-sm mt-2">
              Klik om een professionele reflectie te genereren op basis van je antwoorden
            </p>
          </div>
        )}
      </div>

      {/* Summary Panel */}
      {getCompletedPhases().length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Jouw Antwoorden Tot Nu Toe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCompletedPhases().map((phase) => (
              <div key={phase.key} className="bg-white p-3 rounded-lg border">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">{phase.icon}</span>
                  <h4 className="font-semibold text-gray-800">{phase.title}</h4>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {starrData[phase.key as keyof STARRData]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}