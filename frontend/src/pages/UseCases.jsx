import { Link } from 'react-router-dom'

const cases = [
  {
    emoji: '🤝',
    title: 'Freelance NDA checker',
    subtitle: 'Non-disclosure agreements',
    description:
      'Before signing an NDA with a new client, run it through ContractCheck AI. We flag overly broad confidentiality clauses, missing time limits, one-sided obligations, and terms that could restrict your future work with other clients.',
    flags: ['Overly broad scope of confidential information', 'No expiration date on confidentiality obligations', 'Restrictions on working with competitors', 'Missing mutual protection clauses'],
  },
  {
    emoji: '📋',
    title: 'Client contract review',
    subtitle: 'Project & service contracts',
    description:
      'Client contracts often include payment terms, IP ownership clauses, and liability waivers that heavily favor the client. Our AI spots the imbalances so you know what to push back on before you start the project.',
    flags: ['Unlimited revisions or scope creep clauses', 'IP assignment without compensation', 'Missing kill fee provisions', 'Unfair liability or indemnification terms'],
  },
  {
    emoji: '📄',
    title: 'Service agreement analysis',
    subtitle: 'Long-term service agreements',
    description:
      'Service agreements for ongoing retainers or long-term engagements carry more risk. ContractCheck AI reviews termination notice periods, auto-renewal traps, exclusivity clauses, and payment schedule terms.',
    flags: ['Auto-renewal without adequate notice', 'Exclusivity clauses limiting other clients', 'Vague termination conditions', 'Missing late payment penalties'],
  },
]

export default function UseCases() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
          ContractCheck AI
        </Link>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link to="/how-it-works" className="hover:text-gray-900 transition-colors">How it works</Link>
          <Link to="/use-cases" className="text-blue-600 font-medium">Use cases</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-6 py-20">

        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Use cases for freelancers</h1>
          <p className="text-lg text-gray-500 mb-14">
            ContractCheck AI works for any freelance contract — here are the most common scenarios.
          </p>

          <div className="flex flex-col gap-12">
            {cases.map((c) => (
              <div key={c.title} className="border border-gray-100 rounded-2xl px-6 py-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{c.emoji}</span>
                  <h2 className="text-xl font-semibold text-gray-900">{c.title}</h2>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 ml-9">
                  {c.subtitle}
                </p>
                <p className="text-gray-500 leading-relaxed mb-4">{c.description}</p>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Common red flags we catch</p>
                  <ul className="flex flex-col gap-1">
                    {c.flags.map((flag) => (
                      <li key={flag} className="flex gap-2 text-sm text-gray-600">
                        <span>❌</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
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
