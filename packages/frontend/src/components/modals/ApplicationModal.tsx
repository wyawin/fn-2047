import React from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { CreditApplication } from '../../types/application';
import { VariablesList } from '../application/VariablesList';

interface ApplicationModalProps {
  application: CreditApplication;
  onClose: () => void;
  onDelete: () => void;
}

export function ApplicationModal({ application, onClose, onDelete }: ApplicationModalProps) {
  const getStatusConfig = () => {
    switch (application.status) {
      case 'approved':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100'
        };
      case 'review':
        return {
          icon: AlertCircle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-100'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-100'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this application?')) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div className="fixed inset-0 bg-black bg-opacity-20" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Application Details</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Status Section */}
            <div className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
              <div className="flex items-center gap-3">
                <Icon className={`${config.color}`} size={24} />
                <div>
                  <h4 className="font-medium">Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}</h4>
                  {application.comment && (
                    <p className="text-sm mt-1">{application.comment}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Credit Score */}
            {application.creditScore !== undefined && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Credit Score</h4>
                <p className="text-2xl font-semibold">{application.creditScore}</p>
              </div>
            )}

            {/* Variables */}
            <div>
              <h4 className="font-medium mb-3">Application Variables</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <VariablesList application={application} />
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>Submitted: {formatDate(application.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>Last Updated: {formatDate(application.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete Application
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}