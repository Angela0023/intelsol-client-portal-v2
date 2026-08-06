'use client';

import { ContentSection } from './ContentSection';
import { Zap, FileText, AlertCircle } from 'lucide-react';

export default function CampaignsTabGeneric() {
  return (
    <>
      <ContentSection title="Campaign Planning & Strategy" icon={<Zap className="w-5 h-5" />}>
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-indigo-900 text-lg mb-2">Campaign Guidelines Coming Soon</h3>
              <p className="text-indigo-800 text-sm mb-4">
                This tab will contain campaign planning guidelines, target audience strategies, messaging frameworks, and sequencing rules specific to your ICP.
              </p>
              <p className="text-indigo-700 text-sm">
                For now, refer to the <strong>ICP Profile</strong>, <strong>Buyer Personas</strong>, and <strong>Email Sequences</strong> tabs for campaign planning guidance.
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Pre-Launch Checklist" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-3">Before launching any campaign:</p>
            <ul className="space-y-2 text-violet-800 text-sm">
              <li>• <strong>All copy approved:</strong> Email sequences finalized and reviewed</li>
              <li>• <strong>Lead list validated:</strong> Sample validated for accuracy and ICP match</li>
              <li>• <strong>Targeting filters confirmed:</strong> Filters match ICP criteria exactly</li>
              <li>• <strong>Buying signals prioritized:</strong> Leads sorted by signal strength (Strong → Medium → Weak)</li>
              <li>• <strong>Technical setup complete:</strong> Sending infrastructure, domain warmup, inbox rotation configured</li>
            </ul>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-3">Within-Account Sequencing (Universal Rule):</p>
            <ul className="space-y-2 text-amber-800 text-sm">
              <li>• <strong>Sequence, don't blast:</strong> Contact one person per account at a time, not multiple people in parallel</li>
              <li>• <strong>Wait 2-3 weeks:</strong> Allow time for response before moving to next persona in the same account</li>
              <li>• <strong>Escalate strategically:</strong> Start with decision-makers or operators depending on company size and signal strength</li>
              <li>• <strong>Track engagement:</strong> Note which personas respond best for future targeting optimization</li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
