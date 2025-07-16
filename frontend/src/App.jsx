import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = import.meta.env.VITE_API_URL

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(API + '/upload', formData);
      setFile(null);
      fetchFiles(); // Refresh after upload
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API + '/files');
      setFiles(res.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container">
      <h1>File Upload Dashboard</h1>

      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>

      <h2>Uploaded Files</h2>
      <ul className="file-list">
        {files.map((f) => (
          <li key={f._id}>
            <span>{f.filename}</span>
            <a
              href={`${API}/${f.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
