import { Brain, Zap, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Brain className="w-12 h-12 text-blue-600" />
        <h1 className="text-5xl font-bold text-gray-900">ShiftMind</h1>
      </div>

      <p className="text-xl text-gray-600 mb-2">
        Let your crypto trade itself — AI + SideShift make it happen
      </p>

      <p className="text-sm text-gray-500 mb-8">
        Powered by Polygon Network & SideShift.ai
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">AI-Powered Strategy</h3>
          <p className="text-sm text-gray-700">
            Smart algorithms analyze market conditions and execute optimal swaps
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Automated Trading</h3>
          <p className="text-sm text-gray-700">
            Set your strategy and let ShiftMind handle the rest automatically
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Secure & Non-Custodial</h3>
          <p className="text-sm text-gray-700">
            Your keys, your crypto. We never hold your funds
          </p>
        </div>
      </div>
    </div>
  );
}
