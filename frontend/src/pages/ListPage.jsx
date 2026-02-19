import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserTable from '../components/UserTable'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

const API_URL = import.meta.env.VITE_API_URL;

function ListPage() {
  const navigate = useNavigate()
  
  // State management
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)

  // Fetch users on component mount and when page changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`${API_URL}/api/users?page=${currentPage}&limit=6`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch users')
        }
        
        setUsers(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } catch (err) {
        setError(err.message)
        alert(`Error: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage])

  // Search users when search term changes
  useEffect(() => {
    const searchUsers = async () => {
      const trimmedSearch = searchTerm.trim();
      
      if (!trimmedSearch) {
        // If search term is empty, reset to page 1 and fetch normally
        setCurrentPage(1)
        return
      }

      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(trimmedSearch)}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to search users')
        }
        
        setUsers(data.data || [])
        setTotalPages(1) // Search results don't have pagination
      } catch (err) {
        setError(err.message)
        alert(`Error: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchUsers()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Handle search term change
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Handle delete user
  const handleDelete = async (userId) => {
    // Show confirmation alert before deleting
    const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
    
    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user')
      }
      
      // Show success alert
      alert('User deleted successfully!')
      
      // Refresh user list after successful deletion
      // If we're on a page with only one user and it's not page 1, go back one page
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        // Otherwise, refresh the current page
        try {
          const fetchResponse = await fetch(`${API_URL}/api/users?page=${currentPage}&limit=6`)
          const fetchData = await fetchResponse.json()
          
          if (!fetchResponse.ok) {
            throw new Error(fetchData.error || 'Failed to refresh user list')
          }
          
          setUsers(fetchData.data || [])
          setTotalPages(fetchData.pagination?.totalPages || 1)
        } catch (refreshErr) {
          alert(`Error refreshing list: ${refreshErr.message}`)
        }
      }
    } catch (err) {
      // Show error alert if deletion fails
      alert(`Error: ${err.message}`)
    }
  }

  // Handle view user
  const handleView = (userId) => {
    navigate(`/user/${userId}`)
  }

  // Handle edit user
  const handleEdit = (userId) => {
    navigate(`/edit/${userId}`)
  }

  // Handle export CSV
  const handleExportCSV = async () => {
    setExporting(true)
    
    try {
      const response = await fetch(`${API_URL}/api/users/export`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to export users')
      }
      
      // Get the CSV content as blob
      const blob = await response.blob()
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob)
      
      // Create a temporary anchor element to trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = 'users.csv'
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('Users exported successfully!')
    } catch (err) {
      alert(`Error: ${err.message}`)
    } finally {
      setExporting(false)
    }
  }

  // Handle status change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Find the user to get all their data
      const user = users.find(u => u._id === userId)
      if (!user) return

      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...user,
          status: newStatus
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status')
      }

      // Update the user in the local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, status: newStatus } : u
      ))

      alert('Status updated successfully!')
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  return (
    <div style={styles.pageContainer}>
      {/* Dark Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>MERN stack developer practical task</h1>
      </div>

      <div style={styles.content}>
        {/* Search and Action Buttons */}
        <div style={styles.topBar}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.searchButton}>Search</button>
          </div>
          
          <div style={styles.actionButtons}>
            <button onClick={() => navigate('/add')} style={styles.addButton}>
              + Add User
            </button>
            <button 
              onClick={handleExportCSV} 
              style={styles.exportButton}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : 'Export To Csv'}
            </button>
          </div>
        </div>
        
        {loading && <div style={styles.message}>Loading...</div>}
        {error && <div style={styles.errorMessage}>Error: {error}</div>}
        
        {!loading && users.length === 0 && (
          <div style={styles.emptyState}>No users found.</div>
        )}
        
        {!loading && users.length > 0 && (
          <>
            <UserTable 
              users={users}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
            {!searchTerm && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
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
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '20px',
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    flex: '0 0 auto',
  },
  searchInput: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '250px',
  },
  searchButton: {
    padding: '10px 25px',
    backgroundColor: '#8B4545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#8B4545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  exportButton: {
    padding: '10px 20px',
    backgroundColor: '#8B4545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
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
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999',
    fontSize: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }
}

export default ListPage
