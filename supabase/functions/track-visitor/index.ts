import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { page, referrer, userAgent } = body;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    let geoData: Record<string, string> = {};
    if (ip !== "unknown" && ip !== "127.0.0.1" && !ip.startsWith("192.168") && !ip.startsWith("10.")) {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          geoData = {
            country: geo.country_name || "",
            city: geo.city || "",
            region: geo.region || "",
            org: geo.org || "",
            timezone: geo.timezone || "",
            latitude: String(geo.latitude || ""),
            longitude: String(geo.longitude || ""),
            hostname: geo.hostname || "",
          };
        }
      } catch {
        // geo lookup failed, continue without it
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("visitor_logs").insert({
      ip,
      page: page || "",
      referrer: referrer || "",
      user_agent: userAgent || "",
      ...geoData,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
