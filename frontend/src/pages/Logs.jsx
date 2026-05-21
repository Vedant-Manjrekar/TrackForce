import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useCache } from '../components/CacheContext';
import Loader from '../components/Loader';

function Logs() {
  const { getCachedData, fetchWithCache } = useCache();
  const cachedLogs = getCachedData('logs') || [];

  const [logs, setLogs] = useState(cachedLogs);
  const [loading, setLoading] = useState(cachedLogs.length === 0);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await fetchWithCache('logs', () => api.get('/logs/'));
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  }, [fetchWithCache]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (loading) return <Loader message="Connecting to telemetry stream..." />;

  return (
    <div>
      <h1>Activity Logs</h1>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.actor_name}</td>
                <td>{log.action}</td>
                <td>{log.target_type}:{log.target_id}</td>
                <td><pre style={{ fontSize: '10px' }}>{JSON.stringify(log.details)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Logs;
