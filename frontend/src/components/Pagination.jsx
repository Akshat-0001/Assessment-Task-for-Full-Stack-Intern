function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div style={styles.container}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        style={{
          ...styles.button,
          ...(currentPage === 1 ? styles.buttonDisabled : {})
        }}
      >
        ‹
      </button>
      
      <span style={styles.pageNumber}>
        {currentPage}
      </span>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={{
          ...styles.button,
          ...(currentPage === totalPages ? styles.buttonDisabled : {})
        }}
      >
        ›
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
    padding: '16px 0',
  },
  button: {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#666',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#ccc',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  pageNumber: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    backgroundColor: '#8B4545',
    borderRadius: '4px',
  },
}

export default Pagination
