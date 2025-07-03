// src/pages/LeadsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function LeadsPage() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/candidates/leads')
      .then((res) => setCandidates(res.data))
      .catch((err) => console.error('Error loading candidates:', err));
  }, []);

  const handleForward = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/candidates/leads/forward/${id}`);
      setMessage(res.data.message);
      setCandidates(prev => prev.filter(candidate => candidate._id !== id));
    } catch (err) {
      console.error('Forwarding failed:', err);
      setMessage('❌ Failed to forward candidate.');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Leads Dashboard: Review & Forward</h3>

      {message && <div className="alert alert-info">{message}</div>}

      {candidates.length === 0 ? (
        <p>No new recruiter submissions.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Resume</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate._id}>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>
                  {candidate.resumeUrl ? (
                    <a href={candidate.resumeUrl} target="_blank" rel="noreferrer">View</a>
                  ) : 'N/A'}
                </td>
                <td>{candidate.notes || '-'}</td>
                <td>
                  <button
                    onClick={() => handleForward(candidate._id)}
                    className="btn btn-success btn-sm"
                  >
                    Forward to Sales
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
