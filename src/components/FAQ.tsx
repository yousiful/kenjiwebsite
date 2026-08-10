import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What would all of this cost me if I hired it out?",
      answer: "Run the numbers: a marketing agency retainer is $3,000-$5,000/mo, an appointment setter is another $3,000/mo, a copywriter $2,000/mo, and the software stack underneath them $1,000+/mo. That's $9,000+ every month before your first sale. KenjiAI gives you the built website, the follow-up agents, the ads, and the team for $375/mo, about $12 a day and less than you'd tip a waiter. Our performance fee only exists when we actually make you money. Either it produces and pays for itself, or you use the guarantee and pay nothing. There's no version of this where you lose."
    },
    {
      question: "How fast does this pay for itself?",
      answer: "Your ads are live in week one, and your AI agents start calling and booking leads the moment they come in. One or two closed clients typically covers months of KenjiAI. And you're protected while you find out: if you use the system for 30 days and don't have more leads, more booked appointments, or more revenue than the day you signed up, we refund every dollar and you keep everything we built."
    },
    {
      question: "Do I have to get on a sales call to buy?",
      answer: "No. Pick a plan, enter your card, and you're inside the platform in under 90 seconds. Your onboarding call is scheduled automatically but it's optional. We built the self-serve flow because we got tired of watching real business owners get gatekept by demo theater."
    },
    {
      question: "How fast can I actually be up and running? I don't have time to learn another platform.",
      answer: "Most owners have their first funnel live within 2 hours of signup and their first ad campaign running within 24 hours. We migrate your contacts for you. We build your first three workflows for you. We write your first round of ad copy for you. If you can use Gmail you can run KenjiAI."
    },
    {
      question: "How is this different from cheap DIY software?",
      answer: "Cheap software hands you an empty login and wishes you luck. You still have to build the funnels, write the copy, set up the follow-up, and run the ads yourself, which is why most of those subscriptions get cancelled unused. Platforms in our class charge $300-$500/mo for software alone with zero services attached. KenjiAI includes the proven website build, the follow-up agents, the ad management, and a real team. The average customer cancels over $3,400/mo in other software within their first 30 days of joining."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Monthly plans can be cancelled anytime with no penalties or fees. Annual plans have a 30-day money-back guarantee. We never lock you into long-term contracts you can't get out of."
    },
    {
      question: "What if I'm not tech-savvy?",
      answer: "Perfect! That's exactly who we built this for. Our team does all the technical work. You just tell us what you want to accomplish, and we make it happen."
    },
    {
      question: "How do I know this will work for my business?",
      answer: "Over 500 businesses run on this system: agencies, CPAs, tax relief firms, coaches, contractors, and local services. The playbooks we install for you are the ones already producing sales in niches like yours, not experiments. If you want to see it mapped to your exact business first, book a free strategy call and we'll walk you through it. Either way, the 30-day guarantee means the risk sits with us, not you."
    },
    {
      question: "What's included in the setup?",
      answer: "Everything. Your CRM, automation workflows, voice AI agents, email and SMS campaigns, ad campaigns, funnels, and full team training. We handle it all so you can focus on serving your clients."
    },
    {
      question: "Do you offer a guarantee?",
      answer: "The strongest one we could write: use KenjiAI for 30 days, and if you don't have more leads, more booked appointments, or more revenue than the day you signed up, email us and we refund every dollar. No exit survey, no hoops, and you keep everything we built for you. The worst possible outcome of trying KenjiAI is a free website, free workflows, and free ad copy. That's why we call it a no-brainer."
    },
    {
      question: "How much time will this save me?",
      answer: "Most clients report saving 15-25 hours per week on tasks like follow-ups, lead management, scheduling, and customer communication. Your AI handles it 24/7 while you focus on growth."
    },
    {
      question: "What kind of support do I get?",
      answer: "You get a dedicated account manager, priority email support, live chat during business hours, a comprehensive knowledge base, and regular strategy calls. We're here to make sure you succeed."
    }
  ];

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 sm:py-20 px-4" style={{ backgroundColor: '#0B0E14' }}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold">Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about KenjiAI
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/60 rounded-2xl overflow-hidden hover:border-gray-600 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group"
              >
                <span className="text-white font-semibold text-base sm:text-lg flex-1 group-hover:text-blue-400 transition-colors">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-blue-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-6">
            Still have questions? We're here to help.
          </p>
          <a
            href="https://go.mediatraffics.com/leads"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)' }}
          >
            Book a Free Call
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
