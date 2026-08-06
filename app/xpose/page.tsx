'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab, { XPOSE_DEFAULT_TASKS } from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, Mail } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'value-prop', label: 'Value Proposition', icon: TrendingUp },
  { id: 'icp', label: 'ICP Profile', icon: Target },
  { id: 'filters', label: 'Clay Filters', icon: Filter },
  { id: 'prompts', label: 'AI Prompts', icon: Code },
  { id: 'personas', label: 'Buyer Personas', icon: Users },
  { id: 'sequences', label: 'Email Sequences', icon: Mail },
  { id: 'campaigns', label: 'Campaigns', icon: Zap },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export default function XposePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('xpose', DEFAULT_STATUSES.xpose));

    // Check if user is admin
    const access = sessionStorage.getItem('clientAccess');
    let userIsAdmin = false;
    if (access) {
      try {
        const parsedAccess = JSON.parse(access);
        userIsAdmin = parsedAccess.includes('admin');
        setIsAdmin(userIsAdmin);
      } catch {
        setIsAdmin(false);
      }
    }

    // Internal tabs that should be hidden from non-admin users
    const internalTabs = ['filters', 'prompts'];

    // Read initial tab from URL pathname
    const path = window.location.pathname;
    const tabFromPath = path.split('/').pop();
    const validTab = tabs.find(t => t.id === tabFromPath);
    // Only set the tab if it's valid AND (user is admin OR it's not an internal tab)
    if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
      setActiveTab(validTab.id);
    }

    // Handle browser back/forward
    const handlePopState = () => {
      const path = window.location.pathname;
      const tabFromPath = path.split('/').pop();
      const validTab = tabs.find(t => t.id === tabFromPath);
      // Only set the tab if it's valid AND (user is admin OR it's not an internal tab)
      if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
        setActiveTab(validTab.id);
      } else {
        setActiveTab('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleStatusChange = (newStatus: ClientStatus) => {
    setStatus(newStatus);
    setClientStatus('xpose', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/xpose' : `/xpose/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  // Filter tabs based on admin access
  // Hide internal tabs (filters, prompts) from non-admin users
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts', 'personas'].includes(tab.id));


  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">X</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Xpose Solutions</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-slate-600">Cosmetic Dermatology & Aesthetics - Patient Coordination Systems</p>
            </div>
          </div>
          <a
            href="https://www.xposesolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Visit Website →
          </a>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#1a2647] text-[#1a2647] font-medium'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'value-prop' && <ValuePropTab />}
          {activeTab === 'icp' && <ICPTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'personas' && <PersonasTab />}
          {activeTab === 'sequences' && <SequencesTab clientId="xpose" />}
          {activeTab === 'campaigns' && <CampaignsTabGeneric />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="xpose" />
              <CampaignsTabDynamic clientId="xpose" />
            </>
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="xpose" defaultTasks={XPOSE_DEFAULT_TASKS} />
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

function OverviewTab() {
  return (
    <>
      <ContentSection title="Company Overview" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p>
            Xpose Solutions specializes in <strong>patient coordination infrastructure</strong> for cosmetic dermatology and aesthetics clinics.
            They operate as a systems partner that builds and manages the operational systems between patient inquiry and booked consultation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="Healthcare Technology" />
            <InfoCard label="Business Model" value="B2B SaaS" />
            <InfoCard label="Target Market" value="Cosmetic Dermatology & Aesthetics" />
            <InfoCard label="Geographic Focus" value="United States" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Core Offering" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Patient Coordination Engine</h4>
          <p>
            A comprehensive system that manages the critical gap between when a patient first shows interest
            and when they book their first appointment.
          </p>

          <div className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-medium text-slate-900 mb-2">The Problem They Solve:</p>
            <p className="text-slate-700">
              Specialty clinics are generating patient inquiries but losing them due to slow follow-up,
              unclear ownership of coordination tasks, disconnected tools, booking leakage, and front desk overwhelm.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Key Services" icon={<Users className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Multi-channel inquiry capture (website, calls, referrals, messages)</ListItem>
          <ListItem type="check">Automated patient management and follow-up workflows</ListItem>
          <ListItem type="check">Operational intelligence and conversion tracking</ListItem>
          <ListItem type="check">Integration with existing CRM platforms (no vendor replacement needed)</ListItem>
          <ListItem type="check">AI integration where it reduces friction</ListItem>
        </ul>
      </ContentSection>
    </>
  );
}

function ValuePropTab() {
  return (
    <>
      <ContentSection title="Value Propositions" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
              End-to-End Ownership Model
            </h4>
            <ul className="ml-10 space-y-1">
              <ListItem>Takes full responsibility for coordination process</ListItem>
              <ListItem>Outcome ownership, not just task delivery</ListItem>
              <ListItem>Clinic staff focus on patient care, not coordination</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
              Integration-First Approach
            </h4>
            <ul className="ml-10 space-y-1">
              <ListItem>No need to replace existing vendors</ListItem>
              <ListItem>Works with current systems and tools</ListItem>
              <ListItem>Minimal disruption to operations</ListItem>
              <ListItem>Complements existing marketing agencies</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
              <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
              Practical & Accessible
            </h4>
            <ul className="ml-10 space-y-1">
              <ListItem>Built for standard clinic operations teams</ListItem>
              <ListItem>No technical expertise required</ListItem>
              <ListItem>Easy implementation with low training burden</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">4</span>
              Stabilization Before Growth
            </h4>
            <ul className="ml-10 space-y-1">
              <ListItem>Improves existing systems first</ListItem>
              <ListItem>Reduces chaos before adding complexity</ListItem>
              <ListItem>Cleaner handoffs and reduced manual burden</ListItem>
              <ListItem>Operational stability over growth-at-all-costs</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Messaging Hooks" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="font-medium text-blue-900 mb-1">Inquiry Leakage Hook</p>
            <p className="text-blue-800 text-sm italic">"Already generating inquiries but losing them to slow follow-up?"</p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900 mb-1">Front Desk Overwhelm Hook</p>
            <p className="text-green-800 text-sm italic">"Your front desk drowning in coordination tasks?"</p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
            <p className="font-medium text-amber-900 mb-1">Conversion Gap Hook</p>
            <p className="text-amber-800 text-sm italic">"Spending on ads but losing momentum between inquiry and booking?"</p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
            <p className="font-medium text-purple-900 mb-1">ROI Hook</p>
            <p className="text-purple-800 text-sm italic">"Improve your marketing ROI without spending more on ads"</p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function ICPTab() {
  return (
    <>
      <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Primary Target</p>
            <p className="text-green-800">Private cosmetic dermatology and aesthetics clinics with 2-5 providers (5-15 staff)</p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Must-Have Characteristics:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Offers cosmetic/aesthetic procedures (Botox, fillers, lasers)</ListItem>
            <ListItem type="check">2-5 providers (MDs, PAs, NPs) with 5-15 total staff</ListItem>
            <ListItem type="check">Premium branding and clinical authority</ListItem>
            <ListItem type="check">Private practice (not hospital chains or large multi-location)</ListItem>
            <ListItem type="check">Already generating patient inquiries</ListItem>
            <ListItem type="check"><strong>Currently running paid ads</strong> (Google, Facebook, TikTok)</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Target Services Offered:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Botox & Injectables',
              'Dermal Fillers',
              'Laser Treatments',
              'Skin Rejuvenation',
              'Chemical Peels',
              'Microneedling',
              'Laser Hair Removal',
              'Cosmetic Dermatology',
              'Med Spa Services',
            ].map((specialty) => (
              <div key={specialty} className="bg-slate-100 px-3 py-2 rounded text-sm">
                {specialty}
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Red Flags (Disqualifiers)" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">Solo practitioners (single doctor, no staff)</ListItem>
          <ListItem type="cross">Pure medical dermatology only (rashes, moles, skin cancer - no cosmetic services)</ListItem>
          <ListItem type="cross">Large hospital systems or multi-location chains (20+ employees)</ListItem>
          <ListItem type="cross">Inactive or outdated websites</ListItem>
          <ListItem type="cross">Clinics not running any paid advertising</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Special Qualification Requirement" icon={<Filter className="w-5 h-5" />}>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="font-semibold text-amber-900 mb-2">Ad Platform Detection</p>
          <p className="text-amber-800">
            <strong>Critical Signal:</strong> The best match are clinics currently running ads on Google, Facebook, or TikTok.
            This indicates they are already generating inquiries and need help converting them.
          </p>
          <p className="text-amber-700 text-sm mt-2">
            Lead enrichment must detect if the clinic is using these advertising platforms.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <>
      <ContentSection title="Clay Search Criteria" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Location" value="United States (All States)" color="bg-blue-600 text-white" />
            <InfoCard label="Business Type" value="B2C Cosmetic Clinics" color="bg-blue-600 text-white" />
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Industry Filters:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Medical Practices',
              'Wellness and Fitness Services',
              'Health, Wellness and Fitness',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords:</h4>
          <CodeBlock code={`cosmetic dermatology OR aesthetic clinic OR med spa OR aesthetic dermatology OR skin rejuvenation OR injectables clinic OR laser clinic OR Botox clinic OR aesthetic medicine`} />

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size:</h4>
          <ul className="space-y-2">
            <ListItem>5-15 employees (matches 2-5 providers + support staff)</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Additional Filters:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Has active website with contact form</ListItem>
            <ListItem type="check">Active Instagram account (500+ followers preferred)</ListItem>
            <ListItem type="check">Running online ads (Google, Facebook, Instagram)</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-2">Technology Signals (High-Priority):</p>
            <p className="text-blue-800">
              Filter for clinics using: Google Ads, Facebook/Meta Ads, Instagram Business, online booking systems (Zocdoc, Acuity).
              These are strong buying signals indicating active patient acquisition efforts.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are an expert at analyzing cosmetic dermatology and aesthetics clinic websites to determine if they match our Ideal Customer Profile (ICP).

IDEAL CUSTOMER PROFILE:
- Specialty: Cosmetic dermatology, high-end aesthetics, med spas, aesthetic clinics, injectables clinics
- Services: Focus on cosmetic procedures (Botox, fillers, laser treatments, skin rejuvenation, aesthetic dermatology)
- Size: Private practices with 2-5 providers (MDs, PAs, NPs) and approximately 5-15 staff members
- Vibe: Premium, clinical authority, professional branding

DISQUALIFIERS:
- Solo practitioners (single doctor, no staff)
- Pure medical dermatology only (rashes, moles, skin cancer screening without cosmetic services)
- Large hospital systems or multi-location chains (20+ employees)
- Inactive or outdated websites

ANALYZE THE WEBSITE FOR:
1. Services Offered: Do they offer cosmetic/aesthetic procedures? (Botox, fillers, lasers, skin rejuvenation)
2. Team Size: How many providers are listed? (doctors, PAs, NPs)
3. Clinic Type: Is this a private practice or part of a large hospital/chain?
4. Branding & Vibe: Is the website modern and positioned as a premium aesthetic/cosmetic provider?

OUTPUT FORMAT:
**ICP Match:** [Yes or No]
**Reasoning:** [2-3 sentences explaining why, citing specific evidence from the website]
**Confidence:** [High / Medium / Low]
**Key Signals:**
- Services: [List cosmetic services offered]
- Team Size: [Estimated number of providers]
- Clinic Type: [Private practice, med spa, hospital system, etc.]
- Red Flags: [Any disqualifiers noted]`;

  const adDetectionPrompt = `Check if this clinic is running paid advertising campaigns.

DETECTION SIGNALS:
- Google Ads: Check for ad spend indicators, PPC campaigns
- Facebook/Instagram Ads: Social media advertising presence
- TikTok Ads: TikTok advertising campaigns

OUTPUT:
- Running Ads: Yes / No / Unsure
- Platforms: List detected platforms
- Confidence: High / Medium / Low`;

  return (
    <>
      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze clinic websites and determine if they match Xpose's ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Ad Platform Detection Prompt" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt/enrichment detects if a clinic is running paid ads (critical qualification signal).
          </p>
          <CodeBlock code={adDetectionPrompt} language="text" />
        </div>
      </ContentSection>
    </>
  );
}

function PersonasTab() {
  return (
    <>
      <ContentSection title="Buyer Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Primary Target</p>
            <p className="text-blue-800 text-sm">
              For cosmetic dermatology practices (5-15 employees), target founders, owners, and medical directors who own or operate the practice.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Job Titles:</h4>
            <ul className="ml-4 space-y-2">
              <ListItem>Practice Owner</ListItem>
              <ListItem>Founder</ListItem>
              <ListItem>Medical Director</ListItem>
              <ListItem>Managing Director</ListItem>
              <ListItem>Practice Manager (if owner not available)</ListItem>
              <ListItem>Chief Medical Officer</ListItem>
              <ListItem>Board-Certified Dermatologist (if solo or partner)</ListItem>
            </ul>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded mt-4">
            <p className="font-semibold text-slate-900 mb-2">Why These Personas:</p>
            <p className="text-slate-700 text-sm">
              These are the decision-makers who control patient acquisition processes and can authorize new systems.
              They are experiencing the pain points Xpose solves (inquiry leakage, booking gaps, front desk overwhelm).
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Apollo Enrichment Settings" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-2">Required Fields:</h4>
          <ul className="space-y-2">
            <ListItem type="check">First Name</ListItem>
            <ListItem type="check">Last Name</ListItem>
            <ListItem type="check">Job Title</ListItem>
            <ListItem type="check">Email Address</ListItem>
            <ListItem type="check">LinkedIn URL</ListItem>
            <ListItem type="check">Company Name</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-1">Note:</p>
            <p className="text-blue-800 text-sm">
              Use Apollo enrichment first (1 credit per contact). Only use Clay waterfall if Apollo doesn't provide enough emails (more expensive at 5-6 credits).
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
