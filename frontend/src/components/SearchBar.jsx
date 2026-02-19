function SearchBar({ onSearch }) {
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search by name or email..."
        onChange={(e) => onSearch(e.target.value)}
        style={styles.input}
      />
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  }
}

export default SearchBar
