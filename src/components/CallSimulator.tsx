import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Play, 
  Square, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';

interface DialogLine {
  speaker: 'agent' | 'caller';
  name: string;
  text: string;
  delayMs: number;
}

interface CallScenario {
  id: string;
  type: 'inbound' | 'outbound';
  title: string;
  industry: string;
  badge: string;
  description: string;
  dialog: DialogLine[];
  crmAction: string;
  latency: string;
}

const SCENARIOS: CallScenario[] = [
  {
    id: 'inbound-hvac',
    type: 'inbound',
    title: 'Emergency HVAC Breakdown (11:45 PM)',
    industry: 'Home Services',
    badge: '24/7 Inbound Triage',
    description: 'Homeowner calls late at night with a frozen pipe and furnace shutoff. AI answers on Ring 1, triages the issue, and books an emergency tech.',
    latency: '410ms',
    crmAction: 'Job scheduled in ServiceTitan #8841 • Tech notified via SMS',
    dialog: [
      { speaker: 'agent', name: 'KenjiAI', text: "Thanks for calling Apex Heating and Air. This is Sarah on the emergency line. Are you experiencing a heating or cooling emergency tonight?", delayMs: 100 },
      { speaker: 'caller', name: 'Homeowner (Mark)', text: "Yes! Our furnace just stopped working and the temperature is dropping fast. Water is starting to freeze near the boiler.", delayMs: 2200 },
      { speaker: 'agent', name: 'KenjiAI', text: "I completely understand Mark, let's get you taken care of right away. I have an on-call emergency technician in your area who can arrive between 7:30 and 8:30 AM. What is your street address?", delayMs: 3800 },
      { speaker: 'caller', name: 'Homeowner (Mark)', text: "We are at 742 Evergreen Terrace. Can you please confirm the technician's name?", delayMs: 5600 },
      { speaker: 'agent', name: 'KenjiAI', text: "Got it, 742 Evergreen Terrace. Dave is our lead master tech on duty. I have reserved your priority dispatch slot and sent a live tracking link to your cell. Stay warm, Dave will see you first thing!", delayMs: 7400 }
    ]
  },
  {
    id: 'outbound-lead',
    type: 'outbound',
    title: '60-Second Meta Ad Lead Callback',
    industry: 'Commercial Lending & B2B',
    badge: 'Speed-to-Lead Outbound',
    description: 'Prospect submits a Facebook Ad form requesting a $150k equipment loan. KenjiAI dials them within 45 seconds while purchase intent is at peak.',
    latency: '440ms',
    crmAction: 'Qualified Lead tagged in GoHighLevel • Loan Officer calendar booked',
    dialog: [
      { speaker: 'agent', name: 'KenjiAI', text: "Hi David! This is Alex with Horizon Commercial Funding. I saw you just requested loan options on Facebook for commercial equipment—wanted to catch you while you were free!", delayMs: 100 },
      { speaker: 'caller', name: 'David (Applicant)', text: "Oh wow, that was fast! Yes, we need to finance two new CNC machines before end of quarter.", delayMs: 2400 },
      { speaker: 'agent', name: 'KenjiAI', text: "Fantastic. To verify your tier: is your business doing over forty thousand in monthly revenue, and have you been operating for at least eighteen months?", delayMs: 4200 },
      { speaker: 'caller', name: 'David (Applicant)', text: "Yes to both. We average about sixty-five thousand a month and have been open for four years.", delayMs: 6200 },
      { speaker: 'agent', name: 'KenjiAI', text: "You pre-qualify for our prime 6.4% rate. I'm locking in a fifteen-minute slot with our senior underwriter Tom tomorrow at 10 AM. Look out for the calendar invite in your email!", delayMs: 8200 }
    ]
  },
  {
    id: 'inbound-medspa',
    type: 'inbound',
    title: 'High-Ticket Aesthetic Consultation',
    industry: 'Med Spa & Aesthetics',
    badge: 'High-LTV Intake',
    description: 'Caller inquiring about a $3,500 laser skin rejuvenation package. AI handles pricing objections and collects consultation booking.',
    latency: '390ms',
    crmAction: 'Consultation confirmed in Boulevard • $100 deposit authorization sent',
    dialog: [
      { speaker: 'agent', name: 'KenjiAI', text: "Welcome to Bella Luce Medical Aesthetics! This is Chloe. How can I help you achieve your aesthetic goals today?", delayMs: 100 },
      { speaker: 'caller', name: 'Client (Rachel)', text: "Hi, I saw your Instagram ad for the Morpheus8 package. How much downtime should I expect, and what does the full series run?", delayMs: 2200 },
      { speaker: 'agent', name: 'KenjiAI', text: "Most clients experience just 24 to 48 hours of mild pinkness—you can wear makeup on day two! Our full physician-administered package is $2,800 for three sessions, which includes complimentary PRP treatment this month.", delayMs: 4100 },
      { speaker: 'caller', name: 'Client (Rachel)', text: "That sounds great. Do you have any afternoon consults available this Thursday?", delayMs: 6500 },
      { speaker: 'agent', name: 'KenjiAI', text: "I have 3:15 PM or 4:30 PM with Dr. Harris this Thursday. Which works better for your schedule Rachel?", delayMs: 8100 }
    ]
  },
  {
    id: 'outbound-reactivation',
    type: 'outbound',
    title: 'Dormant Client Database Reactivation',
    industry: 'Roofing & Solar',
    badge: 'Win-Back Campaign',
    description: 'KenjiAI dials a list of 400 past homeowners following a hail storm in their zip code, generating immediate estimates without ad spend.',
    latency: '450ms',
    crmAction: 'Inspection booked in Jobber • Hail Damage Claim folder created',
    dialog: [
      { speaker: 'agent', name: 'KenjiAI', text: "Hey Jason! It's Elena with Vanguard Roofing. We inspected your roof two years ago on Maple Drive. Following last night's hail storm in your neighborhood, our team is offering free 21-point drone inspections for past clients this week.", delayMs: 100 },
      { speaker: 'caller', name: 'Homeowner (Jason)', text: "Yeah, the hail was pretty crazy here last night. We heard loud thuds on the skylights. Is there any cost for the inspection?", delayMs: 2700 },
      { speaker: 'agent', name: 'KenjiAI', text: "100% free for past clients! Our drone captures high-res 4K imagery and generates a formal report you can hand straight to your insurance if there's roof bruising. We have an inspector on Maple Drive tomorrow at 11 AM—want me to add you to the route?", delayMs: 4800 },
      { speaker: 'caller', name: 'Homeowner (Jason)', text: "Yes please, 11 AM works perfect. Thanks Elena!", delayMs: 7200 },
      { speaker: 'agent', name: 'KenjiAI', text: "You're all set Jason. You'll get a text confirmation right now with our inspector's ETA. Have a wonderful day!", delayMs: 8800 }
    ]
  }
];

