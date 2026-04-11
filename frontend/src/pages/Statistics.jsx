import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import LoadingState from '../components/common/LoadingState';
import StatisticsFilters from '../components/statistics/StatisticsFilters';
import StatisticsCharts from '../components/statistics/StatisticsCharts';
import WorkshopResults from '../components/statistics/WorkshopResults';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { getPublicStatistics, getPublicStatisticsExportUrl } from '../services/statisticsService';

const initialFilters = {
  from_date: '',
  to_date: '',
  workshop_type: '',
  state: '',
  sort: 'date',
  show_workshops: false,
  page: 1,
};

export default function Statistics() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [payload, setPayload] = useState(null);
  const { loading, error, execute } = useAsync();

  const loadStatistics = async (nextFilters = filters) => {
    const data = await execute(
      () => getPublicStatistics(nextFilters),
      'Statistics could not be loaded.'
    );
    setPayload(data);
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    loadStatistics(nextFilters);
  };

  const handlePageChange = (page) => {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    loadStatistics(nextFilters);
  };

  if (loading && !payload) {
    return <LoadingState label="Loading workshop statistics..." />;
  }

  return (
    <div className="page-shell">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Public analytics</p>
          <h1>Workshop statistics</h1>
          <p className="muted-text">Filter workshops, see state-wise spread, and export the current dataset.</p>
        </div>
        <div className="inline-actions">
          <Button 
            variant="outline" 
            onClick={() => window.open(getPublicStatisticsExportUrl(filters), '_blank')}
          >
            Download CSV
          </Button>
        </div>
      </section>

      <div className="content-layout">
        <StatisticsFilters
          filters={filters}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          payload={payload}
          user={user}
        />

        <div className="content-stack">
          {error && <div className="message-banner message-error">{error}</div>}
          
          <StatisticsCharts payload={payload} />
          
          <WorkshopResults
            payload={payload}
            onPageChange={handlePageChange}
            currentPage={filters.page}
          />
        </div>
      </div>
    </div>
  );
}
