'use client';

import { ContentSection } from '../components/ContentSection';
import { Zap, Target, Users, FileText, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

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

        {/* SEQUENCE 1: EMPLOYERS - COMPLETE SECTION */}
        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded mb-8">
          <h2 className="font-bold text-green-900 text-2xl mb-6 flex items-center gap-2">
            <Users className="w-7 h-7" />
            SEQUENCE 1: EMPLOYERS (Tier 1 + Tier 2)
          </h2>

          {/* Companies that go in Sequence 1 */}
          <div className="bg-white p-5 rounded shadow-sm mb-5">
            <h3 className="font-bold text-gray-900 text-lg mb-3">📋 Which Companies Go in Sequence 1?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Industries:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Banking, Insurance, Financial Services (~40-50 companies)</li>
                  <li>• Pharmaceuticals, Life Sciences, Healthcare (~20-30 companies)</li>
                  <li>• IT, ICT, Technology, Engineering (~30-40 companies)</li>
                  <li>• Telecommunications (~5-10 companies)</li>
                  <li>• Professional Services - Consulting, Legal, Accounting, Audit (~10-20 companies)</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">More Industries:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Manufacturing (~20-30 companies)</li>
                  <li>• Retail, Distribution (~10-20 companies)</li>
                  <li>• Logistics, Transportation (~5-10 companies)</li>
                  <li>• Hospitality (~5-10 companies)</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm"><strong>Company Size:</strong> 50-2,000 employees (sweet spot 100-1,000)</p>
              <p className="text-sm"><strong>Total Volume:</strong> ~150-200 companies = ~400-600 contacts (2-3 per company)</p>
            </div>
          </div>

          {/* Positions to target for Sequence 1 */}
          <div className="bg-white p-5 rounded shadow-sm mb-5">
            <h3 className="font-bold text-gray-900 text-lg mb-3">🎯 Which Positions to Target for Sequence 1?</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="font-bold text-blue-900 mb-2">PRIMARY TARGET 1: HR Leadership</p>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Titles:</strong> HR Director, Head of HR, HR Manager, Direktor kadrovske službe, Vodja kadrovske službe
                </p>
                <p className="text-xs text-blue-700 mb-1"><strong>WHY:</strong> Sponsor for selection process and budget owner</p>
                <p className="text-xs text-blue-900 font-semibold">💬 Message Angle: "Improve recruitment decisions with structured psychometric assessment"</p>
              </div>

              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="font-bold text-blue-900 mb-2">PRIMARY TARGET 2: Recruitment / Talent Acquisition</p>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Titles:</strong> Head of Recruitment, Head of Talent Acquisition, TA Manager, Recruitment Manager, Vodja zaposlovanja, Specialist za zaposlovanje
                </p>
                <p className="text-xs text-blue-700 mb-1"><strong>WHY:</strong> Owns candidate workflow and evaluates practical fit</p>
                <p className="text-xs text-blue-900 font-semibold">💬 Message Angle: "Organize assessment and support consistent candidate evaluation"</p>
              </div>

              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="font-bold text-blue-900 mb-2">PRIMARY TARGET 3: Organizational Psychology / Assessment</p>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Titles:</strong> Organizational Psychologist, Organizacijski psiholog, Assessment Lead, Vodja ocenjevanja, People Scientist
                </p>
                <p className="text-xs text-blue-700 mb-1"><strong>WHY:</strong> Validates instruments, interpretation, and role relevance - technical champion</p>
                <p className="text-xs text-blue-900 font-semibold">💬 Message Angle: "Discuss instrument choice, norms, and interpretation for Slovenian context"</p>
              </div>
            </div>
          </div>

          {/* Targeting strategy for Sequence 1 */}
          <div className="bg-amber-50 p-5 rounded border border-amber-300 mb-5">
            <h3 className="font-bold text-amber-900 text-lg mb-3">🔍 Targeting Strategy by Company Size:</h3>

            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-gray-900 mb-2">For companies 100-1,000 employees (MAJORITY):</p>
                <ol className="text-gray-800 ml-4 space-y-1">
                  <li>1. Find and target: HR Leadership (HR Director, Head of HR)</li>
                  <li>2. Find and target: Recruitment/TA (Head of Recruitment, TA Manager)</li>
                  <li>3. Find and target: Organizational Psychologist (if exists)</li>
                  <li>4. ✅ Send ALL THREE to SAME sequence (different people, same company, same message)</li>
                </ol>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-gray-900 mb-2">For companies 50-100 employees (SMALLER):</p>
                <ol className="text-gray-800 ml-4 space-y-1">
                  <li>1. Find and target: HR Manager OR Owner/Director (whoever owns recruitment)</li>
                  <li>2. Find and target: Recruiter OR Recruitment Lead</li>
                  <li>3. Skip Organizational Psychologist (less likely to exist at this size)</li>
                </ol>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-gray-900 mb-2">For companies 1,001-2,000 employees (LARGER):</p>
                <ol className="text-gray-800 ml-4 space-y-1">
                  <li>1. Find and target: VP/Director of HR (more senior)</li>
                  <li>2. Find and target: Head of Recruitment/TA</li>
                  <li>3. Find and target: Organizational Psychologist (more likely to exist)</li>
                  <li>4. Consider: VP of L&D (larger companies have separate L&D function)</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Quality checks for Sequence 1 */}
          <div className="bg-green-100 p-5 rounded border border-green-300 mb-5">
            <h3 className="font-bold text-green-900 text-lg mb-3">✅ Quality Checks Before Launching Sequence 1:</h3>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>✓ All contacts are at EMPLOYER companies (not agencies)</li>
              <li>✓ All contacts have HR/Recruitment/Psychology titles</li>
              <li>✓ Email copy says "improve YOUR recruitment" (not "offer to YOUR clients")</li>
              <li>✓ Proof points include employer case studies (JGL, Ericsson Nikola Tesla, RBA, Zagrebačka banka)</li>
              <li>✓ CTA asks about THEIR recruitment process</li>
              <li>✓ No government/public sector companies included</li>
              <li>✓ Slovenian title variations included in search</li>
              <li>✓ 2-3 contacts per company</li>
            </ul>
          </div>

          {/* Expected results for Sequence 1 */}
          <div className="bg-white p-5 rounded border-2 border-green-500">
            <h3 className="font-bold text-green-900 text-lg mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Expected Results for Sequence 1:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-green-900">Reply Rate</p>
                <p className="text-green-800">15-25%</p>
                <p className="text-xs text-green-700">60-150 replies</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-green-900">Meeting Rate</p>
                <p className="text-green-800">5-10%</p>
                <p className="text-xs text-green-700">20-60 meetings</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-green-900">Close Rate</p>
                <p className="text-green-800">2-4%</p>
                <p className="text-xs text-green-700">8-24 clients</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-green-900">Timeline</p>
                <p className="text-green-800">3-6 months</p>
                <p className="text-xs text-green-700">First client</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEQUENCE 2: AGENCIES - COMPLETE SECTION */}
        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded mb-8">
          <h2 className="font-bold text-purple-900 text-2xl mb-6 flex items-center gap-2">
            <Users className="w-7 h-7" />
            SEQUENCE 2: RECRUITMENT AGENCIES
          </h2>

          {/* Companies that go in Sequence 2 */}
          <div className="bg-white p-5 rounded shadow-sm mb-5">
            <h3 className="font-bold text-gray-900 text-lg mb-3">📋 Which Companies Go in Sequence 2?</h3>
            <ul className="text-sm text-gray-700 space-y-1 ml-4 mb-3">
              <li>• Recruitment firms</li>
              <li>• Staffing agencies</li>
              <li>• Organizational psychology consultancies</li>
              <li>• Assessment providers (non-competing)</li>
            </ul>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm"><strong>Company Size:</strong> 5-100 employees</p>
              <p className="text-sm"><strong>Total Volume:</strong> ~20-30 agencies = ~30-50 contacts (1-2 per company)</p>
            </div>
          </div>

          {/* Positions to target for Sequence 2 */}
          <div className="bg-white p-5 rounded shadow-sm mb-5">
            <h3 className="font-bold text-gray-900 text-lg mb-3">🎯 Which Positions to Target for Sequence 2?</h3>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <p className="font-bold text-purple-900 mb-2">PRIMARY TARGET 1: Agency Leadership</p>
                <p className="text-sm text-purple-800 mb-2">
                  <strong>Titles:</strong> Managing Director, CEO, Owner, Co-Owner, Operations Director, Direktor, Izvršni direktor
                </p>
                <p className="text-xs text-purple-700 mb-1"><strong>WHY:</strong> Agency budget owner and decision maker</p>
                <p className="text-xs text-purple-900 font-semibold">💬 Message Angle: "Offer professional psychometric assessments to your clients without building in-house expertise"</p>
              </div>

              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <p className="font-bold text-purple-900 mb-2">PRIMARY TARGET 2: Agency Recruitment Leadership</p>
                <p className="text-sm text-purple-800 mb-2">
                  <strong>Titles:</strong> Head of Recruitment, Director of Recruitment, Assessment Lead, Practice Director, Vodja zaposlovanja
                </p>
                <p className="text-xs text-purple-700 mb-1"><strong>WHY:</strong> Owns client recruitment projects and evaluates tool fit</p>
                <p className="text-xs text-purple-900 font-semibold">💬 Message Angle: "Support repeated client assessments with validated instruments and expert reports"</p>
              </div>
            </div>
          </div>

          {/* Targeting strategy for Sequence 2 */}
          <div className="bg-amber-50 p-5 rounded border border-amber-300 mb-5">
            <h3 className="font-bold text-amber-900 text-lg mb-3">🔍 Targeting Strategy by Company Size:</h3>

            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-gray-900 mb-2">For agencies 20-100 employees (LARGER):</p>
                <ol className="text-gray-800 ml-4 space-y-1">
                  <li>1. Find and target: Managing Director OR Operations Director</li>
                  <li>2. Find and target: Head of Recruitment OR Practice Director</li>
                  <li>3. ✅ Send BOTH to SAME sequence (different people, same company, DIFFERENT message than employers)</li>
                </ol>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-gray-900 mb-2">For agencies 5-20 employees (SMALLER):</p>
                <ol className="text-gray-800 ml-4 space-y-1">
                  <li>1. Find and target: Owner OR Managing Director (likely wearing multiple hats)</li>
                  <li>2. Skip separate recruitment head (owner probably owns recruitment)</li>
                </ol>
              </div>
            </div>
          </div>

          {/* CRITICAL DIFFERENCE */}
          <div className="bg-purple-100 p-5 rounded border-2 border-purple-400 mb-5">
            <h3 className="font-bold text-purple-900 text-lg mb-2">⚠️ CRITICAL DIFFERENCE:</h3>
            <div className="text-sm space-y-1">
              <p className="text-purple-900"><strong>Employer sequence (Sequence 1):</strong> "Improve YOUR recruitment"</p>
              <p className="text-purple-900"><strong>Agency sequence (Sequence 2):</strong> "Offer to YOUR clients" (NOT improving their hiring)</p>
            </div>
          </div>

          {/* Quality checks for Sequence 2 */}
          <div className="bg-purple-100 p-5 rounded border border-purple-300 mb-5">
            <h3 className="font-bold text-purple-900 text-lg mb-3">✅ Quality Checks Before Launching Sequence 2:</h3>
            <ul className="space-y-2 text-purple-800 text-sm">
              <li>✓ All contacts are at AGENCY companies (not employers)</li>
              <li>✓ All contacts have MD/Owner/Director or Agency Recruitment titles</li>
              <li>✓ Email copy says "offer to YOUR clients" (not "improve YOUR hiring")</li>
              <li>✓ Proof points include agency use cases or client success</li>
              <li>✓ CTA asks about adding client services</li>
              <li>✓ No government/public sector companies included</li>
              <li>✓ Slovenian title variations included in search</li>
              <li>✓ 1-2 contacts per agency</li>
            </ul>
          </div>

          {/* Expected results for Sequence 2 */}
          <div className="bg-white p-5 rounded border-2 border-purple-500">
            <h3 className="font-bold text-purple-900 text-lg mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Expected Results for Sequence 2:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-purple-50 p-3 rounded">
                <p className="font-semibold text-purple-900">Reply Rate</p>
                <p className="text-purple-800">10-20%</p>
                <p className="text-xs text-purple-700">3-10 replies</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="font-semibold text-purple-900">Meeting Rate</p>
                <p className="text-purple-800">3-8%</p>
                <p className="text-xs text-purple-700">1-4 meetings</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="font-semibold text-purple-900">Close Rate</p>
                <p className="text-purple-800">1-3%</p>
                <p className="text-xs text-purple-700">0-2 clients</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="font-semibold text-purple-900">Timeline</p>
                <p className="text-purple-800">6-12 months</p>
                <p className="text-xs text-purple-700">Longer cycle</p>
              </div>
            </div>
          </div>
        </div>

        {/* MANUAL OUTREACH */}
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded mb-8">
          <h2 className="font-bold text-indigo-900 text-xl mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            MANUAL OUTREACH: EDUCATION + BUSINESS SERVICES
          </h2>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-indigo-900 mb-2">Companies:</p>
              <ul className="text-indigo-800 text-sm space-y-1 ml-4">
                <li>• Private universities (2-3 in Slovenia)</li>
                <li>• International schools (2-3 in Slovenia)</li>
                <li>• Shared services centers / BPO (5-10 in Slovenia)</li>
              </ul>
              <p className="text-sm text-indigo-900 mt-3"><strong>Total Volume:</strong> ~5-10 companies</p>
            </div>

            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-indigo-900 mb-2">Approach:</p>
              <p className="text-indigo-800 text-sm">Manual LinkedIn/email, heavily personalized, reference similar institutions or understand specific hiring needs first. NOT part of automated sequences.</p>
            </div>
          </div>
        </div>

        {/* EXCLUDE */}
        <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded mb-8">
          <h2 className="font-bold text-red-900 text-xl mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            EXCLUDE FOR NOW: GOVERNMENT / PUBLIC SECTOR
          </h2>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">WHY EXCLUDE:</p>
              <ul className="text-red-800 text-sm space-y-1 ml-4">
                <li>• Complex procurement (tender process required)</li>
                <li>• Long sales cycles (6-12 months minimum)</li>
                <li>• Budget constraints</li>
                <li>• Need case studies first</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">WHEN TO REVISIT:</p>
              <p className="text-red-800 text-sm">After closing 3-5 employer clients, then approach with "approved by [X banks, Y insurers]" proof</p>
            </div>
          </div>
        </div>

        {/* Complete Reference Table */}
        <div className="bg-gray-50 p-6 rounded border border-gray-300">
          <h3 className="font-bold text-gray-900 text-xl mb-4">📊 Complete Sequence Assignment Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-400 bg-gray-100">
                  <th className="text-left py-3 px-2 font-bold text-gray-900">Company Type</th>
                  <th className="text-left py-3 px-2 font-bold text-gray-900">Count</th>
                  <th className="text-left py-3 px-2 font-bold text-gray-900">Sequence</th>
                  <th className="text-left py-3 px-2 font-bold text-gray-900">Positions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">Banking, Insurance, Financial Services</td>
                  <td className="py-2 px-2">~40-50</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">Pharma, Life Sciences, Healthcare</td>
                  <td className="py-2 px-2">~20-30</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">IT, Technology, Engineering</td>
                  <td className="py-2 px-2">~30-40</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">Telecommunications</td>
                  <td className="py-2 px-2">~5-10</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">Professional Services</td>
                  <td className="py-2 px-2">~10-20</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">Manufacturing</td>
                  <td className="py-2 px-2">~20-30</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">Retail, Distribution</td>
                  <td className="py-2 px-2">~10-20</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">Logistics, Transportation</td>
                  <td className="py-2 px-2">~5-10</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-green-50">
                  <td className="py-2 px-2">Hospitality</td>
                  <td className="py-2 px-2">~5-10</td>
                  <td className="py-2 px-2 font-semibold text-green-700">SEQ 1</td>
                  <td className="py-2 px-2">HR + Recruitment + Org Psych</td>
                </tr>
                <tr className="border-b border-gray-200 bg-purple-50">
                  <td className="py-2 px-2 font-bold">Recruitment Agencies</td>
                  <td className="py-2 px-2">~20-30</td>
                  <td className="py-2 px-2 font-semibold text-purple-700">SEQ 2</td>
                  <td className="py-2 px-2">Agency Leadership + Recruitment</td>
                </tr>
                <tr className="border-b border-gray-200 bg-indigo-50">
                  <td className="py-2 px-2">Education, Business Services</td>
                  <td className="py-2 px-2">~5-10</td>
                  <td className="py-2 px-2 font-semibold text-indigo-700">MANUAL</td>
                  <td className="py-2 px-2">HR Director + Ops Director</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="py-2 px-2">Government / Public Sector</td>
                  <td className="py-2 px-2">~5-10</td>
                  <td className="py-2 px-2 font-semibold text-red-700">EXCLUDE</td>
                  <td className="py-2 px-2">Revisit after case studies</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
