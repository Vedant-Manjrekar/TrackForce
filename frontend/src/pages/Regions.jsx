import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { MapPin, Plus, Trash2, Edit2, X, Users, ClipboardList, ShieldCheck, ChevronRight } from 'lucide-react';

function Regions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [regionName, setRegionName] = useState('');

  const fetchRegions = async () => {
    try {
      const response = await api.get('/regions/');
      setRegions(response.data.results || response.data);
    } catch (err) {
      console.error("Failed to fetch regions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleOpenModal = (region = null) => {
    setCurrentRegion(region);
    setRegionName(region ? region.name : '');
    setShowModal(true);
  };

  const handleViewDetails = (region) => {
    setCurrentRegion(region);
    setShowDetails(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRegion && showModal) {
        await api.put(`/regions/${currentRegion.id}/`, { name: regionName });
      } else {
        await api.post('/regions/', { name: regionName });
      }
      setShowModal(false);
      fetchRegions();
    } catch (err) {
      alert("Error saving region");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will delete all teams in this region.")) {
      try {
        await api.delete(`/regions/${id}/`);
        fetchRegions();
      } catch (err) {
        alert("Error deleting region");
      }
    }
  };

  if (loading) return <div className="p-4">Loading regions...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>Regional Jurisdictions</h1>
          <p style={{ color: '#888', margin: 0 }}>Manage geographical operational zones and their leadership.</p>
        </div>
        <button onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Region
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>{currentRegion ? 'Edit Region' : 'Add Region'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', padding: 0 }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label>Region Name</label>
                <input 
                  required 
                  value={regionName} 
                  onChange={e => setRegionName(e.target.value)} 
                  style={{ width: '100%', padding: '12px', background: '#121212', border: '1px solid #333', borderRadius: '8px', color: 'white', marginTop: '8px' }}
                />
              </div>
              <button type="submit" style={{ width: '100%' }}>{currentRegion ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}

      {showDetails && currentRegion && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', padding: '0', overflow: 'hidden' }}>
            <div style={{ background: '#6366f1', padding: '30px', color: 'white', position: 'relative' }}>
              <button onClick={() => setShowDetails(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', color: 'white', padding: 0 }}><X size={24} /></button>
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Region Overview</div>
              <h1 style={{ margin: '10px 0 0 0', color: 'white' }}>{currentRegion.name}</h1>
            </div>
            
            <div style={{ padding: '25px', display: 'grid', gap: '25px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: '#121212', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>Task Count</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClipboardList size={18} style={{ color: '#6366f1' }} /> {currentRegion.task_count}
                  </div>
                </div>
                <div style={{ background: '#121212', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>Agent Count</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} style={{ color: '#10b981' }} /> {currentRegion.agent_count}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8' }}>
                  <ShieldCheck size={16} /> Regional Managers
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentRegion.managers?.length > 0 ? currentRegion.managers.map(m => (
                    <span key={m} style={{ background: '#121212', padding: '4px 10px', borderRadius: '50px', fontSize: '13px', border: '1px solid #333' }}>@{m}</span>
                  )) : <span style={{ color: '#555', fontSize: '13px' }}>No managers assigned</span>}
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                  <Users size={16} /> Active Teams
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {currentRegion.teams?.length > 0 ? currentRegion.teams.map(t => (
                    <div key={t} style={{ background: '#121212', padding: '10px 15px', borderRadius: '8px', fontSize: '14px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {t} <ChevronRight size={14} style={{ color: '#444' }} />
                    </div>
                  )) : <div style={{ color: '#555', fontSize: '13px' }}>No teams created yet</div>}
                </div>
              </div>
            </div>
            
            <div style={{ padding: '20px', background: '#121212', textAlign: 'right' }}>
              <button onClick={() => setShowDetails(false)} style={{ background: '#333' }}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {regions.map(region => (
          <div key={region.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', cursor: 'pointer' }} onClick={() => handleViewDetails(region)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={22} style={{ color: '#6366f1' }} />
                <h3 style={{ margin: 0 }}>{region.name}</h3>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(region); }} style={{ background: '#2a2a2a', padding: '6px' }} title="Edit">
                  <Edit2 size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(region.id); }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '6px' }} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ fontSize: '12px', color: '#888', background: '#121212', padding: '8px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#ccc' }}>{region.task_count}</div>
                Tasks
              </div>
              <div style={{ fontSize: '12px', color: '#888', background: '#121212', padding: '8px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#ccc' }}>{region.agent_count}</div>
                Agents
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={12} /> {region.teams?.length || 0} Teams • Click to view details
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Regions;
