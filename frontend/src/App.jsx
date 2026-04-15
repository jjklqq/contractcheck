// ContractCheck AI v1.1
import { useState, useRef, useEffect } from 'react'
import './App.css'

const API = 'https://contractcheck-production-11ad.up.railway.app'

function riskColor(score) {
  if (score <= 4) return 'text-green-600'
  if (score <= 7) return 'text-yellow-500'
  return 'text-red-600'
}

function riskBg(score) {
  if (score <= 4) return 'bg-green-50 border-green-200'
  if (score <= 7) return 'bg-yellow-50 border-yellow-200'
  return 'bg-red-50 border-red-200'
}

function App() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [totalAnalyses, setTotalAnalyses] = useState(0)
  const inputRef = useRef(null)

  const params = new URLSearchParams(window.location.search)
  const paymentStatus = params.get('payment') // "success" | "cancelled" | null

  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r => r.json())
      .then(d => {
        console.log('[stats] fetched:', d)
        setTotalAnalyses(d.total_analyses ?? 0)
      })
      .catch(err => {
        console.error('[stats] fetch failed:', err)
      })
  }, [])

  function handleFile(f) {
    if (!f) return
    setFile(f)
    setResult(null)
    setError(null)
  }

  function onInputChange(e) {
    handleFile(e.target.files[0])
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  async function goToCheckout() {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API}/create-checkout-session`, { method: 'POST' })
      const data = await res.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        setError(data.error ?? 'Could not create checkout session.')
        setCheckoutLoading(false)
      }
    } catch {
      setError('Could not reach the server.')
      setCheckoutLoading(false)
    }
  }

  async function analyze() {
    if (!file) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch(`${API}/analyze`, { method: 'POST', body })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
        setTotalAnalyses(n => (n ?? 0) + 1)
      }
    } catch {
      setError('Could not reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <span className="text-xl font-bold text-gray-900 tracking-tight">
          ContractCheck AI
        </span>
      </nav>

      {/* Payment banners */}
      {paymentStatus === 'success' && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-3 text-center text-green-700 text-sm font-medium">
          ✅ Payment successful! Upload your contract below.
        </div>
      )}
      {paymentStatus === 'cancelled' && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 text-center text-yellow-700 text-sm font-medium">
          ⚠️ Payment cancelled.
        </div>
      )}

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
          Upload your contract. Get a plain-English risk report in 30 seconds.
        </h1>

        <p className="mt-5 text-lg text-gray-500 max-w-xl">
          Spot red flags, missing protections, and unfair clauses — before you sign.
        </p>

        {/* Pricing section */}
        <div className="mt-12 w-full max-w-lg bg-gray-50 border border-gray-200 rounded-2xl px-8 py-8 flex flex-col items-center gap-4">
          <p className="text-gray-700 text-base font-medium">
            One analysis — <span className="font-bold text-gray-900">$2</span>. No subscription, no account needed.
          </p>
          <button
            onClick={goToCheckout}
            disabled={checkoutLoading}
            className={`w-full px-8 py-3 bg-blue-600 text-white text-base font-semibold rounded-xl transition-all
              ${checkoutLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
          >
            {checkoutLoading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Redirecting…
                </span>
              : 'Pay $2 & Analyze'
            }
          </button>
        </div>

        {/* Divider */}
        <div className="mt-10 w-full max-w-lg flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">or upload directly</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Upload zone — secondary */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`mt-6 w-full max-w-lg border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors
            ${dragging
              ? 'border-blue-500 bg-blue-50'
              : file
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onInputChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 ${file ? 'text-blue-500' : 'text-gray-300'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          {file
            ? <p className="text-blue-700 text-sm font-medium">{file.name}</p>
            : <p className="text-gray-400 text-sm">
                Drop your PDF here or{' '}
                <span className="text-blue-500 font-medium">click to browse</span>
              </p>
          }
        </div>

        {/* Analyze button */}
        <button
          onClick={analyze}
          disabled={!file || loading}
          className={`mt-4 px-8 py-3 bg-blue-600 text-white text-base font-semibold rounded-xl transition-opacity
            ${!file || loading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
        >
          Analyze Contract
        </button>

        {/* Loading */}
        {loading && (
          <div className="mt-10 flex flex-col items-center gap-3 text-gray-500">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Analyzing your contract...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 w-full max-w-lg bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-red-700 text-sm text-left">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-10 w-full max-w-lg text-left flex flex-col gap-6">

            {/* Risk score */}
            <div className={`border rounded-2xl px-6 py-5 flex items-center gap-4 ${riskBg(result.risk_score)}`}>
              <span className={`text-5xl font-bold ${riskColor(result.risk_score)}`}>
                {result.risk_score}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Risk Score</p>
                <p className={`text-sm font-medium ${riskColor(result.risk_score)}`}>
                  {result.risk_score <= 4 ? 'Low risk' : result.risk_score <= 7 ? 'Moderate risk' : 'High risk'}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="border border-gray-100 rounded-2xl px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Summary</p>
              <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Red flags */}
            {result.red_flags?.length > 0 && (
              <div className="border border-gray-100 rounded-2xl px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Red Flags</p>
                <ul className="flex flex-col gap-2">
                  {result.red_flags.map((flag, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span>❌</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing protections */}
            {result.missing_protections?.length > 0 && (
              <div className="border border-gray-100 rounded-2xl px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Missing Protections</p>
                <ul className="flex flex-col gap-2">
                  {result.missing_protections.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span>⚠️</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer — social proof counter */}
      <footer className="py-6 text-center">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-600">{totalAnalyses.toLocaleString()}</span>{' '}
          contract{totalAnalyses === 1 ? '' : 's'} analyzed so far
        </p>
      </footer>

    </div>
  )
}

export default App
