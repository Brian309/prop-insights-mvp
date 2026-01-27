import { useEffect, useState } from 'react'

function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, critical: 0, avgLatency: 0 })

  const API_URL = "http://localhost:8000/properties"

  const fetchProperties = () => {
    setLoading(true)
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setProperties(data)
        // Calcular métricas para las tarjetas superiores (KPIs)
        const criticalCount = data.filter(p => p.status === 'critical').length
        const totalLatency = data.reduce((acc, curr) => acc + curr.latency_ms, 0)
        setStats({
          total: data.length,
          critical: criticalCount,
          avgLatency: Math.round(totalLatency / data.length)
        })
        setLoading(false)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchProperties()
    // Auto-refresh opcional cada 5s para efecto "Live" (descomentar si quieres)
    // const interval = setInterval(fetchProperties, 5000)
    // return () => clearInterval(interval)
  }, [])

  // --- ESTILOS "PRO" (CSS-in-JS para no configurar Tailwind) ---
  const styles = {
    body: { backgroundColor: '#0f172a', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', padding: '40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' },
    title: { fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px', color: '#f8fafc' },
    subtitle: { fontSize: '14px', color: '#94a3b8' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
    card: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    cardTitle: { fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
    cardValue: { fontSize: '32px', fontWeight: 'bold', color: '#fff' },
    tableContainer: { backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '16px', borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' },
    td: { padding: '16px', borderBottom: '1px solid #334155', color: '#e2e8f0' },
    btn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
    badge: (status) => ({
      padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
      backgroundColor: status === 'critical' ? 'rgba(239, 68, 68, 0.2)' : status === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
      color: status === 'critical' ? '#fca5a5' : status === 'warning' ? '#fcd34d' : '#86efac',
      display: 'inline-block'
    }),
    latencyBarBg: { width: '100px', height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' },
    latencyBarFill: (val) => ({ height: '100%', width: `${Math.min(val/10, 100)}%`, backgroundColor: val > 800 ? '#ef4444' : val > 300 ? '#f59e0b' : '#22c55e' })
  }

  return (
    <div style={styles.body}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>PropInsights Monitor</div>
          <div style={styles.subtitle}>Real-time Infrastructure Intelligence</div>
        </div>
        <button style={styles.btn} onClick={fetchProperties}>
          {loading ? 'Sincronizando...' : '↻ Actualizar Live'}
        </button>
      </div>

      {/* KPI Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Propiedades Activas</div>
          <div style={styles.cardValue}>{stats.total}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Incidentes Críticos</div>
          <div style={{...styles.cardValue, color: stats.critical > 0 ? '#ef4444' : '#fff'}}>
            {stats.critical}
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Latencia Promedio</div>
          <div style={styles.cardValue}>{stats.avgLatency} <span style={{fontSize:'16px', color:'#64748b'}}>ms</span></div>
        </div>
      </div>

      {/* Tabla Pro */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID Activo</th>
              <th style={styles.th}>Nombre de la Propiedad</th>
              <th style={styles.th}>Estado Operativo</th>
              <th style={styles.th}>Latencia de Red</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(prop => (
              <tr key={prop.id}>
                <td style={{...styles.td, fontFamily: 'monospace', color: '#64748b'}}>#{prop.id.toString().padStart(4, '0')}</td>
                <td style={{...styles.td, fontWeight: '500'}}>{prop.name}</td>
                <td style={styles.td}>
                  <span style={styles.badge(prop.status)}>
                    {prop.status.toUpperCase()}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div style={styles.latencyBarBg}>
                      <div style={styles.latencyBarFill(prop.latency_ms)}></div>
                    </div>
                    <span style={{fontFamily:'monospace', fontSize:'12px'}}>{prop.latency_ms}ms</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{marginTop:'30px', textAlign:'center', color:'#475569', fontSize:'12px'}}>
        PropInsights v1.0.4-beta | Powered by FastAPI & React | Dockerized Environment
      </div>
    </div>
  )
}

export default App