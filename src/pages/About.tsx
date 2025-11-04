
export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200 space-y-4">
        <h2 className="text-2xl font-semibold">About ShiftMind</h2>
        <p className="text-gray-300">
          ShiftMind is an innovative AI-powered DeFi platform that combines advanced market analysis
          with automated cryptocurrency trading. Our platform leverages artificial intelligence to
          identify optimal trading opportunities and execute them through SideShift.ai's reliable
          swap infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200">
          <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
          <p className="text-sm text-gray-300">
            We aim to democratize crypto trading by making sophisticated trading strategies accessible
            to everyone. Our AI-driven approach helps users make informed decisions while maintaining
            full control of their assets.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200">
          <h3 className="text-xl font-semibold mb-4">How It Works</h3>
          <p className="text-sm text-gray-300">
            Our AI continuously analyzes market conditions, token pairs, and trading volumes to
            generate actionable signals. Users can choose their risk level and let ShiftMind
            execute trades automatically or manage trades manually.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200">
        <h3 className="text-xl font-semibold mb-4">Security & Transparency</h3>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
          <li>Non-custodial platform - you always control your assets</li>
          <li>Transparent AI decisions with detailed signal explanations</li>
          <li>Built on reliable infrastructure (Polygon Network & SideShift.ai)</li>
          <li>Open-source code for community review</li>
        </ul>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-white/10 text-gray-200">
        <h3 className="text-xl font-semibold mb-4">Risk Disclosure</h3>
        <p className="text-sm text-gray-300">
          Cryptocurrency trading involves significant risk and may not be suitable for everyone.
          While our AI aims to identify profitable opportunities, market conditions can change
          rapidly. Always trade responsibly and never invest more than you can afford to lose.
        </p>
      </div>
    </div>
  );
}


