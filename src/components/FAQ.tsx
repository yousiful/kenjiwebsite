import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly can I start using KenjiAI?",
      answer: "You can start immediately after signing up. Most clients are fully operational within 24-48 hours. Our team handles all the technical setup for you."
    },
    {
      question: "Do I need technical skills to use KenjiAI?",
      answer: "Not at all. KenjiAI is built for business owners, not developers. Our team sets everything up for you, and the platform is designed to be simple to use. Plus, we provide full training and support."
    },
    {
      question: "What makes KenjiAI different from other AI tools?",
      answer: "We don't just give you software and wish you luck. We handle the setup, run your ads, manage your automations, and provide ongoing support. You get a complete done-for-you service, not just a tool to figure out yourself."
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
      answer: "Book a free strategy call and we'll show you exactly how KenjiAI would work for your specific business. We'll walk through real examples and show you what results to expect. No pressure, no obligation."
    },
    {
      question: "What's included in the setup?",
      answer: "Everything. Your CRM, automation workflows, voice AI agents, email and SMS campaigns, ad campaigns, funnels, and full team training. We handle it all so you can focus on serving your clients."
    },
    {
      question: "Do you offer a guarantee?",
      answer: "Yes. 30-day money-back guarantee on all plans. If KenjiAI isn't right for you within the first 30 days, we'll refund your money. No questions, no hassle."
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

  return (
    <section className="py-16 sm:py-20 px-4" style={{ backgroundColor: '#0B0E14' }}>
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
