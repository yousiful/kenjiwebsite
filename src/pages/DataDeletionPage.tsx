import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
import { Trash2, Mail, Facebook, Clock } from 'lucide-react';

export default function DataDeletionPage() {
  return (
    <>
      <PageSchema path="/data-deletion" name={"Data Deletion Instructions"} description={"How to ask KenjiAI to delete the data we hold about you, including data received through Facebook and Instagram."} />
      <Helmet>
        <title>Data Deletion Instructions | KenjiAI</title>
        <meta name="description" content="How to ask KenjiAI to delete the data we hold about you, including data received through Facebook and Instagram." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://kenjiai.com/data-deletion" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trash2 className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Data Deletion Instructions</h1>
          </div>

          <p className="text-center text-gray-400 mb-8">Last Updated: October 28, 2026</p>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 space-y-8">
            <section>
              <p className="text-gray-300 leading-relaxed">
                KenjiAI (operated by Media Traffics LLC) uses Facebook and Instagram apps to publish posts, run ads and receive lead form submissions for us and our clients. You can ask us to delete any data we hold about you at any time.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Facebook className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Remove our app from your Facebook account</h2>
              </div>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Go to your Facebook <strong className="text-white">Settings &amp; privacy</strong>, then <strong className="text-white">Settings</strong>.</li>
                <li>Open <strong className="text-white">Apps and websites</strong>.</li>
                <li>Find the KenjiAI or Media Traffics app and click <strong className="text-white">Remove</strong>.</li>
              </ol>
              <p className="text-gray-300 leading-relaxed mt-4">
                This stops the app from receiving any new data from your account. To also delete what we already have, send the request below.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Ask us to delete your data</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-3">
                Email <a className="text-blue-400 underline" href="mailto:support@mediatraffics.com?subject=Data%20Deletion%20Request">support@mediatraffics.com</a> with the subject <strong className="text-white">"Data Deletion Request"</strong> and include:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Your full name</li>
                <li>The email address and phone number you used with us</li>
                <li>Your Facebook or Instagram name, if the data came from there</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We delete your contact record, form submissions, messages and any data received from Facebook or Instagram from our systems, including our CRM.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">What happens next</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                We confirm we received your request within 3 business days and finish the deletion within 30 days, then email you to confirm it is done. We only keep records the law requires us to keep, such as payment records for tax purposes.
              </p>
            </section>

            <section className="border-t border-gray-700 pt-6">
              <p className="text-gray-300"><strong className="text-white">Email:</strong> support@mediatraffics.com</p>
              <p className="text-gray-300 mt-2">See also our <a className="text-blue-400 underline" href="/privacy">Privacy Policy</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
