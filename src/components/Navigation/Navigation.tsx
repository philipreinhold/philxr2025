const Navigation = () => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
      <div className="flex items-center justify-center space-x-8 bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full">
        <button className="p-2 hover:opacity-60 transition-opacity">
          <span className="sr-only">Previous</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="p-2 hover:opacity-60 transition-opacity">
          <span className="sr-only">Next</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Navigation