export const CallSimulator: React.FC = () => {
  const [activeType, setActiveType] = useState<'all' | 'inbound' | 'outbound'>('all');
  const [selectedScenario, setSelectedScenario] = useState<CallScenario>(SCENARIOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const filteredScenarios = SCENARIOS.filter(s => activeType === 'all' || s.type === activeType);

  const stopCall = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentLineIndex(-1);
  };

  const playLineSpeech = (text: string, speaker: 'agent' | 'caller') => {
    if (isAudioMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speaker === 'agent' ? 1.05 : 0.98;
      utterance.pitch = speaker === 'agent' ? 1.05 : 0.95;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Pick an English voice
        const enVoice = voices.find(v => v.lang.startsWith('en') && (speaker === 'agent' ? v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Natural') : true));
        if (enVoice) utterance.voice = enVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback silently to text animation
    }
  };

  const startCall = (scenario: CallScenario) => {
    stopCall();
    setIsPlaying(true);
    setCurrentLineIndex(0);
    playLineSpeech(scenario.dialog[0].text, scenario.dialog[0].speaker);

    scenario.dialog.forEach((line, index) => {
      if (index === 0) return;
      const t = setTimeout(() => {
        setCurrentLineIndex(index);
        playLineSpeech(line.text, line.speaker);
        if (index === scenario.dialog.length - 1) {
          const endT = setTimeout(() => {
            setIsPlaying(false);
          }, 3000);
          timeoutsRef.current.push(endT);
        }
      }, line.delayMs);
      timeoutsRef.current.push(t);
    });
  };

  useEffect(() => {
    return () => stopCall();
  }, []);

  const handleSelectScenario = (sc: CallScenario) => {
    stopCall();
    setSelectedScenario(sc);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" aria-labelledby="call-simulator-heading">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Telephony Demo
          </div>
          <h2 id="call-simulator-heading" className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Hear KenjiAI Inbound &amp; Outbound in Action
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Experience sub-500ms conversational reflexes. Test live scenarios for both 24/7 inbound receptionist answering and automated outbound lead dialing.
          </p>

          {/* Inbound vs Outbound Toggle */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800/80 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              All Scenarios
            </button>
            <button
              onClick={() => setActiveType('inbound')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === 'inbound'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-800/80 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              <PhoneIncoming className="w-3.5 h-3.5" />
              Inbound Reception (24/7)
            </button>
            <button
              onClick={() => setActiveType('outbound')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === 'outbound'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-800/80 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              <PhoneOutgoing className="w-3.5 h-3.5" />
              Outbound Speed-to-Lead
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Scenarios Selector (Left Column) */}
          <div className="lg:col-span-5 space-y-3">
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Select Real-World Use Case:
            </label>
            {filteredScenarios.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gray-800/90 border-blue-500 shadow-xl shadow-blue-500/15 ring-1 ring-blue-500/50'
                      : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      sc.type === 'inbound'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    }`}>
                      {sc.badge}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{sc.industry}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{sc.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{sc.description}</p>
                </div>
              );
            })}
          </div>

          {/* Live Call Console (Right Column) */}
          <div className="lg:col-span-7 bg-gray-950/90 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Top Telephony Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-gray-600'}`} />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isPlaying ? 'Live Call In Progress' : 'Call Engine Ready'}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {selectedScenario.type === 'inbound' ? 'Inbound SIP Trunk' : 'Outbound Dial Queue'} • {selectedScenario.industry}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md font-mono">
                  <Clock className="w-3 h-3" />
                  Latency: {selectedScenario.latency}
                </span>
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                  title={isAudioMuted ? 'Unmute Audio Voice' : 'Mute Audio Voice'}
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Audio Waveform Equalizer (When Active) */}
            <div className="h-10 bg-gray-900/60 rounded-xl border border-gray-800/80 px-4 flex items-center justify-between mb-6">
              <div className="flex items-center gap-1.5">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? {
                      height: [6, Math.floor(Math.random() * 24) + 6, 6]
                    } : { height: 6 }}
                    transition={{
                      duration: 0.4 + (i % 5) * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className={`w-1 rounded-full ${isPlaying ? 'bg-blue-400' : 'bg-gray-700'}`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                {isPlaying ? 'Full-Duplex Speech Active' : 'Press Play to Listen'}
              </span>
            </div>

            {/* Live Interactive Transcript */}
            <div className="space-y-4 mb-6 min-h-[260px] max-h-[340px] overflow-y-auto pr-2">
              {selectedScenario.dialog.map((line, idx) => {
                const isRevealed = currentLineIndex >= idx || !isPlaying;
                const isCurrent = currentLineIndex === idx && isPlaying;
                const isAgent = line.speaker === 'agent';

                if (!isRevealed && isPlaying) return null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-gray-400 font-semibold">
                      {isAgent ? (
                        <>
                          <Sparkles className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400">{line.name}</span>
                        </>
                      ) : (
                        <>
                          <span>{line.name}</span>
                        </>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isAgent
                          ? 'bg-blue-950/40 border border-blue-500/30 text-blue-100 rounded-tl-sm'
                          : 'bg-gray-800/80 border border-gray-700 text-gray-200 rounded-tr-sm'
                      } ${isCurrent ? 'ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/10' : ''}`}
                    >
                      {line.text}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CRM Confirmation Banner */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 mb-6 flex items-center gap-2.5 text-xs text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Real-Time CRM Sync:</strong> {selectedScenario.crmAction}</span>
            </div>

            {/* Call Controls & Conversion Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {isPlaying ? (
                <button
                  onClick={stopCall}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 text-xs font-bold transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  Stop Call
                </button>
              ) : (
                <button
                  onClick={() => startCall(selectedScenario)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Simulate Live Call
                </button>
              )}

              <a
                href="https://kenjiai.com/call-center-upgrade"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Deploy Inbound &amp; Outbound Call Center ($199–$399/mo)
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallSimulator;
