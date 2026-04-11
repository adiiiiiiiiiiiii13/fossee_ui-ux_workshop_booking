import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function StatisticsFilters({ 
  filters, 
  onChange, 
  onApply, 
  payload, 
  user 
}) {
  return (
    <Card className="filter-card">
      <form className="form-stack" onSubmit={onApply}>
        <Input 
          label="From date" 
          type="date" 
          name="from_date" 
          value={filters.from_date} 
          onChange={onChange} 
        />
        <Input 
          label="To date" 
          type="date" 
          name="to_date" 
          value={filters.to_date} 
          onChange={onChange} 
        />
        <Select 
          label="Workshop type" 
          name="workshop_type" 
          value={filters.workshop_type} 
          onChange={onChange}
        >
          <option value="">All workshop types</option>
          {payload?.filters?.workshopTypes?.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </Select>
        <Select 
          label="State" 
          name="state" 
          value={filters.state} 
          onChange={onChange}
        >
          <option value="">All states</option>
          {payload?.filters?.states?.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </Select>
        <Select 
          label="Sort by" 
          name="sort" 
          value={filters.sort} 
          onChange={onChange}
        >
          <option value="date">Oldest first</option>
          <option value="-date">Latest first</option>
        </Select>
        {user && (
          <label className="checkbox-row">
            <input 
              type="checkbox" 
              name="show_workshops" 
              checked={filters.show_workshops} 
              onChange={onChange} 
            />
            <span>Show only my workshops</span>
          </label>
        )}
        <Button type="submit" fullWidth>Apply filters</Button>
      </form>
    </Card>
  );
}