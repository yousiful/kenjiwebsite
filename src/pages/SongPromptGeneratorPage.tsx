import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Music, Copy, Check, Sparkles, ExternalLink, RefreshCw, Mic2, Building2 } from 'lucide-react';

type Mode = 'personal' | 'business';

interface GenreProfile {
  label: string;
  bpm: string;
  instrumentation: string;
  mix: string;
}

const PERSONAL_GENRES: Record<string, GenreProfile> = {
  pop: { label: 'Pop', bpm: '100-118 BPM', instrumentation: 'shimmering synth pads, four-on-the-floor kick, bright vocal chops, a hooky top-line melody', mix: 'radio-loud master, present vocals sitting right on top of the mix' },
  hiphop: { label: 'Hip-Hop / Rap', bpm: '80-96 BPM', instrumentation: '808 sub bass, crisp hi-hat rolls, a confident half-sung half-rapped delivery, a punchy snare on the backbeat', mix: 'heavy low end, vocals dry and forward, a little vinyl-crackle texture underneath' },
  rnb: { label: 'R&B', bpm: '70-90 BPM', instrumentation: 'warm Rhodes-style keys, a smooth sub bassline, breathy layered harmonies, finger-snap percussion', mix: 'silky, intimate vocal presence, soft low-mid warmth, minimal harshness' },
  country: { label: 'Country', bpm: '90-120 BPM', instrumentation: 'acoustic guitar strum, pedal steel accents, brushed snare, a storytelling vocal delivery', mix: 'warm analog mix, vocals upfront and conversational' },
  edm: { label: 'EDM / Dance', bpm: '124-130 BPM', instrumentation: 'sidechained pads, a buildup riser into a festival-size drop, four-on-the-floor kick, plucky synth arps', mix: 'big, wide, club-ready master with a hard-hitting low end' },
  rock: { label: 'Rock', bpm: '110-140 BPM', instrumentation: 'driving electric guitar riffs, live-feeling drums, a gritty, powerful lead vocal', mix: 'guitar-forward, punchy drums, a mix built for a big room' },
  afrobeats: { label: 'Afrobeats', bpm: '100-112 BPM', instrumentation: 'log-drum bass, syncopated percussion, call-and-response vocal ad-libs, airy guitar licks', mix: 'groove-forward, warm low end, vocals riding the pocket' },
  reggaeton: { label: 'Latin / Reggaeton', bpm: '90-96 BPM', instrumentation: 'the classic dembow rhythm, deep sub bass, bright brass stabs, a charismatic melodic-rap delivery', mix: 'club-ready low end, vocals bright and forward' },
  acoustic: { label: 'Acoustic / Singer-Songwriter', bpm: '70-100 BPM', instrumentation: 'a single fingerpicked or strummed acoustic guitar, light room ambience, an intimate, unpolished lead vocal', mix: 'stripped-back, close-mic vocal presence, minimal processing' },
};

const JINGLE_GENRES: Record<string, GenreProfile> = {
  classic: { label: 'Classic Radio Jingle', bpm: '110-125 BPM', instrumentation: 'a bright horn section, bouncy upright-piano-style keys, a full group-vocal chant on the tagline', mix: 'punchy and compressed, built to cut through on a car radio' },
  modernpop: { label: 'Modern Pop Jingle', bpm: '110-120 BPM', instrumentation: 'clean synth stabs, a claps-and-kick backbeat, a catchy earworm melody on the brand name', mix: 'bright, radio-loud, vocal hook mixed right up front' },
  anthem: { label: 'Epic / Cinematic Anthem', bpm: '80-100 BPM', instrumentation: 'swelling strings, a driving cinematic drum line, a big unison vocal or choir on the hook', mix: 'wide and dynamic, builds from a quiet open to a big final hit' },
  acousticfriendly: { label: 'Acoustic / Friendly', bpm: '90-110 BPM', instrumentation: 'warm acoustic guitar, light hand percussion, a friendly, approachable lead vocal', mix: 'warm, close, and conversational, like a neighbor talking to you' },
  corporate: { label: 'Corporate Uplift', bpm: '100-115 BPM', instrumentation: 'clean electric piano, subtle synth pads, a confident, polished vocal or vocal stack', mix: 'clean and professional, nothing distorted or lo-fi' },
};

