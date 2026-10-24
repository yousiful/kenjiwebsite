import { Link } from 'react-router-dom';
import {
  BookOpen, Rocket, Phone, Mail, Users, MessageSquare, Megaphone, Filter, Globe, Workflow, Calendar,
  CreditCard, Settings, FileSignature, LayoutDashboard, Bell, BarChart3, Wrench, Smartphone, GraduationCap,
  Languages, ShieldCheck, Briefcase, Store, ShoppingCart, Award, UserCircle, Star, Plug, Database, Building2,
  ListChecks, Image, Bot, KanbanSquare, Braces, Contact,
} from 'lucide-react';
import { groupCategories } from './helpData';
import { HelpHead, HelpShell, HelpSearch, HelpStillStuck, useHelpIndex } from './HelpShared';

const ICONS: Record<string, typeof BookOpen> = {
  'getting-started': Rocket, 'phone-system': Phone, email: Mail, contacts: Contact, conversations: MessageSquare,
  marketing: Megaphone, 'opportunities-pipelines': Filter, sites: Globe, workflows: Workflow,
  'calendars-appointments': Calendar, payments: CreditCard, settings: Settings, 'documents-contracts': FileSignature,
  dashboards: LayoutDashboard, notifications: Bell, reporting: BarChart3, miscellaneous: Wrench,
  'mobile-desktop-app': Smartphone, 'memberships-communities': GraduationCap, internationalization: Languages,
  compliance: ShieldCheck, 'industry-guides': Briefcase, 'app-marketplace': Store, 'e-commerce-store': ShoppingCart,
  certificates: Award, 'client-portal': UserCircle, 'reputation-management-reviews': Star, integrations: Plug,
  'custom-objects': Database, companies: Building2, crm: Users, tasks: ListChecks, 'media-storage': Image,
  'ai-employee': Bot, 'project-management': KanbanSquare, 'merge-fields-custom-variables': Braces,
};

export default function HelpHomePage() {
  const { index, error } = useHelpIndex();
  const cats = index ? groupCategories(index) : [];

  return (
    <>
      <HelpHead title="Help Center | KenjiAI" description="Step-by-step guides for every part of your KenjiAI account: calendars, workflows, phone, email, funnels, payments and more." />
      <HelpShell>
        <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-emerald-400 font-semibold text-sm tracking-wide uppercase mb-3">KenjiAI Help Center</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-5">
            How can we <span className="text-emerald-400">help?</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 [text-wrap:balance]">
            Step-by-step guides for everything inside your KenjiAI account.
          </p>
          <HelpSearch index={index} autoFocus />
        </section>

        {error && (
          <p className="text-center text-gray-400">The help articles didn't load. Refresh the page, or email support@mediatraffics.com.</p>
        )}

        {!index && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse" />
            ))}
          </div>
        )}

        {index && (
          <section aria-labelledby="help-topics">
            <h2 id="help-topics" className="text-xl font-bold text-white mb-5">Browse by topic</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cats.map((c) => {
                const Icon = ICONS[c.slug] || BookOpen;
                return (
                  <Link
                    key={c.slug}
                    to={`/help/${c.slug}`}
                    className="group flex gap-4 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-[#10A37F]/70 p-5 transition-colors"
                  >
                    <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#10A37F]/15 text-emerald-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-white font-bold group-hover:text-emerald-400 transition-colors">{c.name}</span>
                      <span className="block text-sm text-gray-500 mt-0.5">{c.count} {c.count === 1 ? 'article' : 'articles'}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <HelpStillStuck />
      </HelpShell>
    </>
  );
}
