import React from 'react';
import { CreditApplication } from '../../types/application';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface SubmissionResultProps {
  application: CreditApplication;
  onClose: () => void;
}

export function SubmissionResult({ application, onClose }: SubmissionResultProps) {
  const getStatusConfig = () => {
    switch (application.status) {
      case 'approved':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          title: 'Application Approved',
          description: 'Congratulations! Your credit application has been approved.'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          title: 'Application Rejected',
          description: 'Unfortunately, your credit application has been rejected.'
        };
      case 'review':
        return {
          icon: AlertCircle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          title: 'Under Review',
          description: 'Your application requires manual review by our team.'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          title: 'Processing',
          description: 'Your application is being processed.'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div className="fixed inset-0 bg-black bg-opacity-20" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[500px] p-8">
        <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full ${config.bgColor} mb-6`}>
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2">{config.title}</h2>
        <p className="text-gray-600 text-center mb-6">{config.description}</p>

        {application.creditScore !== undefined && (
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Credit Score</p>
            <p className="text-2xl font-semibold">{application.creditScore}</p>
          </div>
        )}

        {application.comment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Additional Information</p>
            <p className="text-gray-900">{application.comment}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}