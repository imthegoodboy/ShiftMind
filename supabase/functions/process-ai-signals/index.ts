import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AISignalRequest {
  user_id: string;
  token: string;
  price_change_24h: number;
  price_change_7d: number;
  strategy_type: 'safe' | 'balanced' | 'aggressive';
  confidence?: number;
}

function generateAISignal(data: AISignalRequest) {
  const { token, price_change_24h, price_change_7d, strategy_type, confidence = 0.5 } = data;
  
  let action = 'hold';
  let recommendation = '';
  let riskLevel = 'medium';

  if (strategy_type === 'safe') {
    if (price_change_24h < -5) {
      action = 'sell';
      recommendation = `${token} dropped ${Math.abs(price_change_24h).toFixed(2)}%. Moving to stablecoin.`;
      riskLevel = 'low';
    } else if (price_change_24h > 3 && price_change_24h < 8) {
      action = 'buy';
      recommendation = `${token} showing steady growth.`;
      riskLevel = 'low';
    }
  } else if (strategy_type === 'aggressive') {
    if (price_change_24h > 8) {
      action = 'buy';
      recommendation = `${token} surging with high momentum!`;
      riskLevel = 'high';
    } else if (price_change_24h < -8) {
      action = 'sell';
      recommendation = `${token} declining rapidly. Rotating out.`;
      riskLevel = 'high';
    }
  } else {
    if (price_change_24h > 5 && price_change_24h < 10) {
      action = 'buy';
      recommendation = `${token} showing balanced uptrend.`;
      riskLevel = 'medium';
    } else if (price_change_24h < -3) {
      action = 'sell';
      recommendation = `Rebalancing portfolio for risk management.`;
      riskLevel = 'medium';
    }
  }

  return {
    action,
    token,
    recommendation,
    risk_level: riskLevel,
    confidence: Math.min(confidence, 1),
    generated_at: new Date().toISOString(),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data = await req.json() as AISignalRequest;

    if (!data.token || data.price_change_24h === undefined || !data.strategy_type) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const signal = generateAISignal(data);

    return new Response(
      JSON.stringify(signal),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
