// src/pages/SalesPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SalesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/candidates/sales')
      .then((res) => {
        setCandidates(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching sales candidates:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-success">Sales Dashboard - Final Candidate List</h2>

      {loading ? (
        <p className="text-center">Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <p className="text-center text-muted">No candidates forwarded to sales yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark text-center">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Notes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id} className="align-middle text-center">
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.sourceRole}</td>
                  <td>{c.notes || '—'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
