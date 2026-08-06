'use client';

import { ContentSection } from '../components/ContentSection';
import { Zap, Target, FileText, Gift, CheckCircle } from 'lucide-react';

export default function CampaignsTabContent() {
  return (
    <>
      <ContentSection title="Campaign Structure by Segment" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-6">
          {/* Segment A: Manufacturing */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <h3 className="font-bold text-blue-900 text-lg mb-4">Segment A: Manufacturing Campaigns</h3>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="font-semibold text-blue-800 mb-2">Campaign 1A: Track 1 (Planning & S&OP)</p>
                <ul className="space-y-1 text-blue-700 text-sm ml-4">
                  <li>• <strong>Target Size:</strong> $300M–$1B companies</li>
                  <li>• <strong>Personas:</strong> Director/Sr. Manager of Supply Chain, Demand Planning, Supply Planning, S&OP/IBP</li>
                  <li>• <strong>Messaging Angle:</strong> Forecast accuracy, S&OP maturity, planning-cycle speed, decision lag</li>
                  <li>• <strong>Sequence:</strong> 3-email sequence (see Email Sequences tab)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="font-semibold text-blue-800 mb-2">Campaign 1B: Track 2 (Ops Floor)</p>
                <ul className="space-y-1 text-blue-700 text-sm ml-4">
                  <li>• <strong>Target Size:</strong> $100M–$300M companies</li>
                  <li>• <strong>Personas:</strong> Master Scheduler, Production Planning/Control, Materials Manager, Plant Manager</li>
                  <li>• <strong>Messaging Angle:</strong> Shortages, expedites, schedule stability, MRP noise (operational language, NOT corporate S&OP framing)</li>
                  <li>• <strong>Sequence:</strong> 3-email sequence (see Email Sequences tab)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="font-semibold text-blue-800 mb-2">Campaign 1C: Track 3 (Executives)</p>
                <ul className="space-y-1 text-blue-700 text-sm ml-4">
                  <li>• <strong>Target Size:</strong> All sizes</li>
                  <li>• <strong>Personas:</strong> VP Supply Chain, VP Operations, COO (at $100M-$300M companies)</li>
                  <li>• <strong>Messaging Angle:</strong> Working capital optimization, service levels at scale, planning as competitive capability</li>
                  <li>• <strong>Volume:</strong> Light volume, peer tone</li>
                  <li>• <strong>Sequence:</strong> 3-email sequence (see Email Sequences tab)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Segment B: Non-Manufacturing */}
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
            <h3 className="font-bold text-purple-900 text-lg mb-4">Segment B: Non-Manufacturing Campaigns</h3>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded border border-purple-200">
                <p className="font-semibold text-purple-800 mb-2">Campaign 2A: Track 4 (Planning & Inventory)</p>
                <ul className="space-y-1 text-purple-700 text-sm ml-4">
                  <li>• <strong>Target Size:</strong> All sizes</li>
                  <li>• <strong>Personas:</strong> Demand/Inventory/Merch Planning, Replenishment Manager, Supply Chain Dir/Sr. Mgr (retail/distribution)</li>
                  <li>• <strong>Messaging Angle:</strong> Inventory turnover optimization, stockout reduction without excess carrying costs, seasonal/promotional SKUs</li>
                  <li>• <strong>Sequence:</strong> 3-email sequence (see Email Sequences tab)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border border-purple-200">
                <p className="font-semibold text-purple-800 mb-2">Campaign 2B: Track 5 (Ops Leadership)</p>
                <ul className="space-y-1 text-purple-700 text-sm ml-4">
                  <li>• <strong>Target Size:</strong> &lt;$300M or no planning title available</li>
                  <li>• <strong>Personas:</strong> VP Operations (retail/distribution/CPG), GM, COO, Director of Operations</li>
                  <li>• <strong>Messaging Angle:</strong> Service level management (OTIF), working capital optimization, multi-location inventory balancing</li>
                  <li>• <strong>Sequence:</strong> 3-email sequence (see Email Sequences tab)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cross-Segment: ERP/IT */}
          <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Cross-Segment Campaign</h3>

            <div className="bg-white p-4 rounded border border-slate-200">
              <p className="font-semibold text-slate-800 mb-2">Campaign IT: Tier 4 (ERP/IT System Owners)</p>
              <ul className="space-y-1 text-slate-700 text-sm ml-4">
                <li>• <strong>Applies To:</strong> All qualified accounts (both Manufacturing and Non-Manufacturing)</li>
                <li>• <strong>Personas:</strong> IT Manager, IT Director, ERP Manager/Project Manager, Business Systems Manager, CIO (smaller companies)</li>
                <li>• <strong>Messaging Angle:</strong> AI planning layer on existing ERP, no rip-and-replace, no new master data project, IT-light deployment</li>
                <li>• <strong>Timing:</strong> Separate sequence for all qualified accounts</li>
                <li>• <strong>Sequence:</strong> 3-email sequence (see Email Sequences tab)</li>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Within-Account Sequencing Strategy" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-3">Segment A (Manufacturing) - Sequencing Rules:</p>
            <ul className="space-y-2 text-amber-800 text-sm">
              <li>• <strong>Small accounts ($100M–$300M):</strong> Start with Track 2 (Ops Floor). These titles own day-to-day planning pain.</li>
              <li>• <strong>Larger accounts ($300M–$1B):</strong> Start with Track 1 (Corporate Planning). These companies have dedicated planning functions.</li>
              <li>• <strong>No planning title found:</strong> Start with Tier 4 (ERP/IT) to find entry point.</li>
              <li>• <strong>Track 3 (Executives):</strong> Only after Track 1 or Track 2 fails to respond OR when strong buying signal (hiring planner, ERP project, funding announcement).</li>
              <li>• <strong>Rule:</strong> Sequence contacts at the same account rather than emailing several in parallel. Wait 2 weeks before moving to next persona.</li>
            </ul>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <p className="font-semibold text-indigo-900 mb-3">Segment B (Non-Manufacturing) - Sequencing Rules:</p>
            <ul className="space-y-2 text-indigo-800 text-sm">
              <li>• <strong>Start with Track 4 (Planning & Inventory):</strong> If company has a dedicated demand/inventory planning title.</li>
              <li>• <strong>Start with Track 5 (Ops Leadership):</strong> If no planning title found OR company &lt;$300M revenue.</li>
              <li>• <strong>No planning or ops title found:</strong> Start with Tier 4 (ERP/IT).</li>
              <li>• <strong>Track 5 (Ops Leadership):</strong> Only after Track 4 fails to respond OR when strong buying signal.</li>
              <li>• <strong>Rule:</strong> Sequence contacts at the same account rather than emailing several in parallel. Wait 2 weeks before moving to next persona.</li>
            </ul>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Pre-Launch Requirements:</p>
            <ul className="space-y-1 text-violet-800 text-sm">
              <li>• All copy approved by Plantryx</li>
              <li>• 100-lead validation sample approved (see validation workflow below)</li>
              <li>• Leads prioritized by buying signal strength (Strong &gt; Medium &gt; Weak)</li>
              <li>• Email sequences finalized (see Email Sequences tab)</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="CTA Options for Outreach" icon={<Gift className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 font-semibold mb-2">Two Low-Friction CTAs Available:</p>
            <p className="text-blue-800 text-sm mb-4">
              Both CTAs provide value upfront (no hard sell), qualify interest level, educate prospects on planning gaps, and warm leads before requesting a call.
            </p>
          </div>

          {/* CTA Option 1: Planning Maturity Diagnostic */}
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
            <h3 className="font-bold text-green-900 text-lg mb-3">CTA Option 1: Planning Maturity Diagnostic</h3>
            <p className="text-green-800 text-sm mb-4">
              A <strong>5-minute self-assessment tool</strong> that benchmarks a company's planning process across key dimensions.
            </p>

            <div className="bg-white p-4 rounded border border-green-200 mb-4">
              <p className="font-semibold text-green-800 mb-2">Key Features:</p>
              <ul className="space-y-1 text-green-700 text-sm ml-4">
                <li>• Ungated - No form required to access</li>
                <li>• Instant Results - Immediate scoring and benchmarking</li>
                <li>• Self-Assessment - Prospect answers questions themselves</li>
                <li>• Peer Benchmarking - Results compared to industry peers</li>
                <li>• No Sales Pitch - Diagnostic value stands alone</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-green-200">
              <p className="font-semibold text-green-800 mb-3">Assessment Dimensions (5 total):</p>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-green-700 text-sm mb-1">1. Forecast Accuracy</p>
                  <p className="text-green-600 text-xs ml-4">MAPE %, forecast revision frequency, forecasting tools used</p>
                </div>

                <div>
                  <p className="font-medium text-green-700 text-sm mb-1">2. Planning Cycle Speed</p>
                  <p className="text-green-600 text-xs ml-4">S&OP cycle duration, data prep vs. analysis time, disruption response speed</p>
                </div>

                <div>
                  <p className="font-medium text-green-700 text-sm mb-1">3. Inventory Optimization</p>
                  <p className="text-green-600 text-xs ml-4">Inventory turnover ratio, safety stock methodology, SKU concentration</p>
                </div>

                <div>
                  <p className="font-medium text-green-700 text-sm mb-1">4. Exception Management</p>
                  <p className="text-green-600 text-xs ml-4">Time spent on exceptions, noise filtering, firefighting frequency</p>
                </div>

                <div>
                  <p className="font-medium text-green-700 text-sm mb-1">5. System Integration & Data Quality</p>
                  <p className="text-green-600 text-xs ml-4">System integration level, manual data handling, data trust level</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-green-200 mt-4">
              <p className="font-semibold text-green-800 mb-2">Scoring System:</p>
              <ul className="space-y-1 text-green-700 text-sm ml-4">
                <li>• <strong>60 points max</strong> (15 questions × 4 points each)</li>
                <li>• <strong>50-60 points:</strong> World-Class Planning</li>
                <li>• <strong>40-49 points:</strong> Optimized Planning</li>
                <li>• <strong>30-39 points:</strong> Developing Planning</li>
                <li>• <strong>20-29 points:</strong> Basic Planning</li>
                <li>• <strong>&lt;20 points:</strong> Reactive Planning</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-green-200 mt-4">
              <p className="font-semibold text-green-800 mb-2">How to Use in Outreach:</p>
              <p className="text-green-700 text-sm">
                Offer the diagnostic in Email 2 of each sequence (see Email Sequences tab). Example: "We built a 5-minute Planning Maturity Assessment that most [persona type] find useful even if they're not evaluating tools at the moment. No forms, no pitch, just a quick snapshot. Want me to send it over?"
              </p>
            </div>
          </div>

          {/* CTA Option 2: Short Demo Video */}
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
            <h3 className="font-bold text-purple-900 text-lg mb-3">CTA Option 2: Short Demo Video</h3>
            <p className="text-purple-800 text-sm mb-4">
              A <strong>2-3 minute product demo video</strong> tailored to specific persona pain points.
            </p>

            <div className="bg-white p-4 rounded border border-purple-200 mb-4">
              <p className="font-semibold text-purple-800 mb-2">Video Structure:</p>
              <ul className="space-y-1 text-purple-700 text-sm ml-4">
                <li>• <strong>Intro (15 sec):</strong> "You're [persona], here's the problem you likely face"</li>
                <li>• <strong>Demo (2 min):</strong> Show Plantryx solving that specific problem</li>
                <li>• <strong>Outro (15 sec):</strong> "Want to see how this works for [Company Name]? Book a 20-min call"</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-purple-200">
              <p className="font-semibold text-purple-800 mb-3">6 Persona-Specific Video Variations:</p>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-purple-700 text-sm mb-1">Track 1: S&OP Cycle Compression</p>
                  <p className="text-purple-600 text-xs ml-4">Show: S&OP cycle running continuously, not monthly. Decision lag reduced from weeks to hours.</p>
                </div>

                <div>
                  <p className="font-medium text-purple-700 text-sm mb-1">Track 2: MRP Noise Reduction</p>
                  <p className="text-purple-600 text-xs ml-4">Show: AI filtering MRP exceptions, reducing 200 flags to 30 real issues.</p>
                </div>

                <div>
                  <p className="font-medium text-purple-700 text-sm mb-1">Track 3: Working Capital Optimization</p>
                  <p className="text-purple-600 text-xs ml-4">Show: Inventory optimization across SKUs, balancing service levels with lower carrying costs.</p>
                </div>

                <div>
                  <p className="font-medium text-purple-700 text-sm mb-1">Track 4: High-Variability SKU Optimization</p>
                  <p className="text-purple-600 text-xs ml-4">Show: AI handling seasonal/promotional SKU forecasting, adapting to retail volatility.</p>
                </div>

                <div>
                  <p className="font-medium text-purple-700 text-sm mb-1">Track 5: Multi-Location Inventory Balancing</p>
                  <p className="text-purple-600 text-xs ml-4">Show: SKU-location level demand forecasting with automated transfer recommendations.</p>
                </div>

                <div>
                  <p className="font-medium text-purple-700 text-sm mb-1">Tier 4: ERP API Integration</p>
                  <p className="text-purple-600 text-xs ml-4">Show: Plantryx reading from ERP, running AI planning, writing back to ERP. No rip-and-replace.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-purple-200 mt-4">
              <p className="font-semibold text-purple-800 mb-2">How to Use in Outreach:</p>
              <p className="text-purple-700 text-sm">
                Offer the video in Email 2 or Email 3 of each sequence as an alternative to the Planning Maturity Diagnostic. Example: "I recorded a quick 2-minute demo showing how Plantryx handles [specific pain point for that persona]. Want me to send it over?"
              </p>
            </div>
          </div>

          {/* Using Both CTAs */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">Using Both CTAs Together:</p>
            <ul className="space-y-2 text-amber-800 text-sm">
              <li>• <strong>Conservative Approach:</strong> Offer diagnostic in Email 2, demo video in Email 3 (if no response)</li>
              <li>• <strong>Aggressive Approach:</strong> Offer both in Email 2 ("I can send a quick diagnostic OR a 2-min demo, whichever you prefer")</li>
              <li>• <strong>Persona-Specific:</strong>
                <ul className="ml-4 mt-1 space-y-1 text-amber-700 text-xs">
                  <li>→ Ops Floor (Track 2): Prefer demo video (more visual, less time)</li>
                  <li>→ Planning (Tracks 1, 4): Prefer diagnostic (analytical mindset)</li>
                  <li>→ Executives (Tracks 3, 5): Offer both, let them choose</li>
                  <li>→ IT (Tier 4): Prefer demo video (technical integration focus)</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="100-Lead Validation Workflow" icon={<CheckCircle className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-indigo-900 font-semibold mb-2">Purpose:</p>
            <p className="text-indigo-800 text-sm">
              Once new ICPs are loaded (Segment A Manufacturing + Segment B Non-Manufacturing), validate a random sample of 100 leads to ensure list quality, segment accuracy, valid contact data, and proper targeting filters.
            </p>
            <p className="text-indigo-900 font-semibold mt-3 mb-1">Goal: 80%+ pass rate before scaling volume</p>
          </div>

          {/* Phase 1: Sample Selection */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <h3 className="font-bold text-blue-900 mb-3">Phase 1: Sample Selection (30 min)</h3>

            <div className="bg-white p-4 rounded border border-blue-200 mb-4">
              <p className="font-semibold text-blue-800 mb-2">Recommended Distribution:</p>
              <ul className="space-y-1 text-blue-700 text-sm ml-4">
                <li>• <strong>60 leads</strong> from Segment A (Manufacturing)</li>
                <li>• <strong>40 leads</strong> from Segment B (Non-Manufacturing)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-blue-200">
              <p className="font-semibold text-blue-800 mb-2">Within Segment A (60 leads):</p>
              <ul className="space-y-1 text-blue-700 text-sm ml-4">
                <li>• 25 leads: Track 1 (Planning & S&OP)</li>
                <li>• 25 leads: Track 2 (Ops Floor)</li>
                <li>• 10 leads: Track 3 (Executives)</li>
              </ul>
              <p className="font-semibold text-blue-800 mt-3 mb-2">Within Segment B (40 leads):</p>
              <ul className="space-y-1 text-blue-700 text-sm ml-4">
                <li>• 25 leads: Track 4 (Planning & Inventory)</li>
                <li>• 15 leads: Track 5 (Ops Leadership)</li>
              </ul>
            </div>
          </div>

          {/* Phase 2: Validation Process */}
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
            <h3 className="font-bold text-green-900 mb-3">Phase 2: Validation Process (6-8 hours)</h3>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="font-semibold text-green-800 mb-2">Company-Level Validation:</p>
                <ul className="space-y-1 text-green-700 text-sm ml-4">
                  <li>• <strong>Revenue Check:</strong> Verify company is in $100M–$1B USD range (use LinkedIn employee count as proxy if needed)</li>
                  <li>• <strong>Geography Check:</strong> Confirm company is in target countries (US, Canada, UK, Germany, Sweden, Netherlands, Belgium, Norway, Denmark, Switzerland, Austria)</li>
                  <li>• <strong>Vertical Match:</strong>
                    <ul className="ml-4 mt-1 space-y-1 text-green-600 text-xs">
                      <li>→ Segment A: Manufacturing (electrical equipment, industrial machinery, automation, food production, chemicals)</li>
                      <li>→ Segment B: Non-Manufacturing (retail, e-commerce, CPG, distribution, wholesale)</li>
                    </ul>
                  </li>
                  <li>• <strong>ERP Confirmation:</strong> Verify company uses one of target ERPs: SAP, Microsoft Dynamics 365, Epicor, Infor, IFS, QAD, Oracle NetSuite, SYSPRO (check job postings, website, LinkedIn profiles)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border border-green-200">
                <p className="font-semibold text-green-800 mb-2">Contact-Level Validation:</p>
                <ul className="space-y-1 text-green-700 text-sm ml-4">
                  <li>• <strong>Title Match:</strong> Verify contact title matches assigned track (see ICP Profile tab for title lists)</li>
                  <li>• <strong>LinkedIn Active:</strong> Confirm LinkedIn profile is accessible and updated recently (within last 12 months)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border border-green-200">
                <p className="font-semibold text-green-800 mb-2">Bonus: Buying Signals Check (Optional):</p>
                <ul className="space-y-1 text-green-700 text-sm ml-4">
                  <li>• <strong>Strong Signals:</strong> Hiring for planner/supply chain roles, recent ERP implementation/upgrade, funding announcement, recent acquisition/merger</li>
                  <li>• <strong>Medium Signals:</strong> Public complaints about planning/supply chain, industry awards/recognition, trade show participation</li>
                  <li>• Note any signals found during validation (helps with prioritization later)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phase 3: Scoring and Action */}
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
            <h3 className="font-bold text-purple-900 mb-3">Phase 3: Scoring and Action (1 hour)</h3>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded border border-purple-200">
                <p className="font-semibold text-purple-800 mb-2">Calculate Pass Rate:</p>
                <p className="text-purple-700 text-sm mb-2">
                  Count leads that pass ALL validation criteria (company revenue, geography, vertical, ERP system, contact title match, LinkedIn active).
                </p>
                <p className="text-purple-700 text-sm font-mono">Pass Rate = (Passed Leads / 100) × 100%</p>
              </div>

              <div className="bg-white p-4 rounded border border-purple-200">
                <p className="font-semibold text-purple-800 mb-3">Action Based on Results:</p>

                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-purple-700 text-sm mb-1">✅ Scenario A: 80%+ Pass Rate</p>
                    <p className="text-purple-600 text-xs ml-4"><strong>Action:</strong> Approve list and proceed with campaign launch. Prioritize leads with Strong &gt; Medium &gt; Weak buying signals.</p>
                  </div>

                  <div>
                    <p className="font-medium text-purple-700 text-sm mb-1">⚠️ Scenario B: 70-79% Pass Rate</p>
                    <p className="text-purple-600 text-xs ml-4"><strong>Action:</strong> Adjust targeting filters to address most common failure reasons. Validate another 50-lead sample to confirm improvement before full launch.</p>
                  </div>

                  <div>
                    <p className="font-medium text-purple-700 text-sm mb-1">❌ Scenario C: &lt;70% Pass Rate</p>
                    <p className="text-purple-600 text-xs ml-4"><strong>Action:</strong> Pause campaign launch. Review ICP criteria and targeting filters. Major revision needed before proceeding.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-purple-200">
                <p className="font-semibold text-purple-800 mb-2">Common Failure Reasons to Track:</p>
                <ul className="space-y-1 text-purple-700 text-sm ml-4">
                  <li>• Revenue out of range (too small or too large)</li>
                  <li>• Wrong geography (outside target countries)</li>
                  <li>• Wrong vertical (doesn't match Segment A or B criteria)</li>
                  <li>• ERP system not confirmed or wrong system</li>
                  <li>• Title mismatch (contact doesn't match assigned track)</li>
                  <li>• LinkedIn profile inactive or inaccessible</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">Time Breakdown:</p>
            <ul className="space-y-1 text-amber-800 text-sm ml-4">
              <li>• Phase 1 (Sample Selection): 30 minutes</li>
              <li>• Phase 2 (Validation Process): 6-8 hours</li>
              <li>• Phase 3 (Scoring and Action): 1 hour</li>
              <li>• <strong>Total:</strong> 8-10 hours</li>
            </ul>
            <p className="text-amber-700 text-xs mt-3">
              Recommendation: Conduct validation 1-2 weeks after lead loading to allow time for thorough research and avoid rushing.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
