'use client';

import { useState } from 'react';
import { ContentSection } from './ContentSection';
import FileUpload from './FileUpload';
import FileList from './FileList';
import { FolderOpen, FileText } from 'lucide-react';

interface DocumentsTabGenericProps {
  clientId: string;
  clientName: string;
  totalLeads?: number;
  totalCampaigns?: number;
  accentColor?: string; // e.g., 'violet', 'green', 'blue'
}

export default function DocumentsTabGeneric({
  clientId,
  clientName,
  totalLeads = 0,
  totalCampaigns = 0,
  accentColor = 'violet'
}: DocumentsTabGenericProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateDatabase = async () => {
    setSyncing(true);
    try {
      // Trigger GitHub Actions workflow with clientId
      const response = await fetch(`/api/sync-client-data?clientId=${clientId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLastUpdated(new Date().toLocaleString());
        alert(`${clientName} database and performance stats updated successfully!`);
        // Reload page to show updated data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to trigger update: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error triggering update:', error);
      alert('Error triggering update. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  // Color mappings
  const colors = {
    violet: {
      bg: 'bg-violet-100',
      text: 'text-violet-600',
      border: 'border-violet-500',
      hover: 'hover:border-violet-500',
      button: 'bg-violet-600 hover:bg-violet-700'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-500',
      hover: 'hover:border-green-500',
      button: 'bg-green-600 hover:bg-green-700'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-500',
      hover: 'hover:border-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-500',
      hover: 'hover:border-amber-500',
      button: 'bg-amber-600 hover:bg-amber-700'
    }
  };

  const color = colors[accentColor as keyof typeof colors] || colors.violet;

  return (
    <>
      {/* Uploaded Documents Section */}
      <ContentSection title="Uploaded Documents" icon={<FolderOpen className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Upload and manage documents for {clientName}. All uploaded files will be available for download.
            </p>
            <FileUpload clientId={clientId} onUploadComplete={handleUploadComplete} />
          </div>

          <FileList clientId={clientId} refreshTrigger={refreshTrigger} />
        </div>
      </ContentSection>

      {/* Lead Database Section */}
      <ContentSection title="Lead Database" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-slate-600">
            Download the complete database of all leads targeted across all {clientName} campaigns.
            This file contains first name, last name, email, company information, and LinkedIn profiles.
          </p>

          <div className={`bg-white border border-slate-200 rounded-lg p-6 ${color.hover} transition-colors`}>
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <svg
                    className={`w-6 h-6 ${color.text}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <a
                      href={`/data/${clientId}-database.csv`}
                      download={`${clientId}-database.csv`}
                      className={`text-lg font-semibold text-slate-900 ${color.text} transition-colors`}
                    >
                      Download Lead Database
                    </a>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    CSV file {totalLeads > 0 && `• ${totalLeads.toLocaleString()} leads`} {totalCampaigns > 0 && `across ${totalCampaigns} campaigns`}
                  </p>
                  {lastUpdated && (
                    <p className="text-xs text-slate-400 mt-1">Last updated: {lastUpdated}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleUpdateDatabase}
                disabled={syncing}
                className={`ml-4 px-4 py-2 ${color.button} text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
              >
                {syncing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Update Database</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={`bg-blue-50 border-l-4 ${color.border} p-4 rounded`}>
            <p className="text-sm text-blue-900">
              <strong>How it works:</strong> Click "Update Database" to fetch the latest leads from SmartLead.
              This will update both the database file and performance metrics. The sync typically takes 2-3 minutes.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