const PERSONAL_MOODS = [
  'Confident & Hype', 'Romantic', 'Heartbreak / Emotional', 'Celebration / Party', 'Motivational / Hustle', 'Chill / Laid-back Vibe',
] as const;

const JINGLE_MOODS = [
  'Upbeat & Fun', 'Trustworthy & Warm', 'Bold & Energetic', 'Premium & Sleek', 'Hometown / Community Pride',
] as const;

const PERSONAL_HOOKS: Record<string, string[]> = {
  'Confident & Hype': [
    'They said {name} wouldn’t make it this far, look at me now, look at these scars.',
    '{name} up in the building, watch the whole room shift.',
    'Ain’t no ceiling, {name} going up tonight.',
  ],
  'Romantic': [
    'Every road leads back to you, {name} knows it’s true.',
    '{name} said forever, and forever’s what we do.',
    'Out of everyone in the room, {name}, I still see only you.',
  ],
  'Heartbreak / Emotional': [
    '{name} still checks the phone, hoping it’s you calling home.',
    'Nobody warned {name} that love could leave this quiet.',
    'Same city, different world, since you left, {name}’s not the same.',
  ],
  'Celebration / Party': [
    'It’s a {name} kind of night, turn the lights up bright.',
    'Pop it up for {name}, we ain’t stopping til the morning.',
    'Everybody came to see {name} tonight, and the night ain’t over.',
  ],
  'Motivational / Hustle': [
    '{name} been grinding since the sun wasn’t up, built it all from nothing, that’s enough.',
    'No handout, no shortcut, {name} did it the hard way.',
    'They watched {name} fall, now they watch {name} fly.',
  ],
  'Chill / Laid-back Vibe': [
    '{name} riding slow, windows down, letting go.',
    'Nowhere to be, just {name} and the breeze.',
    '{name} keeping it easy, no rush, no static.',
  ],
};

const JINGLE_HOOKS: Record<string, string[]> = {
  'Upbeat & Fun': [
    'Come on down to {business}, we’ll make your whole day better!',
    'It’s always a good time at {business}!',
    '{business}, {business}, come see what we’ve got!',
  ],
  'Trustworthy & Warm': [
    '{business}, right here in your neighborhood, taking care of you like we should.',
    'When you need it done right, {business} is who you call.',
    'Family to family, that’s the {business} way.',
  ],
  'Bold & Energetic': [
    '{business}! {business}! We get it done right, every time!',
    'Nobody does it bigger than {business}!',
    'Go big, go bold, go {business}!',
  ],
  'Premium & Sleek': [
    '{business}, where quality meets everything you deserve.',
    'The standard is set. Welcome to {business}.',
    '{business}. Simply better.',
  ],
  'Hometown / Community Pride': [
    'Proud to serve this town, that’s the {business} way.',
    'Built here, run here, {business} is home.',
    'This town runs on {business}.',
  ],
};

