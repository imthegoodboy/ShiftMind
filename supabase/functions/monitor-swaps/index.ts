import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SIDESHIFT_API = 'https://api.sideshift.ai/v2';

interface SwapUpdate {
  shift_id: string;
  status: string;
  settle_amount?: string;
}

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
    const { shift_id } = await req.json();

    if (!shift_id) {
      return new Response(
        JSON.stringify({ error: "shift_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch(`${SIDESHIFT_API}/shifts/${shift_id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch shift status: ${response.statusText}`);
    }

    const order = await response.json();

    return new Response(
      JSON.stringify({
        shift_id: order.id,
        status: order.status,
        deposit_address: order.depositAddress,
        settle_amount: order.settleAmount,
        deposit_amount: order.depositAmount,
        expires_at: order.expiresAt,
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
