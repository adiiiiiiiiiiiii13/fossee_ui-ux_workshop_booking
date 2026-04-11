import Button from '../ui/Button';
import Card from '../ui/Card';
import EmptyState from '../common/EmptyState';

export default function WorkshopResults({ payload, onPageChange, currentPage }) {
  if (!payload?.items?.length) {
    return (
      <Card>
        <EmptyState 
          title="No workshops found" 
          description="Try widening the date range or removing one of the filters." 
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Results</p>
          <h2>Workshop records</h2>
        </div>
        {payload?.pagination && (
          <p className="muted-text">
            Page {payload.pagination.page} of {payload.pagination.totalPages || 1}
          </p>
        )}
      </div>

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

      {payload?.pagination?.totalPages > 1 && (
        <div className="pagination-row">
          <Button 
            variant="outline" 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={!payload.pagination.hasPrevious}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={!payload.pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}