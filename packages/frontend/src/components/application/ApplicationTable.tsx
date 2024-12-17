import React from 'react';
import { CreditApplication } from '../../types/application';
import { Calendar, Eye, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ApplicationTableProps {
  applications: CreditApplication[];
  onViewApplication: (application: CreditApplication) => void;
}

export function ApplicationTable({ applications, onViewApplication }: ApplicationTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="text-green-500" size={16} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={16} />;
      case 'review':
        return <AlertCircle className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      case 'review':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Credit Score
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Comment
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Submitted
          </th>
          <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {applications.map((application) => (
          <tr key={application.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {application.id.slice(0, 8)}...
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {getStatusIcon(application.status)}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusStyle(application.status)}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {application.creditScore ?? '-'}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
              {application.comment || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                {formatDate(application.createdAt)}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <button
                onClick={() => onViewApplication(application)}
                className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-full transition-colors"
                title="View application"
              >
                <Eye size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}