import ChartBars from '../common/ChartBars';

export default function StatisticsCharts({ payload }) {
  return (
    <div className="stats-grid">
      <ChartBars 
        title="State-wise workshops" 
        labels={payload?.charts?.state?.labels} 
        values={payload?.charts?.state?.values} 
      />
      <ChartBars 
        title="Workshop types" 
        labels={payload?.charts?.type?.labels} 
        values={payload?.charts?.type?.values} 
      />
    </div>
  );
}