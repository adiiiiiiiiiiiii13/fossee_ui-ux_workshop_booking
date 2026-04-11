import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ChartBars from '../components/common/ChartBars';
import LoadingState from '../components/common/LoadingState';
import { getErrorMessage } from '../services/api';
import { getTeamStatistics } from '../services/statisticsService';

export default function TeamStats() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTeam = async (teamId) => {
    setLoading(true);
    setError('');
    try {
      const data = await getTeamStatistics(teamId);
      setPayload(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Team statistics could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  if (loading && !payload) {
    return <LoadingState label="Loading team statistics..." />;
  }

  return (
    <div className="page-shell">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Instructor analytics</p>
          <h1>Team statistics</h1>
          <p className="muted-text">Compare how many workshops each team member has handled.</p>
        </div>
      </section>

      {error ? <div className="message-banner message-error">{error}</div> : null}

      <div className="content-layout">
        <Card className="filter-card">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Teams</p>
              <h2>Choose a team</h2>
            </div>
          </div>
          <div className="list-stack">
            {payload?.teams?.map((team) => (
              <Button key={team.id} variant={payload.selectedTeam?.id === team.id ? 'primary' : 'outline'} onClick={() => loadTeam(team.id)}>
                {team.label}
              </Button>
            ))}
          </div>
        </Card>

        <div className="content-stack">
          <ChartBars title="Workshops handled by each member" labels={payload?.chart?.labels} values={payload?.chart?.values} />
        </div>
      </div>
    </div>
  );
}
