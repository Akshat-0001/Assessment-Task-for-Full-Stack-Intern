import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function DetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user details')
        }
        
        setUser(data.data)
      } catch (err) {
        setError(err.message)
        alert(`Error: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>MERN stack developer practical task</h1>
        </div>
        <div style={styles.container}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
          <h1 style={styles.title}>User Details</h1>
          <div style={styles.message}>Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>MERN stack developer practical task</h1>
        </div>
        <div style={styles.container}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
          <h1 style={styles.title}>User Details</h1>
          <div style={styles.errorMessage}>Error: {error}</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>MERN stack developer practical task</h1>
        </div>
        <div style={styles.container}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
          <h1 style={styles.title}>User Details</h1>
          <div style={styles.message}>User not found</div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.pageContainer}>
      {/* Dark Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>MERN stack developer practical task</h1>
      </div>

      <div style={styles.container}>
        {/* Back Button */}
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
        
        <h1 style={styles.title}>User Details</h1>
      
        <div style={styles.card}>
          {user.profile && (
            <div style={styles.profileSection}>
              <img 
                src={user.profile} 
                alt={`${user.firstName} ${user.lastName}`}
                style={styles.profileImage}
              />
            </div>
          )}
          
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Name:</span>
              <span style={styles.detailValue}>{user.firstName} {user.lastName}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Email:</span>
              <span style={styles.detailValue}>{user.email}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Mobile:</span>
              <span style={styles.detailValue}>{user.mobile}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Gender:</span>
              <span style={styles.detailValue}>{user.gender}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Status:</span>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: user.status === 'Active' ? '#4caf50' : '#f44336'
              }}>
                {user.status}
              </span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Location:</span>
              <span style={styles.detailValue}>{user.location}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Created At:</span>
              <span style={styles.detailValue}>{new Date(user.createdAt).toLocaleString()}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Updated At:</span>
              <span style={styles.detailValue}>{new Date(user.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: '15px 0',
    marginBottom: '30px',
  },
  headerTitle: {
    color: 'white',
    textAlign: 'center',
    margin: 0,
    fontSize: '18px',
    fontWeight: '400',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '28px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 0',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  card: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  profileSection: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  detailsGrid: {
    display: 'grid',
    gap: '20px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#555',
    minWidth: '140px',
    fontSize: '14px',
  },
  detailValue: {
    color: '#333',
    fontSize: '14px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
  },
  message: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
    fontSize: '16px',
  },
  errorMessage: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#f44336',
    fontSize: '16px',
  },
}

export default DetailsPage
