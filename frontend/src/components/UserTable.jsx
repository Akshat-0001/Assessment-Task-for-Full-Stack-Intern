import { useState } from 'react'

function UserTable({ users, onView, onEdit, onDelete, onStatusChange }) {
  const [openMenuId, setOpenMenuId] = useState(null)

  const handleStatusChange = async (userId, newStatus) => {
    if (onStatusChange) {
      await onStatusChange(userId, newStatus)
    }
  }

  const toggleMenu = (userId) => {
    setOpenMenuId(openMenuId === userId ? null : userId)
  }

  const handleAction = (action, userId) => {
    setOpenMenuId(null)
    action(userId)
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>FullName</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Profile</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{user.firstName} {user.lastName}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.gender.charAt(0)}</td>
                <td style={styles.td}>
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user._id, e.target.value)}
                    style={{
                      ...styles.statusDropdown,
                      backgroundColor: user.status === 'Active' ? '#a94442' : '#999'
                    }}
                  >
                    <option value="Active" style={styles.option}>Active</option>
                    <option value="Inactive" style={styles.option}>InActive</option>
                  </select>
                </td>
                <td style={styles.td}>
                  {user.profile ? (
                    <img 
                      src={user.profile} 
                      alt={`${user.firstName} ${user.lastName}`}
                      style={styles.profileImg}
                    />
                  ) : (
                    <div style={styles.placeholder}>👤</div>
                  )}
                </td>
                <td style={styles.td}>
                  <div style={styles.menuContainer}>
                    <button 
                      onClick={() => toggleMenu(user._id)}
                      style={styles.menuButton}
                    >
                      ⋮
                    </button>
                    {openMenuId === user._id && (
                      <div style={styles.dropdown}>
                        <button 
                          onClick={() => handleAction(onView, user._id)}
                          style={{...styles.dropdownItem, color: '#4caf50'}}
                        >
                          👁 View
                        </button>
                        <button 
                          onClick={() => handleAction(onEdit, user._id)}
                          style={{...styles.dropdownItem, color: '#2196f3'}}
                        >
                          ✏ Edit
                        </button>
                        <button 
                          onClick={() => handleAction(onDelete, user._id)}
                          style={{...styles.dropdownItem, color: '#f44336'}}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{...styles.td, textAlign: 'center', padding: '20px'}}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  tableWrapper: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'visible',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#2c3e50',
  },
  th: {
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: '600',
    color: 'white',
    fontSize: '14px',
  },
  tr: {
    borderBottom: '1px solid #f0f0f0',
  },
  td: {
    padding: '16px 12px',
    fontSize: '14px',
    color: '#555',
  },
  profileImg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #f0f0f0',
  },
  placeholder: {
    fontSize: '24px',
  },
  statusDropdown: {
    padding: '8px 16px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'auto',
  },
  option: {
    backgroundColor: 'white',
    color: '#333',
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px 10px',
    color: '#666',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '120px',
    marginTop: '4px',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
}

export default UserTable
