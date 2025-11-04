import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SIDESHIFT_API = 'https://api.sideshift.ai/v2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { depositCoin, settleCoin, settleAddress, depositAmount } = await req.json();

    if (!depositCoin || !settleCoin || !settleAddress || !depositAmount) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = {
      depositCoin,
      settleCoin,
      settleAddress,
      depositAmount,
    };

    const response = await fetch(`${SIDESHIFT_API}/shifts/fixed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "Failed to create shift");
    }

    const order = await response.json();

    return new Response(
      JSON.stringify({
        shift_id: order.id,
        deposit_address: order.depositAddress,
        settle_address: order.settleAddress,
        deposit_amount: order.depositAmount,
        settle_amount: order.settleAmount,
        rate: order.rate,
        expires_at: order.expiresAt,
        status: order.status,
      }),
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
