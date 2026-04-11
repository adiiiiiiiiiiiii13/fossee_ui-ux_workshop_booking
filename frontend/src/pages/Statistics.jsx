import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ChartBars from '../components/common/ChartBars';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStatistics = async (nextFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const data = await getPublicStatistics(nextFilters);
      setPayload(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Statistics could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleApply = (event) => {
    event.preventDefault();
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    loadStatistics(nextFilters);
  };

  const handlePage = (page) => {
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
          <Button variant="outline" onClick={() => window.open(getPublicStatisticsExportUrl(filters), '_blank')}>
            Download CSV
          </Button>
        </div>
      </section>

      <div className="content-layout">
        <Card className="filter-card">
          <form className="form-stack" onSubmit={handleApply}>
            <Input label="From date" type="date" name="from_date" value={filters.from_date} onChange={handleChange} />
            <Input label="To date" type="date" name="to_date" value={filters.to_date} onChange={handleChange} />
            <Select label="Workshop type" name="workshop_type" value={filters.workshop_type} onChange={handleChange}>
              <option value="">All workshop types</option>
              {payload?.filters?.workshopTypes?.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
            <Select label="State" name="state" value={filters.state} onChange={handleChange}>
              <option value="">All states</option>
              {payload?.filters?.states?.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
            <Select label="Sort by" name="sort" value={filters.sort} onChange={handleChange}>
              <option value="date">Oldest first</option>
              <option value="-date">Latest first</option>
            </Select>
            {user ? (
              <label className="checkbox-row">
                <input type="checkbox" name="show_workshops" checked={filters.show_workshops} onChange={handleChange} />
                <span>Show only my workshops</span>
              </label>
            ) : null}
            <Button type="submit" fullWidth>Apply filters</Button>
          </form>
        </Card>

        <div className="content-stack">
          {error ? <div className="message-banner message-error">{error}</div> : null}

          <div className="stats-grid">
            <ChartBars title="State-wise workshops" labels={payload?.charts?.state?.labels} values={payload?.charts?.state?.values} />
            <ChartBars title="Workshop types" labels={payload?.charts?.type?.labels} values={payload?.charts?.type?.values} />
          </div>

          <Card>
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Results</p>
                <h2>Workshop records</h2>
              </div>
              {payload?.pagination ? (
                <p className="muted-text">
                  Page {payload.pagination.page} of {payload.pagination.totalPages || 1}
                </p>
              ) : null}
            </div>

            {payload?.items?.length ? (
              <div className="list-stack">
                {payload.items.map((item) => (
                  <article key={item.id} className="record-card">
                    <div>
                      <h3>{item.workshopName}</h3>
                      <p>{item.coordinatorName} at {item.institute}</p>
                    </div>
                    <dl className="record-grid">
                      <div><dt>Instructor</dt><dd>{item.instructorName || 'Pending assignment'}</dd></div>
                      <div><dt>Date</dt><dd>{item.workshopDate}</dd></div>
                      <div><dt>State</dt><dd>{item.state}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="No workshops found" description="Try widening the date range or removing one of the filters." />
            )}

            {payload?.pagination?.totalPages > 1 ? (
              <div className="pagination-row">
                <Button variant="outline" onClick={() => handlePage(filters.page - 1)} disabled={!payload.pagination.hasPrevious}>
                  Previous
                </Button>
                <Button variant="outline" onClick={() => handlePage(filters.page + 1)} disabled={!payload.pagination.hasNext}>
                  Next
                </Button>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
