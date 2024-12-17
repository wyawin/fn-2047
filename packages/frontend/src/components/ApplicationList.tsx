import React, { useEffect, useState } from 'react';
import { CreditApplication } from '../types/application';
import { applicationService } from '../services/application.service';
import { ApplicationModal } from './modals/ApplicationModal';
import { ApplicationTable } from './application/ApplicationTable';
import { Pagination } from './common/Pagination';
import { SearchFilters } from './application/SearchFilters';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ApplicationList() {
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<CreditApplication | null>(null);
  
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadApplications();
  }, [currentPage, search, status]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.findAll({
        page: currentPage,
        limit: 10,
        search,
        status
      });
      setApplications(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (application: CreditApplication) => {
    try {
      await applicationService.delete(application.id);
      toast.success('Application deleted successfully');
      setSelectedApplication(null);
      loadApplications();
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1); // Reset to first page when status changes
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Credit Applications</h2>
          <SearchFilters
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <div className="p-4">
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ApplicationTable
              applications={applications}
              onViewApplication={setSelectedApplication}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onDelete={() => handleDelete(selectedApplication)}
        />
      )}
    </div>
  );
}