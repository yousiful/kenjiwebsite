import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FAQS = [
  {
    q: 'Is there a pitch at the end?',
    a: 'Yes. At the end I’ll invite you to book an onboarding call if it looks like a fit. The briefing stands on its own either way.',
  },
  {
    q: 'How is this different from a normal agency?',
    a: 'Most agencies get paid the same amount whether your ads work or not. That means their job isn’t to make you money, it’s to keep the invoice going out every month. We only get paid when it works for you.',
  },
  {
    q: 'What if I’m not spending $20K+/month yet?',
    a: 'This is built for businesses spending $20K+/month, or getting ready to. If you’re not there yet, this still shows you exactly what to build toward.',
  },
  {
    q: 'Do I need experience running ads?',
    a: 'You need to be spending real money on ads already, or be close to it. This isn’t a beginner course on how to launch your first campaign.',
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-white font-semibold text-sm sm:text-base">{q}</span>
        <span className="text-blue-400 text-xl flex-shrink-0">{open ? '–' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Shared below-the-video section for both webinar VSL A/B variants.
 * Keeps the pages identical outside the video, per the existing
 * "isolate the video as the only variable" A/B test design.
 */
export default function WebinarObjectionSection() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
        className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 mb-10 text-left"
      >
        <h2 className="text-white font-bold text-xl mb-3">The Retainer Trap</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-3">
          Most agencies get paid the same amount whether your ads work or not. Reports get prettier. Results
          don&apos;t.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          We switched to only getting paid when it works. A client&apos;s win became the only way we got paid
          too. That&apos;s the mechanism behind everything you just watched.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.0 }}
      >
        <h2 className="text-white font-bold text-lg mb-4 text-center">Before you book a call</h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((f) => (
            <AccordionItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
