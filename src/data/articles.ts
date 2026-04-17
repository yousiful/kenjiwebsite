export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
  keywords: string[];
  image: string;
  content: string;
}

export const articles: Record<string, Article> = {
  'automate-follow-ups-never-lose-lead': {
    slug: 'automate-follow-ups-never-lose-lead',
    title: 'How to Automate Follow-Ups So No Lead Falls Through the Cracks',
    excerpt: 'Most businesses lose 50% of their leads because nobody follows up fast enough. Here\'s how to fix that with simple automation that works while you sleep.',
    category: 'Lead Management',
    date: '2026-04-10',
    author: 'KenjiAI Team',
    readTime: '7 min read',
    tags: ['Lead Management', 'Automation', 'CRM', 'Sales'],
    keywords: ['automate follow ups', 'lead follow up automation', 'CRM follow up', 'automated lead nurturing', 'never lose a lead'],
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `
<h2 class="text-2xl font-bold text-white mb-4">The Follow-Up Problem Nobody Talks About</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  Here's a stat that should make you uncomfortable: 48% of salespeople never follow up with a prospect. Not once. And of the ones who do, most only try once or twice before giving up.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  Meanwhile, 80% of sales require at least five follow-ups to close. So half your team isn't following up at all, and the other half is quitting too early. That's money walking out the door every single day.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  The problem isn't laziness. It's bandwidth. Your team is busy with clients they already have, putting out fires, handling admin work. Following up with someone who filled out a form three days ago just falls to the bottom of the list.
</p>

<h2 class="text-2xl font-bold text-white mb-4">What Happens When You Don't Follow Up</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  Let's say you spend $2,000 on ads this month and generate 100 leads. If your team only follows up with 50 of them (and that's generous), you just threw $1,000 in the trash. Not because the leads were bad, but because nobody called them back.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  Now multiply that by 12 months. That's $12,000 a year in wasted ad spend, just from slow follow-ups. And that doesn't count the revenue you would have earned from those deals.
</p>

<h2 class="text-2xl font-bold text-white mb-4">The Fix: Let AI Do the First Touch</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  The solution isn't hiring more people. It's automating the first few touches so your team only talks to people who are actually interested.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  Here's how it works in practice:
</p>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <ol class="space-y-4 text-gray-300">
    <li><strong class="text-white">1. Lead comes in</strong> - Someone fills out your form, calls your number, or messages you on social media.</li>
    <li><strong class="text-white">2. Instant response (under 60 seconds)</strong> - AI sends a personalized text and/or email acknowledging their interest. Speed matters here. Leads contacted within 5 minutes are 21x more likely to convert.</li>
    <li><strong class="text-white">3. Qualification conversation</strong> - AI asks a few questions via text to figure out what they need, their budget range, and timeline. This happens automatically.</li>
    <li><strong class="text-white">4. Booking or handoff</strong> - Qualified leads get a calendar link to book a call. Unqualified ones get helpful resources and stay in a nurture sequence.</li>
    <li><strong class="text-white">5. Persistent follow-up</strong> - If they don't respond, the system follows up 5-7 times over the next 2 weeks. Different messages, different angles, different times of day.</li>
  </ol>
</div>

<h2 class="text-2xl font-bold text-white mb-4">What This Looks Like in Real Numbers</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  One of our clients, a home services company, was converting about 12% of their leads before automation. After setting up automated follow-ups:
</p>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div class="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-center">
    <div class="text-2xl font-bold text-green-400 mb-1">34%</div>
    <div class="text-gray-400 text-sm">New conversion rate</div>
  </div>
  <div class="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-center">
    <div class="text-2xl font-bold text-blue-400 mb-1">2 min</div>
    <div class="text-gray-400 text-sm">Average response time</div>
  </div>
  <div class="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-center">
    <div class="text-2xl font-bold text-purple-400 mb-1">0</div>
    <div class="text-gray-400 text-sm">Leads slipping through</div>
  </div>
</div>
<p class="text-gray-300 mb-6 leading-relaxed">
  They didn't hire anyone new. They didn't change their ads. They just made sure every single lead got a fast, consistent follow-up.
</p>

<h2 class="text-2xl font-bold text-white mb-4">How to Get Started</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  You don't need to automate everything on day one. Start with these three things:
</p>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <ul class="space-y-3 text-gray-300">
    <li class="flex items-start gap-3"><span class="text-green-400 font-bold">1.</span> Set up an instant text response for new leads. Even a simple "Hey [name], thanks for reaching out. When's a good time to chat?" makes a huge difference.</li>
    <li class="flex items-start gap-3"><span class="text-green-400 font-bold">2.</span> Create a 5-touch follow-up sequence. Spread it over 2 weeks. Mix texts and emails. Keep them short and personal.</li>
    <li class="flex items-start gap-3"><span class="text-green-400 font-bold">3.</span> Track your response rate. If you're not measuring it, you can't improve it.</li>
  </ul>
</div>
<p class="text-gray-300 mb-6 leading-relaxed">
  If you want help setting this up, <a href="/pricing" class="text-blue-400 hover:text-blue-300 underline">check out how KenjiAI handles it</a>. We build the entire follow-up system for you and it runs on autopilot.
</p>
`
  },

  'ai-voice-agents-what-they-cost-are-they-worth-it': {
    slug: 'ai-voice-agents-what-they-cost-are-they-worth-it',
    title: 'AI Voice Agents: What They Are, What They Cost, and Whether They\'re Worth It',
    excerpt: 'AI voice agents can answer your phone, qualify leads, and book appointments 24/7. But are they actually good enough to trust with your customers? Here\'s the honest breakdown.',
    category: 'AI Voice',
    date: '2026-04-08',
    author: 'KenjiAI Team',
    readTime: '9 min read',
    tags: ['AI Voice', 'Sales Automation', 'Lead Qualification', 'Technology'],
    keywords: ['AI voice agents for business', 'AI phone answering', 'AI sales calls', 'automated phone system', 'AI receptionist'],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `
<h2 class="text-2xl font-bold text-white mb-4">What Is an AI Voice Agent, Actually?</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  An AI voice agent is software that can have real phone conversations with people. Not the old "press 1 for sales, press 2 for support" robot voice. We're talking about natural-sounding conversations where the AI listens, understands what the caller wants, and responds appropriately.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  Think of it like having a really sharp receptionist who never takes a lunch break, never calls in sick, and works weekends. It picks up the phone, figures out why someone's calling, answers their questions, and books appointments on your calendar.
</p>

<h2 class="text-2xl font-bold text-white mb-4">What Can They Actually Do?</h2>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <div class="space-y-4 text-gray-300">
    <div class="flex items-start gap-3">
      <span class="text-green-400 text-lg">✓</span>
      <div><strong class="text-white">Answer inbound calls</strong> - Pick up the phone 24/7, greet callers by context, and handle basic questions about your business.</div>
    </div>
    <div class="flex items-start gap-3">
      <span class="text-green-400 text-lg">✓</span>
      <div><strong class="text-white">Qualify leads</strong> - Ask the right questions to figure out if someone's a good fit before wasting your time.</div>
    </div>
    <div class="flex items-start gap-3">
      <span class="text-green-400 text-lg">✓</span>
      <div><strong class="text-white">Book appointments</strong> - Access your calendar and schedule calls or meetings in real time.</div>
    </div>
    <div class="flex items-start gap-3">
      <span class="text-green-400 text-lg">✓</span>
      <div><strong class="text-white">Make outbound calls</strong> - Follow up with leads, confirm appointments, or re-engage old contacts.</div>
    </div>
    <div class="flex items-start gap-3">
      <span class="text-yellow-400 text-lg">~</span>
      <div><strong class="text-white">Handle complex negotiations</strong> - Getting better, but still not great for nuanced sales conversations.</div>
    </div>
    <div class="flex items-start gap-3">
      <span class="text-red-400 text-lg">✗</span>
      <div><strong class="text-white">Replace your top salesperson</strong> - Not there yet. Think of it as handling the 80% of calls that are repetitive so your team can focus on the 20% that actually need a human.</div>
    </div>
  </div>
</div>

<h2 class="text-2xl font-bold text-white mb-4">What Does It Cost?</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  Let's talk real numbers. Pricing varies a lot depending on the provider and what you need:
</p>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <div class="space-y-4">
    <div class="flex items-center justify-between border-b border-gray-700 pb-3">
      <span class="text-white font-semibold">Basic AI receptionist</span>
      <span class="text-green-400 font-bold">$100-300/mo</span>
    </div>
    <div class="flex items-center justify-between border-b border-gray-700 pb-3">
      <span class="text-white font-semibold">Full inbound + outbound agent</span>
      <span class="text-blue-400 font-bold">$300-800/mo</span>
    </div>
    <div class="flex items-center justify-between border-b border-gray-700 pb-3">
      <span class="text-white font-semibold">Custom trained agent with CRM integration</span>
      <span class="text-purple-400 font-bold">$500-1,500/mo</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-white font-semibold">Full-time human receptionist (for comparison)</span>
      <span class="text-red-400 font-bold">$3,000-4,500/mo</span>
    </div>
  </div>
</div>
<p class="text-gray-300 mb-6 leading-relaxed">
  Most small businesses spend $300-500/month for a solid AI voice setup. That's roughly 10% of what a human would cost, and it works nights, weekends, and holidays.
</p>

<h2 class="text-2xl font-bold text-white mb-4">The Honest Pros and Cons</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-green-900/20 border border-green-700/30 rounded-xl p-5">
    <h3 class="text-green-400 font-bold mb-3">What's Great</h3>
    <ul class="space-y-2 text-gray-300 text-sm">
      <li>Never misses a call, even at 2 AM</li>
      <li>Consistent quality every single time</li>
      <li>Costs a fraction of a human</li>
      <li>Scales instantly during busy periods</li>
      <li>Logs everything in your CRM automatically</li>
    </ul>
  </div>
  <div class="bg-red-900/20 border border-red-700/30 rounded-xl p-5">
    <h3 class="text-red-400 font-bold mb-3">What's Not Perfect</h3>
    <ul class="space-y-2 text-gray-300 text-sm">
      <li>Can struggle with heavy accents</li>
      <li>Bad at reading emotional cues</li>
      <li>Some callers just want a human</li>
      <li>Needs proper setup to work well</li>
      <li>Not great for complex, high-stakes negotiations</li>
    </ul>
  </div>
</div>

<h2 class="text-2xl font-bold text-white mb-4">Who Should Use an AI Voice Agent?</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  AI voice agents work best for businesses that get a lot of inbound calls and can't afford to miss them. That includes:
</p>
<ul class="space-y-2 text-gray-300 mb-6">
  <li>Home services (plumbers, electricians, HVAC)</li>
  <li>Medical and dental offices</li>
  <li>Real estate agents and property managers</li>
  <li>Law firms and consulting practices</li>
  <li>Any business running paid ads that generate phone leads</li>
</ul>
<p class="text-gray-300 mb-6 leading-relaxed">
  If you're missing calls because you're busy with clients, or your after-hours leads are going to voicemail and never calling back, an AI voice agent will pay for itself in the first month.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  Want to see how it would work for your business? <a href="https://go.mediatraffics.com/leads" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">Book a free demo call</a> and we'll show you a live example.
</p>
`
  },

  'signs-you-need-crm-losing-money': {
    slug: 'signs-you-need-crm-losing-money',
    title: '5 Signs You\'re Losing Money Without a CRM (And How to Fix It)',
    excerpt: 'If you\'re still tracking leads in spreadsheets, sticky notes, or your head, you\'re leaving money on the table. Here are the warning signs and what to do about it.',
    category: 'CRM',
    date: '2026-04-05',
    author: 'KenjiAI Team',
    readTime: '6 min read',
    tags: ['CRM', 'Sales', 'Lead Management', 'Business Operations'],
    keywords: ['do I need a CRM', 'CRM for small business', 'losing leads without CRM', 'best CRM small business', 'CRM benefits'],
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `
<h2 class="text-2xl font-bold text-white mb-4">You Don't Need a CRM... Until You Do</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  When you're just starting out, a spreadsheet works fine. You've got 10 leads, you know all of them by name, and you can keep track of everything in your head. No problem.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  But somewhere between 10 leads and 100, things start falling apart. You forget to call someone back. A hot prospect goes cold because nobody followed up. You can't remember what you quoted someone last week. Sound familiar?
</p>

<h2 class="text-2xl font-bold text-white mb-4">Sign #1: You've Forgotten to Follow Up with a Lead This Week</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  This is the most common one. Someone expressed interest in your service, and you meant to call them back, but then three other things happened and now it's been five days. They've probably already hired someone else.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  A CRM doesn't let this happen. It shows you exactly who needs a follow-up today, tomorrow, and this week. No guessing, no forgetting.
</p>

<h2 class="text-2xl font-bold text-white mb-4">Sign #2: You Have No Idea Where Your Leads Are Coming From</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  If someone asks you "which marketing channel brings your best leads?" and you can't answer confidently, you're probably wasting money on ads that don't work and under-investing in the ones that do.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  A CRM tracks where every lead came from: Google ads, Facebook, referrals, your website. You can see exactly which channels are making you money and which ones are just burning budget.
</p>

<h2 class="text-2xl font-bold text-white mb-4">Sign #3: Your Sales Process Lives in Your Head</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  You know what to do with a lead. Call them, send a proposal, follow up, close. But does your team? Could someone cover for you if you went on vacation?
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  If your sales process isn't documented somewhere with clear stages and actions, it's not a process. It's tribal knowledge. And tribal knowledge doesn't scale.
</p>

<h2 class="text-2xl font-bold text-white mb-4">Sign #4: You're Spending Hours on Admin Work</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  Updating spreadsheets, sending confirmation emails, creating invoices, logging call notes. If you're doing all of this manually, you're spending $500+ worth of your time each month on work that software can do in seconds.
</p>

<h2 class="text-2xl font-bold text-white mb-4">Sign #5: You Can't Tell Me Your Close Rate</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  What percentage of your leads turn into paying customers? If you don't know, you can't improve it. And if you can't improve it, you're stuck hoping that more leads = more revenue, which only works until it doesn't.
</p>

<h2 class="text-2xl font-bold text-white mb-4">What a Good CRM Actually Does for You</h2>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <ul class="space-y-3 text-gray-300">
    <li class="flex items-start gap-3"><span class="text-green-400 font-bold">→</span> Shows you every lead and where they are in your pipeline</li>
    <li class="flex items-start gap-3"><span class="text-green-400 font-bold">→</span> Reminds you (or your team) to follow up at the right time</li>
    <li class="flex items-start gap-3"><span class="text-green-400 font-bold">→</span> Automates repetitive emails, texts, and task assignments</li>
    <li class="flex items-start gap-3"><span class="text-green-400 font-bold">→</span> Tracks which marketing channels actually work</li>
    <li class="flex items-start gap-3"><span class="text-green-400 font-bold">→</span> Gives you real numbers: close rate, average deal size, revenue per channel</li>
  </ul>
</div>
<p class="text-gray-300 mb-6 leading-relaxed">
  You don't need the most expensive CRM on the market. You need one that's set up properly for your business and that you'll actually use. <a href="/pricing" class="text-blue-400 hover:text-blue-300 underline">KenjiAI includes a full CRM with every plan</a>, and our team sets it up for you so it's ready to go from day one.
</p>
`
  },

  'get-more-google-reviews-autopilot': {
    slug: 'get-more-google-reviews-autopilot',
    title: 'How to Get More Google Reviews on Autopilot',
    excerpt: 'Google reviews are the #1 factor in local search rankings. Here\'s how to get more of them without awkwardly asking every customer in person.',
    category: 'Reputation',
    date: '2026-04-01',
    author: 'KenjiAI Team',
    readTime: '5 min read',
    tags: ['Google Reviews', 'Reputation Management', 'Local SEO', 'Automation'],
    keywords: ['get more google reviews', 'automate review requests', 'reputation management', 'google reviews automation', 'local SEO reviews'],
    image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `
<h2 class="text-2xl font-bold text-white mb-4">Why Reviews Matter More Than You Think</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  87% of people read online reviews before choosing a local business. And Google rewards businesses with more reviews by ranking them higher in search results. It's that simple.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  A business with 150 reviews will almost always outrank a competitor with 30 reviews, even if the competitor's reviews are all 5 stars. Volume matters just as much as quality.
</p>

<h2 class="text-2xl font-bold text-white mb-4">The Problem: Nobody Asks</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  Most businesses know reviews are important but don't have a system for collecting them. They rely on customers leaving reviews on their own, which almost never happens. Happy customers rarely think to leave a review unless you make it easy for them.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  The fix is simple: ask. But do it at the right time, in the right way, automatically.
</p>

<h2 class="text-2xl font-bold text-white mb-4">The Automated Review System</h2>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <ol class="space-y-4 text-gray-300">
    <li><strong class="text-white">Step 1: Timing</strong> - Send a review request 1-2 hours after service completion. The experience is fresh, the customer is happy, and they're still thinking about you.</li>
    <li><strong class="text-white">Step 2: Make it dead simple</strong> - Send a text message (not email, texts get 98% open rates) with a direct link to your Google review page. One tap and they're there.</li>
    <li><strong class="text-white">Step 3: Sentiment filter</strong> - Before sending them to Google, ask "How was your experience?" If they say great, send them to Google. If they say bad, route them to a private feedback form so you can fix the issue before it becomes a public review.</li>
    <li><strong class="text-white">Step 4: Follow up once</strong> - If they don't leave a review within 24 hours, send one gentle reminder. No more than that. Nobody likes being nagged.</li>
  </ol>
</div>

<h2 class="text-2xl font-bold text-white mb-4">Real Results</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  A dental practice we work with went from 45 reviews to 280+ in 6 months using this exact system. Their Google ranking went from page 2 to the top 3 in their area. Their call volume increased by 40%.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  They didn't do anything differently in terms of service quality. They just started asking.
</p>

<h2 class="text-2xl font-bold text-white mb-4">The Text That Gets Reviews</h2>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <p class="text-gray-300 italic">
    "Hey [Name], thanks for coming in today! If you had a good experience, we'd really appreciate a quick Google review. It takes about 30 seconds and it helps us a ton: [link]"
  </p>
</div>
<p class="text-gray-300 mb-6 leading-relaxed">
  That's it. No long email. No complicated ask. Just a short, friendly text with a direct link. The simpler you make it, the more reviews you'll get.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  <a href="/pricing" class="text-blue-400 hover:text-blue-300 underline">KenjiAI's review system</a> automates this entire process. It sends the request after every completed job, filters for sentiment, and follows up once. You set it up once and never think about it again.
</p>
`
  },

  'what-marketing-automation-actually-does': {
    slug: 'what-marketing-automation-actually-does',
    title: 'What Does a Marketing Automation Platform Actually Do?',
    excerpt: 'Marketing automation sounds complicated but it\'s really not. Here\'s a plain-English breakdown of what it does, who needs it, and whether it\'s worth the money.',
    category: 'Marketing',
    date: '2026-03-28',
    author: 'KenjiAI Team',
    readTime: '8 min read',
    tags: ['Marketing Automation', 'Email Marketing', 'SMS Marketing', 'Business Growth'],
    keywords: ['marketing automation for small business', 'what is marketing automation', 'email automation', 'automated marketing', 'marketing automation platform'],
    image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `
<h2 class="text-2xl font-bold text-white mb-4">Marketing Automation in Plain English</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  Marketing automation is just software that sends the right message to the right person at the right time, without you having to do it manually every single time.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  That's it. It's not AI taking over your business. It's not some complicated tech stack. It's your marketing running on a schedule instead of whenever you remember to do it.
</p>

<h2 class="text-2xl font-bold text-white mb-4">What It Actually Looks Like</h2>
<p class="text-gray-300 mb-6 leading-relaxed">Here are some real examples:</p>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <div class="space-y-4 text-gray-300">
    <div>
      <strong class="text-white">Welcome sequence:</strong> Someone signs up on your website. They automatically get an email today, another one in 2 days with a case study, and a third one in 5 days with an offer. You wrote these once. They run forever.
    </div>
    <div>
      <strong class="text-white">Abandoned quote follow-up:</strong> You sent someone a quote and they didn't respond. After 3 days, they automatically get a text: "Hey, just checking in on that quote. Any questions?" Most people just forgot, and this simple nudge closes deals.
    </div>
    <div>
      <strong class="text-white">Birthday/anniversary messages:</strong> Your CRM knows your client's birthday. On that day, they get a personalized text. Small gesture, huge impact on retention.
    </div>
    <div>
      <strong class="text-white">Re-engagement campaigns:</strong> Clients who haven't booked in 90 days automatically get a "we miss you" email with a special offer. Brings back 10-15% of dormant clients.
    </div>
  </div>
</div>

<h2 class="text-2xl font-bold text-white mb-4">Who Actually Needs This?</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  You need marketing automation if:
</p>
<ul class="space-y-2 text-gray-300 mb-6">
  <li class="flex items-start gap-3"><span class="text-green-400">→</span> You have more than 50 contacts/clients</li>
  <li class="flex items-start gap-3"><span class="text-green-400">→</span> You're sending the same emails over and over</li>
  <li class="flex items-start gap-3"><span class="text-green-400">→</span> You know you should be following up more but don't have time</li>
  <li class="flex items-start gap-3"><span class="text-green-400">→</span> Your marketing is inconsistent (busy month = no marketing)</li>
  <li class="flex items-start gap-3"><span class="text-green-400">→</span> You want to grow without hiring a marketing person</li>
</ul>

<h2 class="text-2xl font-bold text-white mb-4">What It Costs vs. What It Saves</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  Most marketing automation platforms cost $50-500/month depending on features and contact count. A basic email tool like Mailchimp starts around $50. A full platform with SMS, email, CRM, and workflows runs $200-500.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  For context: a marketing coordinator costs $3,500-5,000/month. Marketing automation handles about 60-70% of what that person would do, at 10% of the cost. And it works weekends.
</p>

<h2 class="text-2xl font-bold text-white mb-4">The Biggest Mistake People Make</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  Buying the tool and never setting it up properly. A marketing automation platform is only as good as what you put into it. If you don't write the emails, build the workflows, and connect your lead sources, it's just expensive software sitting there doing nothing.
</p>
<p class="text-gray-300 mb-6 leading-relaxed">
  That's why we take a different approach at KenjiAI. We don't just give you the software and wish you luck. <a href="/pricing" class="text-blue-400 hover:text-blue-300 underline">Our team builds everything for you</a>: the email sequences, the SMS campaigns, the follow-up workflows, all of it. You tell us what you want to accomplish, and we make it happen.
</p>

<h2 class="text-2xl font-bold text-white mb-4">Getting Started</h2>
<p class="text-gray-300 mb-6 leading-relaxed">
  If you're new to marketing automation, don't try to automate everything at once. Pick one thing that's costing you the most time or money right now:
</p>
<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
  <ul class="space-y-3 text-gray-300">
    <li><strong class="text-white">If you're losing leads:</strong> Start with an automated follow-up sequence.</li>
    <li><strong class="text-white">If clients are churning:</strong> Start with a re-engagement campaign.</li>
    <li><strong class="text-white">If you want more referrals:</strong> Start with an automated review/referral request.</li>
  </ul>
</div>
<p class="text-gray-300 mb-6 leading-relaxed">
  Get one thing working, see the results, then add more. That's how you build a marketing system that actually works instead of an overwhelming mess you never use.
</p>
`
  }
};

export function getArticleBySlug(slug: string): Article | undefined {
  return articles[slug];
}

export function getAllArticles(): Article[] {
  return Object.values(articles).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
