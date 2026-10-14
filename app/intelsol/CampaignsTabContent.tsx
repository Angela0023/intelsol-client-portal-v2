'use client';

import { ContentSection } from '../components/ContentSection';
import { Zap, Target, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function CampaignsTabContent() {
  return (
    <>
      <ContentSection title="Selekcija.hr - Campaign Targeting Matrix" icon={<Target className="w-5 h-5" />}>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">HARD RULE - Exact Targeting Instructions</h3>
              <p className="text-blue-800 text-sm">
                This matrix defines exactly which positions to target for which companies and which email sequences to send to who. Follow these instructions precisely for Selekcija.hr campaigns.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
            <h3 className="font-bold text-green-900 text-xl mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              SEQUENCE 1: EMPLOYERS (Tier 1 + Tier 2)
            </h3>

            <div className="mb-4">
              <p className="font-semibold text-green-900 mb-2">Companies:</p>
              <ul className="text-green-800 text-sm space-y-1 ml-4">
                <li>• Banking, Insurance, Financial Services</li>
                <li>• Pharmaceuticals, Life Sciences, Healthcare</li>
                <li>• IT, ICT, Technology, Engineering</li>
                <li>• Telecommunications</li>
                <li>• Professional Services (Consulting, Legal, Accounting, Audit)</li>
                <li>• Manufacturing</li>
                <li>• Retail, Distribution</li>
                <li>• Logistics, Transportation</li>
                <li>• Hospitality</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-green-900 mb-2">Company Size:</p>
              <p className="text-green-800 text-sm ml-4">50-2,000 employees (sweet spot 100-1,000)</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-green-900 mb-2">Total Volume:</p>
              <p className="text-green-800 text-sm ml-4">~150-200 companies</p>
            </div>

            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <h4 className="font-bold text-green-900 mb-3">PRIMARY TARGETS (Send to ALL of these):</h4>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Position Category 1: HR Leadership</p>
                  <p className="text-sm text-gray-700 mb-1">HR Director, Head of HR, HR Manager, Direktor kadrovske službe, Vodja kadrovske službe</p>
                  <p className="text-xs text-gray-600 italic">WHY: Sponsor for selection process and budget owner</p>
                  <p className="text-xs text-green-700 font-semibold">Message Angle: "Improve recruitment decisions with structured psychometric assessment"</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-1">Position Category 2: Recruitment / Talent Acquisition</p>
                  <p className="text-sm text-gray-700 mb-1">Head of Recruitment, Head of Talent Acquisition, TA Manager, Recruitment Manager, Vodja zaposlovanja, Specialist za zaposlovanje</p>
                  <p className="text-xs text-gray-600 italic">WHY: Owns candidate workflow and evaluates practical fit</p>
                  <p className="text-xs text-green-700 font-semibold">Message Angle: "Organize assessment and support consistent candidate evaluation"</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-1">Position Category 3: Organizational Psychology / Assessment</p>
                  <p className="text-sm text-gray-700 mb-1">Organizational Psychologist, Organizacijski psiholog, Assessment Lead, Vodja ocenjevanja, People Scientist</p>
                  <p className="text-xs text-gray-600 italic">WHY: Validates instruments, interpretation, and role relevance - technical champion</p>
                  <p className="text-xs text-green-700 font-semibold">Message Angle: "Discuss instrument choice, norms, and interpretation for Slovenian context"</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <h4 className="font-bold text-amber-900 mb-3">TARGETING STRATEGY:</h4>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-amber-900">For companies 100-1,000 employees (MAJORITY):</p>
                  <ol className="text-amber-800 ml-4 mt-1 space-y-1">
                    <li>1. Find and target: HR Leadership (HR Director, Head of HR)</li>
                    <li>2. Find and target: Recruitment/TA (Head of Recruitment, TA Manager)</li>
                    <li>3. Find and target: Organizational Psychologist (if exists)</li>
                    <li>4. Send ALL three to SAME sequence (different people, same company, same message)</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold text-amber-900">For companies 50-100 employees (SMALLER):</p>
                  <ol className="text-amber-800 ml-4 mt-1 space-y-1">
                    <li>1. Find and target: HR Manager OR Owner/Director (whoever owns recruitment)</li>
                    <li>2. Find and target: Recruiter OR Recruitment Lead</li>
                    <li>3. Skip Organizational Psychologist (less likely to exist at this size)</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold text-amber-900">For companies 1,001-2,000 employees (LARGER):</p>
                  <ol className="text-amber-800 ml-4 mt-1 space-y-1">
                    <li>1. Find and target: VP/Director of HR (more senior)</li>
                    <li>2. Find and target: Head of Recruitment/TA</li>
                    <li>3. Find and target: Organizational Psychologist (more likely to exist)</li>
                    <li>4. Consider: VP of L&D (larger companies have separate L&D function)</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
            <h3 className="font-bold text-purple-900 text-xl mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              SEQUENCE 2: RECRUITMENT AGENCIES
            </h3>

            <div className="mb-4">
              <p className="font-semibold text-purple-900 mb-2">Companies:</p>
              <ul className="text-purple-800 text-sm space-y-1 ml-4">
                <li>• Recruitment firms</li>
                <li>• Staffing agencies</li>
                <li>• Organizational psychology consultancies</li>
                <li>• Assessment providers (non-competing)</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-purple-900 mb-2">Company Size:</p>
              <p className="text-purple-800 text-sm ml-4">5-100 employees</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-purple-900 mb-2">Total Volume:</p>
              <p className="text-purple-800 text-sm ml-4">~20-30 agencies</p>
            </div>

            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <h4 className="font-bold text-purple-900 mb-3">PRIMARY TARGETS (Send to ALL of these):</h4>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Position Category 1: Agency Leadership</p>
                  <p className="text-sm text-gray-700 mb-1">Managing Director, CEO, Owner, Co-Owner, Operations Director, Direktor, Izvršni direktor</p>
                  <p className="text-xs text-gray-600 italic">WHY: Agency budget owner and decision maker</p>
                  <p className="text-xs text-purple-700 font-semibold">Message Angle: "Offer professional psychometric assessments to your clients without building in-house expertise"</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-1">Position Category 2: Agency Recruitment Leadership</p>
                  <p className="text-sm text-gray-700 mb-1">Head of Recruitment, Director of Recruitment, Assessment Lead, Practice Director, Vodja zaposlovanja</p>
                  <p className="text-xs text-gray-600 italic">WHY: Owns client recruitment projects and evaluates tool fit</p>
                  <p className="text-xs text-purple-700 font-semibold">Message Angle: "Support repeated client assessments with validated instruments and expert reports"</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-100 p-4 rounded border border-purple-300">
              <h4 className="font-bold text-purple-900 mb-3">CRITICAL DIFFERENCE:</h4>
              <p className="text-purple-800 text-sm">
                <strong>Employer sequence:</strong> "Improve YOUR recruitment"<br/>
                <strong>Agency sequence:</strong> "Offer to YOUR clients" (not improving their hiring)
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded border border-amber-200 mt-4">
              <h4 className="font-bold text-amber-900 mb-3">TARGETING STRATEGY:</h4>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-amber-900">For agencies 20-100 employees (LARGER):</p>
                  <ol className="text-amber-800 ml-4 mt-1 space-y-1">
                    <li>1. Find and target: Managing Director OR Operations Director</li>
                    <li>2. Find and target: Head of Recruitment OR Practice Director</li>
                    <li>3. Send BOTH to SAME sequence (different people, same company, DIFFERENT message than employers)</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold text-amber-900">For agencies 5-20 employees (SMALLER):</p>
                  <ol className="text-amber-800 ml-4 mt-1 space-y-1">
                    <li>1. Find and target: Owner OR Managing Director (likely wearing multiple hats)</li>
                    <li>2. Skip separate recruitment head (owner probably owns recruitment)</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded">
            <h3 className="font-bold text-indigo-900 text-xl mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              MANUAL OUTREACH: EDUCATION + BUSINESS SERVICES
            </h3>

            <div className="mb-4">
              <p className="font-semibold text-indigo-900 mb-2">Companies:</p>
              <ul className="text-indigo-800 text-sm space-y-1 ml-4">
                <li>• Private universities (2-3 in Slovenia)</li>
                <li>• International schools (2-3 in Slovenia)</li>
                <li>• Shared services centers / BPO (5-10 in Slovenia)</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-indigo-900 mb-2">Total Volume:</p>
              <p className="text-indigo-800 text-sm ml-4">~5-10 companies</p>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <p className="font-semibold text-indigo-900 mb-2">Approach:</p>
              <p className="text-indigo-800 text-sm">Manual LinkedIn/email, heavily personalized, reference similar institutions or understand specific hiring needs first.</p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded">
            <h3 className="font-bold text-red-900 text-xl mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              EXCLUDE FOR NOW: GOVERNMENT / PUBLIC SECTOR
            </h3>

            <div className="mb-4">
              <p className="font-semibold text-red-900 mb-2">WHY EXCLUDE:</p>
              <ul className="text-red-800 text-sm space-y-1 ml-4">
                <li>• Complex procurement (tender process required)</li>
                <li>• Long sales cycles (6-12 months minimum)</li>
                <li>• Budget constraints</li>
                <li>• Need case studies first</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <p className="font-semibold text-red-900 mb-2">WHEN TO REVISIT:</p>
              <p className="text-red-800 text-sm">After closing 3-5 employer clients, then approach with "approved by [X banks, Y insurers]" proof</p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Sequence Assignment Rules" icon={<Zap className="w-5 h-5" />}>
        <div className="bg-gray-50 p-6 rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 font-bold text-gray-900">Company Type</th>
                <th className="text-left py-2 font-bold text-gray-900">Count</th>
                <th className="text-left py-2 font-bold text-gray-900">Sequence</th>
                <th className="text-left py-2 font-bold text-gray-900">Positions to Target</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-200">
                <td className="py-2">Banking, Insurance, Financial Services</td>
                <td className="py-2">~40-50</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Pharma, Life Sciences, Healthcare</td>
                <td className="py-2">~20-30</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">IT, ICT, Technology, Engineering</td>
                <td className="py-2">~30-40</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Telecommunications</td>
                <td className="py-2">~5-10</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Professional Services</td>
                <td className="py-2">~10-20</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Manufacturing</td>
                <td className="py-2">~20-30</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Retail, Distribution</td>
                <td className="py-2">~10-20</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Logistics, Transportation</td>
                <td className="py-2">~5-10</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Hospitality</td>
                <td className="py-2">~5-10</td>
                <td className="py-2 font-semibold text-green-700">SEQ 1: Employers</td>
                <td className="py-2">HR Leadership + Recruitment/TA + Org Psych</td>
              </tr>
              <tr className="border-b border-gray-200 bg-purple-50">
                <td className="py-2 font-bold">Recruitment Agencies</td>
                <td className="py-2">~20-30</td>
                <td className="py-2 font-semibold text-purple-700">SEQ 2: Agencies</td>
                <td className="py-2">Agency Leadership + Agency Recruitment</td>
              </tr>
              <tr className="border-b border-gray-200 bg-indigo-50">
                <td className="py-2">Education (private/international)</td>
                <td className="py-2">~3-5</td>
                <td className="py-2 font-semibold text-indigo-700">MANUAL OUTREACH</td>
                <td className="py-2">HR Director + Recruitment Manager</td>
              </tr>
              <tr className="border-b border-gray-200 bg-indigo-50">
                <td className="py-2">Business Services / Shared Services</td>
                <td className="py-2">~5-10</td>
                <td className="py-2 font-semibold text-indigo-700">MANUAL OUTREACH</td>
                <td className="py-2">HR Director + Operations Director</td>
              </tr>
              <tr className="bg-red-50">
                <td className="py-2">Government / Public Sector</td>
                <td className="py-2">~5-10</td>
                <td className="py-2 font-semibold text-red-700">EXCLUDE (for now)</td>
                <td className="py-2">N/A - revisit after case studies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection title="Quality Checks Before Launch" icon={<CheckCircle className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-3">For SEQUENCE 1 (Employers):</p>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>✓ All contacts are at EMPLOYER companies (not agencies)</li>
              <li>✓ All contacts have HR/Recruitment/Psychology titles</li>
              <li>✓ Email copy says "improve YOUR recruitment" (not "offer to YOUR clients")</li>
              <li>✓ Proof points include employer case studies (JGL, Ericsson Nikola Tesla, RBA, Zagrebačka banka)</li>
              <li>✓ CTA asks about THEIR recruitment process</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="font-semibold text-purple-900 mb-3">For SEQUENCE 2 (Agencies):</p>
            <ul className="space-y-2 text-purple-800 text-sm">
              <li>✓ All contacts are at AGENCY companies (not employers)</li>
              <li>✓ All contacts have MD/Owner/Director or Agency Recruitment titles</li>
              <li>✓ Email copy says "offer to YOUR clients" (not "improve YOUR hiring")</li>
              <li>✓ Proof points include agency use cases or client success</li>
              <li>✓ CTA asks about adding client services</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-3">For BOTH:</p>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>✓ No government/public sector companies included (excluded)</li>
              <li>✓ Slovenian title variations included in search</li>
              <li>✓ 2-3 contacts per employer company, 1-2 per agency</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Expected Results" icon={<Zap className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <h4 className="font-bold text-green-900 mb-3">SEQUENCE 1 (Employers, ~400-600 contacts):</h4>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>• Reply rate: 15-25% → 60-150 replies</li>
              <li>• Meeting rate: 5-10% → 20-60 meetings</li>
              <li>• Close rate: 2-4% → 8-24 clients</li>
              <li>• Timeline: First client in 3-6 months</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
            <h4 className="font-bold text-purple-900 mb-3">SEQUENCE 2 (Agencies, ~30-50 contacts):</h4>
            <ul className="space-y-2 text-purple-800 text-sm">
              <li>• Reply rate: 10-20% → 3-10 replies</li>
              <li>• Meeting rate: 3-8% → 1-4 meetings</li>
              <li>• Close rate: 1-3% → 0-2 clients</li>
              <li>• Timeline: First client in 6-12 months (longer sales cycle)</li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