const PLATFORMS = [
  { name: 'Suno', url: 'https://suno.com/create', note: 'Best all-round for a full song with vocals' },
  { name: 'Udio', url: 'https://www.udio.com/', note: 'Strong alternative, similar workflow' },
  { name: 'Producer.ai', url: 'https://producer.ai/', note: 'Free tier is non-commercial only, commercial rights need their paid plan, real fit for a jingle you’ll actually use' },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SongPromptGeneratorPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('personal');

  // Personal fields
  const [styleRef, setStyleRef] = useState('');
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('pop');
  const [vocal, setVocal] = useState('Let the AI choose');
  const [mood, setMood] = useState<string>(PERSONAL_MOODS[0]);
  const [occasion, setOccasion] = useState('');

  // Business fields
  const [business, setBusiness] = useState('');
  const [whatYouDo, setWhatYouDo] = useState('');
  const [tagline, setTagline] = useState('');
  const [jingleGenre, setJingleGenre] = useState('classic');
  const [jingleMood, setJingleMood] = useState<string>(JINGLE_MOODS[0]);
  const [length, setLength] = useState('30-second radio spot');

  const [hookSeed, setHookSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const hook = useMemo(() => {
    if (mode === 'personal') {
      const bank = PERSONAL_HOOKS[mood] || [];
      if (!bank.length) return '';
      const template = bank[hookSeed % bank.length];
      return template.replace(/\{name\}/g, name.trim() || 'you');
    } else {
      const bank = JINGLE_HOOKS[jingleMood] || [];
      if (!bank.length) return '';
      const template = bank[hookSeed % bank.length];
      return template.replace(/\{business\}/g, business.trim() || 'us');
    }
  }, [mode, mood, jingleMood, hookSeed, name, business]);

  const prompt = useMemo(() => {
    if (mode === 'personal') {
      const g = PERSONAL_GENRES[genre];
      const styleLine = styleRef.trim()
        ? `${styleRef.trim()}-inspired ${g.label.toLowerCase()} track`
        : `${g.label} track`;
      const vocalLine = vocal === 'Let the AI choose' ? 'a strong, radio-ready lead vocal' : `a ${vocal.toLowerCase()} lead vocal`;
      const occasionLine = occasion.trim() ? ` Written for: ${occasion.trim()}.` : '';

      return [
        'STYLE',
        `${styleLine}, ${g.bpm}, ${vocalLine}. Production: ${g.instrumentation}. Mix: ${g.mix}. Mood: ${mood}.${occasionLine}`,
        '',
        'STRUCTURE',
        '[Intro] → [Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Chorus] → [Bridge] → [Final Chorus] → [Outro]',
        '',
        'HOOK / CHORUS DIRECTION',
        `Work the name "${name.trim() || '[your name]'}" naturally into the chorus or a key hook line, not forced. Starting point:`,
        `"${hook}"`,
        '',
        'PRODUCTION NOTES',
        `Keep the vocal delivery confident and clear, this is the lead instrument. Avoid generic filler lyrics, every line should sound like it’s actually about ${name.trim() || 'this person'}, not a placeholder. Full commercial-quality arrangement, not a loop or a demo sketch.`,
      ].join('\n');
    } else {
      const g = JINGLE_GENRES[jingleGenre];
      const whatLine = whatYouDo.trim() ? ` (${whatYouDo.trim()})` : '';
      const taglineLine = tagline.trim() ? ` Work the tagline "${tagline.trim()}" into the hook or the final line.` : '';

      return [
        'STYLE',
        `${g.label} for a brand called "${business.trim() || '[Business Name]'}"${whatLine}, ${g.bpm}. Production: ${g.instrumentation}. Mix: ${g.mix}. Mood: ${jingleMood}. Length: ${length}.`,
        '',
        'STRUCTURE',
        length.toLowerCase().includes('15')
          ? '[Cold Open Hook] → [Brand Name Tag] → [Button/Outro]'
          : '[Intro Hook] → [Verse] → [Chorus / Brand Tag] → [Button/Outro]',
        '',
        'HOOK / TAGLINE DIRECTION',
        `The brand name "${business.trim() || '[Business Name]'}" needs to be clearly sung/said at least twice, once in the hook and once in the final button.${taglineLine} Starting point:`,
        `"${hook}"`,
        '',
        'PRODUCTION NOTES',
        `This needs to be a genuine earworm, the kind of jingle people hum without meaning to, not a generic backing track with the brand name pasted on top. Clean, commercial-ready mix, no explicit content, safe for broadcast.`,
      ].join('\n');
    }
  }, [mode, styleRef, genre, vocal, mood, occasion, name, hook, business, whatYouDo, tagline, jingleGenre, jingleMood, length]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [prompt]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Song & Jingle Prompt Generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    description: 'Free tool that builds a producer-grade AI music prompt for Suno, Udio, or Producer.ai, for a personal song with your name or a commercial jingle for your business.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <>
      <Helmet>
        <title>Free AI Song & Jingle Prompt Generator | KenjiAI</title>
        <meta name="description" content="Build a real, producer-grade prompt for Suno, Udio, or Producer.ai, not generic AI slop. Make a personal song with your name, or a commercial jingle/anthem for your business. Free, no signup." />
        <link rel="canonical" href="https://kenjiai.com/tools/song-prompt-generator" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Free AI Song & Jingle Prompt Generator | KenjiAI" />
        <meta property="og:description" content="Build a producer-grade AI music prompt for Suno, Udio, or Producer.ai in seconds. Personal songs or commercial jingles, free forever." />
        <meta property="og:url" content="https://kenjiai.com/tools/song-prompt-generator" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full px-6 py-3 mb-6">
              <Music className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold">Free AI Song & Jingle Prompt Generator</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Stop making <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI slop</span> music.
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Build a real, producer-structured prompt, style direction, song structure, and a real hook, not
              "make a song about my name." Copy it into Suno, Udio, or Producer.ai and get something that
              actually sounds like a song.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex justify-center gap-3 mb-10">
            <button
              onClick={() => setMode('personal')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                mode === 'personal' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Mic2 className="w-4 h-4" /> A Song For Me
            </button>
            <button
              onClick={() => setMode('business')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                mode === 'business' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" /> A Jingle For My Business
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FORM */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6 sm:p-8">
              {mode === 'personal' ? (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Style reference (optional)</label>
                    <input value={styleRef} onChange={(e) => setStyleRef(e.target.value)} placeholder="e.g. Justin Bieber, but with a twist" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Your name / stage name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Reyes" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Genre</label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400">
                      {Object.entries(PERSONAL_GENRES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Vocal</label>
                    <select value={vocal} onChange={(e) => setVocal(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400">
                      {['Let the AI choose', 'Male', 'Female', 'Duet'].map((v) => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Mood</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PERSONAL_MOODS.map((m) => (
                        <button key={m} onClick={() => { setMood(m); setHookSeed((s) => s + 1); }} className={`text-sm px-3 py-2 rounded-lg text-left transition-colors ${mood === m ? 'bg-purple-500 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-700'}`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Occasion (optional)</label>
                    <input value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="e.g. birthday, graduation, just for fun" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Business / brand name</label>
                    <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g. Reyes Auto Parts" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">What you do</label>
                    <input value={whatYouDo} onChange={(e) => setWhatYouDo(e.target.value)} placeholder="e.g. family-owned auto parts store" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Tagline / slogan (optional)</label>
                    <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Right part, right price, right now" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Jingle style</label>
                    <select value={jingleGenre} onChange={(e) => setJingleGenre(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400">
                      {Object.entries(JINGLE_GENRES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Length</label>
                    <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400">
                      {['15-second radio spot', '30-second radio spot', '60-second spot', 'Full song / anthem'].map((v) => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Mood</label>
                    <div className="grid grid-cols-2 gap-2">
                      {JINGLE_MOODS.map((m) => (
                        <button key={m} onClick={() => { setJingleMood(m); setHookSeed((s) => s + 1); }} className={`text-sm px-3 py-2 rounded-lg text-left transition-colors ${jingleMood === m ? 'bg-purple-500 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-700'}`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* OUTPUT */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-400" /> Your Prompt</h2>
                <button onClick={() => setHookSeed((s) => s + 1)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> New hook idea
                </button>
              </div>
              <pre className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed mb-4 min-h-[320px]">
                {prompt}
              </pre>
              <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl mb-4 hover:shadow-lg transition-all">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>

              <div className="border-t border-gray-700 pt-4">
                <div className="text-xs text-gray-500 mb-3">No AI music platform has a public API yet, so paste your copied prompt in on whichever one you like:</div>
                <div className="flex flex-col gap-2">
                  {PLATFORMS.map((p) => (
                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:border-purple-400/50 rounded-xl px-4 py-3 transition-colors group">
                      <div>
                        <div className="text-white font-semibold text-sm">{p.name}</div>
                        <div className="text-gray-500 text-xs">{p.note}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-gray-800/30 border border-gray-700 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Why this doesn't sound like AI slop</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
              <div>
                <div className="text-purple-400 font-bold mb-2">Real production language</div>
                Actual instrumentation, BPM range, and mix direction per genre, not "upbeat song," the same kind of
                brief a real producer would work from.
              </div>
              <div>
                <div className="text-purple-400 font-bold mb-2">A real song structure</div>
                Intro, verses, chorus, bridge, outro, tagged the way Suno and Udio actually read structure, instead
                of one long undifferentiated block of text.
              </div>
              <div>
                <div className="text-purple-400 font-bold mb-2">A hook that means something</div>
                A real starting lyric built around your name or your brand, not a name awkwardly bolted onto a
                generic line.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SongPromptGeneratorPage;
