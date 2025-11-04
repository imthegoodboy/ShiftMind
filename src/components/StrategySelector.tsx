import { Shield, TrendingUp, DollarSign } from 'lucide-react';

interface StrategySelectorProps {
  selectedStrategy: 'safe' | 'aggressive' | 'stable' | null;
  onSelectStrategy: (strategy: 'safe' | 'aggressive' | 'stable') => void;
}

const strategies = [
  {
    id: 'safe' as const,
    name: 'Safe Mode',
    icon: Shield,
    description: 'Conservative approach. Protects capital during downturns, takes profits on stable gains.',
    color: 'blue',
    features: ['Low risk', 'Capital preservation', 'Steady growth'],
  },
  {
    id: 'aggressive' as const,
    name: 'Aggressive',
    icon: TrendingUp,
    description: 'High-risk, high-reward. Chases momentum and volatile assets for maximum gains.',
    color: 'red',
    features: ['High risk', 'Maximum returns', 'Active trading'],
  },
  {
    id: 'stable' as const,
    name: 'Stable',
    icon: DollarSign,
    description: 'Balances between stablecoins and growth. Locks profits quickly, minimizes losses.',
    color: 'green',
    features: ['Balanced approach', 'Profit protection', 'Loss minimization'],
  },
];

export default function StrategySelector({ selectedStrategy, onSelectStrategy }: StrategySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {strategies.map((strategy) => {
        const Icon = strategy.icon;
        const isSelected = selectedStrategy === strategy.id;

        return (
          <div
            key={strategy.id}
            onClick={() => onSelectStrategy(strategy.id)}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
              isSelected
                ? `border-${strategy.color}-500 bg-${strategy.color}-50 shadow-lg scale-105`
                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-lg ${
                  isSelected ? `bg-${strategy.color}-500` : `bg-${strategy.color}-100`
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : `text-${strategy.color}-600`}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{strategy.name}</h3>
            </div>

            <p className="text-gray-600 text-sm mb-4">{strategy.description}</p>

            <div className="space-y-2">
              {strategy.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${strategy.color}-500`}></div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {isSelected && (
              <div className={`mt-4 text-center py-2 rounded-lg bg-${strategy.color}-500 text-white font-semibold`}>
                Selected
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
