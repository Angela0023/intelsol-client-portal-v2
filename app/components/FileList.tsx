'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Trash2, Loader, RefreshCw } from 'lucide-react';

interface FileMetadata {
  fileName: string;
  customName: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: string;
  clientId: string;
}

interface FileListProps {
  clientId: string;
  refreshTrigger?: number;
}

export default function FileList({ clientId, refreshTrigger }: FileListProps) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/files?clientId=${clientId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load files');
      }

      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [clientId, refreshTrigger]);

  const handleDownload = async (file: FileMetadata) => {
    try {
      const response = await fetch(`/api/download/${encodeURIComponent(file.fileName)}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.customName}.${file.fileName.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to download file');
    }
  };

  const handleDelete = async (file: FileMetadata) => {
    if (!confirm(`Are you sure you want to delete "${file.customName}"?`)) {
      return;
    }

    setDeletingFile(file.fileName);

    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.fileName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Delete failed');
      }

      // Refresh file list
      await fetchFiles();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete file');
    } finally {
      setDeletingFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-900 font-medium">Failed to load documents</p>
        <p className="text-red-700 text-sm mt-1">{error}</p>
        <button
          onClick={fetchFiles}
          className="mt-3 text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">No documents uploaded yet</p>
        <p className="text-sm text-slate-500 mt-1">Upload your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.fileName}
          className="bg-white border border-slate-200 rounded-lg p-4 hover:border-green-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate">
                  {file.customName}
                </h4>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{formatDate(file.uploadedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              <button
                onClick={() => handleDownload(file)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(file)}
                disabled={deletingFile === file.fileName}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete"
              >
                {deletingFile === file.fileName ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
