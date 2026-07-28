import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function ContentSection({ title, children, icon }: ContentSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 px-3 py-4 lg:p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-3 lg:mb-4">
        {icon && <div className="text-[#1a2647]">{icon}</div>}
        <h3 className="text-base lg:text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy to clipboard"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface InfoCardProps {
  label: string;
  value: string | React.ReactNode;
  color?: string;
}

export function InfoCard({ label, value, color = 'bg-blue-50 text-blue-700' }: InfoCardProps) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <div className={`text-sm font-semibold ${color} break-words`}>
        {value}
      </div>
    </div>
  );
}

interface ListItemProps {
  children: React.ReactNode;
  type?: 'check' | 'bullet' | 'cross';
}

export function ListItem({ children, type = 'bullet' }: ListItemProps) {
  const icons = {
    check: '✓',
    bullet: '•',
    cross: '✗',
  };

  const colors = {
    check: 'text-green-600',
    bullet: 'text-slate-400',
    cross: 'text-red-600',
  };

  return (
    <li className="flex items-start space-x-2">
      <span className={`${colors[type]} font-bold mt-0.5`}>{icons[type]}</span>
      <span className="flex-1">{children}</span>
    </li>
  );
}
