import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;

function FormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: 'Male',
    status: 'Active',
    profile: '',
    location: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch user data if editing
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setLoading(true)
        
        try {
          const response = await fetch(`${API_URL}/api/users/${id}`)
          const data = await response.json()
          
          if (!response.ok) {
            alert(data.error || 'Failed to fetch user data')
            navigate('/')
            return
          }
          
          // Pre-fill form with existing user data
          const userData = data.data
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            gender: userData.gender || 'Male',
            status: userData.status || 'Active',
            profile: userData.profile || '',
            location: userData.location || ''
          })
        } catch (error) {
          alert('Network error. Please try again.')
          navigate('/')
        } finally {
          setLoading(false)
        }
      }
      
      fetchUser()
    }
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Convert image to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profile: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.location) {
      alert('Please fill in all required fields')
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }
    
    // Validate mobile is exactly 10 digits
    const mobileRegex = /^[0-9]{10}$/
    if (!mobileRegex.test(formData.mobile)) {
      alert('Mobile number must be exactly 10 digits')
      return
    }
    
    setSubmitting(true)
    
    try {
      // Determine if creating or updating
      const url = id ? `${API_URL}/api/users/${id}` : `${API_URL}/api/users`
      const method = id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        alert(data.error || 'Something went wrong')
        return
      }
      
      alert(id ? 'User updated successfully!' : 'User created successfully!')
      navigate('/')
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.pageContainer}>
      {/* Dark Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>MERN stack developer practical task</h1>
      </div>

      <div style={styles.container}>
        {/* Back Button */}
        {id && (
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
        )}
        
        <h1 style={styles.title}>Register Your Details</h1>
        
        {loading && <div style={styles.message}>Loading user data...</div>}
        
        {!loading && (
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Profile Image Preview at Top Center */}
            <div style={styles.profileSection}>
              {formData.profile ? (
                <img 
                  src={formData.profile} 
                  alt="Profile" 
                  style={styles.profilePreview}
                />
              ) : (
                <div style={styles.profilePlaceholder}>
                  <span style={styles.profileIcon}>👤</span>
                </div>
              )}
            </div>

            {/* 2-Column Grid Layout */}
            <div style={styles.gridContainer}>
              {/* Left Column */}
              <div style={styles.column}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter FirstName"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Your Gender</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleChange}
                      />
                      {' '}Male
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleChange}
                      />
                      {' '}Female
                    </label>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Your Profile</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div style={styles.column}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter LastName"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter Mobile"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Your Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="">Select...</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Enter Your Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter Your Location"
                    style={styles.input}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Full Width Submit Button */}
            <button
              type="submit"
              style={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Submit'}
            </button>
          </form>
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
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '28px',
  },
  form: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  profileSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  profilePreview: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #ddd',
  },
  profilePlaceholder: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid #ddd',
  },
  profileIcon: {
    fontSize: '50px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '30px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    color: '#555',
    fontWeight: '500',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
    marginTop: '8px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#8B4545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
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
  message: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
    fontSize: '16px',
  },
}

export default FormPage
