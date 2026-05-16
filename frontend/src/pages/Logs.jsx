import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/logs/');
        setLogs(response.data.results);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };
    fetchLogs();
  }, []);

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
