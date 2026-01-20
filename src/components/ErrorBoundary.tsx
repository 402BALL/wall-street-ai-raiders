import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Error info:', errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: '#008080' }}>
          <div className="win95-window p-0" style={{ width: 400, maxWidth: '90vw' }}>
            <div className="win95-titlebar">
              <span className="text-xs font-bold">Error</span>
            </div>
            <div className="bg-[#c0c0c0] p-4 text-black">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <div className="font-bold mb-1">An error occurred</div>
                  <div className="text-xs text-[#404040]">
                    {this.state.error?.message || 'Unknown error'}
                  </div>
                </div>
              </div>
              <div className="bg-white border-2 p-2 text-[10px] font-mono max-h-32 overflow-auto mb-4" style={{ borderStyle: 'inset' }}>
                {this.state.error?.stack?.split('\n').slice(0, 5).join('\n') || 'No stack trace'}
              </div>
              <div className="flex justify-center gap-2">
                <button 
                  className="win95-btn px-4 py-1 text-xs"
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                >
                  Try Again
                </button>
                <button 
                  className="win95-btn px-4 py-1 text-xs"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

