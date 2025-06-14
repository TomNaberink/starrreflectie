import STARRChatBot from '@/components/STARRChatBot'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            STARR Reflectie Assistent
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6 max-w-2xl mx-auto">
            Laat je begeleiden door een gestructureerd reflectieproces om van je ervaringen te leren
          </p>

          {/* STARR Uitleg */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Wat is STARR Reflectie?</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-bold text-red-700 mb-2">📍 Situatie</h3>
                <p className="text-sm text-red-600">Beschrijf de context en omstandigheden</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-bold text-orange-700 mb-2">🎯 Taak</h3>
                <p className="text-sm text-orange-600">Wat was je doel of opdracht?</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-bold text-yellow-700 mb-2">⚡ Actie</h3>
                <p className="text-sm text-yellow-600">Welke stappen heb je ondernomen?</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-bold text-green-700 mb-2">📊 Resultaat</h3>
                <p className="text-sm text-green-600">Wat was de uitkomst?</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700 mb-2">🔄 Reflectie</h3>
                <p className="text-sm text-blue-600">Wat heb je geleerd en wat ga je anders doen?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chatbot */}
        <div className="max-w-4xl mx-auto">
          <STARRChatBot />
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-blue-600">
            <span>💡</span>
            <span>Reflecteren helpt je groeien!</span>
            <span>💡</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            STARR Reflectie Assistent • Powered by AI
          </p>
        </div>
      </div>
    </div>
  )
}