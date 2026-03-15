import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function pushToGHL(payload: Record<string, string>) {
  const webhookUrl = Deno.env.get("GHL_WEBHOOK_URL");
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // GHL push failed — don't block visitor logging
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      page,
      referrer,
      userAgent,
      firstName,
      lastName,
      email,
      phone,
    } = body;

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

    const visitedAt = new Date().toISOString();

    await supabase.from("visitor_logs").insert({
      ip,
      page: page || "",
      referrer: referrer || "",
      user_agent: userAgent || "",
      ...geoData,
    });

    await pushToGHL({
      source: "kenjiai_visitor_log",
      visited_at: visitedAt,
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phone: phone || "",
      ip,
      page: page || "",
      referrer: referrer || "",
      user_agent: userAgent || "",
      country: geoData.country || "",
      city: geoData.city || "",
      region: geoData.region || "",
      org: geoData.org || "",
      timezone: geoData.timezone || "",
      latitude: geoData.latitude || "",
      longitude: geoData.longitude || "",
      hostname: geoData.hostname || "",
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
