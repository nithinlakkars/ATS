import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SalesDashboard() {
    const [submittedReqs, setSubmittedReqs] = useState([]);
    const [forwardedCandidates, setForwardedCandidates] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email;

    useEffect(() => {
        if (!userEmail) return;

        axios.get(`http://localhost:5000/api/requirements/sales/view?email=${userEmail}`)
            .then(res => setSubmittedReqs(res.data))
            .catch(() => console.log('Failed to load requirements'));

        axios.get('http://localhost:5000/api/candidates/sales')
            .then(res => setForwardedCandidates(res.data))
            .catch(() => console.log('Failed to load forwarded candidates'));
    }, [userEmail]);

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">🚀 Sales Dashboard</h2>
                <p className="text-muted">Submit job requirements to Leads and track them</p>
            </div>

            {/* Posted Requirements */}
            <div className="mb-5">
                <h4 className="mb-3">📄 Posted Requirements</h4>
                {submittedReqs.length === 0 ? (
                    <p className="text-muted">You haven’t submitted any requirements yet.</p>
                ) : (
                    submittedReqs.map(req => (
                        <div key={req._id} className="border rounded p-3 mb-2 shadow-sm">
                            <strong>{req.title}</strong>
                            <p className="mb-1">Assigned to: {req.leadAssignedTo}</p>
                            <p className="mb-1">Location(s): {req.locations?.join(', ')}</p>
                            <p className="mb-1">Rate: {req.rate}</p>
                            <p className="mb-1">Skills: {req.primarySkills}</p>
                            <details>
                                <summary className="text-primary">View Description</summary>
                                <p className="mt-2">{req.description}</p>
                            </details>
                        </div>
                    ))
                )}
            </div>

            {/* Forwarded Candidates */}
            <div className="mb-5">
                <h4 className="mb-3 text-success">📦 Candidates Forwarded by Leads</h4>
                {forwardedCandidates.length === 0 ? (
                    <p className="text-muted">No candidates forwarded yet.</p>
                ) : (
                    <div className="row">
                        {forwardedCandidates.map(candidate => (
                            <div key={candidate._id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100 border shadow-sm p-3">
                                    <h5 className="text-success">👤 {candidate.name}</h5>
                                    <p><strong>Role:</strong> {candidate.role || 'N/A'}</p>
                                    <p><strong>Email:</strong> {candidate.email}</p>
                                    <p><strong>Phone:</strong> {candidate.phone}</p>
                                    <p><strong>Rate:</strong> {candidate.rate || candidate.Rate || 'N/A'}</p>
                                    <p><strong>Submitted by:</strong> {candidate.addedBy}</p>
                                    {candidate.resumeUrl && (
                                        <a
                                            href={`http://localhost:5000/${candidate.resumeUrl}`}
                                            className="btn btn-sm btn-outline-primary w-100 mb-2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            📎 View Resume
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
