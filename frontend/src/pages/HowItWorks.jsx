import { Link } from 'react-router-dom'

const steps = [
  {
    number: '01',
    title: 'Upload your contract PDF',
    description:
      'Drag and drop or click to upload any freelance contract, NDA, or service agreement in PDF format. Your file is processed securely and never stored.',
  },
  {
    number: '02',
    title: 'Pay $2 to run the analysis',
    description:
      'A one-time $2 payment via Stripe unlocks a full AI-powered review. No subscription, no account required — just a single secure payment.',
  },
  {
    number: '03',
    title: 'Get your plain-English risk report',
    description:
      'Within 30 seconds you receive a risk score (1–10), a plain-English summary, a list of red flags, and the missing protections you should negotiate before signing.',
  },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
          ContractCheck AI
        </Link>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link to="/how-it-works" className="text-blue-600 font-medium">How it works</Link>
          <Link to="/use-cases" className="hover:text-gray-900 transition-colors">Use cases</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-6 py-20">

        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How ContractCheck AI works</h1>
          <p className="text-lg text-gray-500 mb-14">
            Three simple steps — from contract upload to risk report in under a minute.
          </p>

          <div className="flex flex-col gap-10">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6">
                <span className="text-3xl font-bold text-blue-100 select-none w-12 shrink-0 pt-1">
                  {step.number}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h2>
                  <p className="text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Analyze my contract — $2
            </Link>
          </div>
        </div>

      </main>

      <footer className="border-t border-gray-100 py-6 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <span>© {new Date().getFullYear()} ContractCheck AI</span>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <Link to="/how-it-works" className="hover:text-gray-600 transition-colors">How it works</Link>
          <Link to="/use-cases" className="hover:text-gray-600 transition-colors">Use cases</Link>
        </div>
      </footer>

    </div>
  )
}
