import React from 'react';

export default function AboutPage() {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200 space-y-3">
      <h2 className="text-xl font-semibold">About ShiftMind</h2>
      <p className="text-sm text-gray-400">
        ShiftMind is an AI-powered DeFi helper. It analyzes market signals and suggests swaps
        that can be executed via SideShift.ai. This is an educational demo; trade responsibly.
      </p>
    </div>
  );
}


