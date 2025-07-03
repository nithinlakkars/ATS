import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LeadsDashboard.css';

export default function LeadsDashboard() {
  const [requirements, setRequirements] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('newRequirements');
  const [selectedReqs, setSelectedReqs] = useState([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [allReqs, setAllReqs] = useState([]);
  const [myReqs, setMyReqs] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const leadEmail = user?.email;

  useEffect(() => {
    if (!leadEmail) return;

    const fetchAll = async () => {
      try {
        const [candidatesRes, unassignedReqs, myReqsRes, allReqsRes, recruitersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/candidates/leads'),
          axios.get('http://localhost:5000/api/requirements/leads/view'),
          axios.get(`http://localhost:5000/api/requirements/leads/my?email=${encodeURIComponent(leadEmail)}`),
          axios.get('http://localhost:5000/api/requirements/leads/view-all'),
          axios.get('http://localhost:5000/api/users/recruiters')
        ]);

        setCandidates(candidatesRes.data);
        setRequirements(unassignedReqs.data);
        setMyReqs(myReqsRes.data);
        setAllReqs(allReqsRes.data);
        setRecruiters(recruitersRes.data);
      } catch (error) {
        console.error("❌ Initial data load error:", error);
        setMessage('❌ Failed to load initial data');
      }
    };

    fetchAll();
  }, [leadEmail]);

  const handleBulkAssign = async () => {
    if (selectedReqs.length === 0 || selectedRecruiters.length === 0) {
      return alert('❌ Select at least one requirement and one recruiter');
    }
    try {
      await axios.put('http://localhost:5000/api/requirements/leads/assign-multiple', {
        requirementIds: selectedReqs,
        recruiterEmails: selectedRecruiters,
        leadEmail
      });
      setMessage('✅ Bulk assigned successfully');
      setSelectedReqs([]);
      setSelectedRecruiters([]);
      const res = await axios.get('http://localhost:5000/api/requirements/leads/view');
      setRequirements(res.data);
    } catch {
      setMessage('❌ Bulk assignment failed');
    }
  };

  const forwardToSales = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/candidates/leads/forward/${id}`, { forwardedBy: leadEmail });
      setMessage(res.data.message);
      setCandidates(prev => prev.filter(c => c._id !== id));
    } catch {
      setMessage('❌ Forwarding failed');
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="sidebar-hover col-md-3 col-lg-2 bg-dark sidebar text-white pt-3">
          <div className="position-sticky">
            <h5 className="text-warning text-center mb-4">📋 Sections</h5>
            <ul className="nav flex-column">
              <li className={`nav-link ${activeSection === 'newRequirements' ? 'text-light bg-success' : 'text-white'}`} onClick={() => setActiveSection('newRequirements')} role="button">🆕 New Requirements</li>
              <li className={`nav-link ${activeSection === 'assignedToMe' ? 'text-light bg-success' : 'text-white'}`} onClick={() => setActiveSection('assignedToMe')} role="button">📌 Assigned to Me</li>
              <li className={`nav-link ${activeSection === 'submittedCandidates' ? 'text-light bg-success' : 'text-white'}`} onClick={() => setActiveSection('submittedCandidates')} role="button">📦 Submitted Candidates</li>
              <li className={`nav-link ${activeSection === 'requirementHistory' ? 'text-light bg-success' : 'text-white'}`} onClick={() => setActiveSection('requirementHistory')} role="button">📚 History</li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <h2 className="text-center text-success mb-4">📤 Leads Dashboard</h2>
          {message && (
            <div className={`alert ${message.startsWith('❌') ? 'alert-danger' : 'alert-success'} text-center`}>
              {message}
            </div>
          )}

          {activeSection === 'newRequirements' && (
            <section>
              <h4 className="text-primary mb-3">📋 New Requirements from Sales</h4>
              {requirements.length === 0 ? (
                <p className="text-muted">No new requirements to assign.</p>
              ) : (
                <>
                  <div className="mb-3">
                    <h6>Select Requirements</h6>
                    {requirements.map(req => (
                      <div key={req._id} className="form-check border rounded p-3 mb-2 bg-light">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          id={`req-${req._id}`}
                          checked={selectedReqs.includes(req._id)}
                          onChange={e => {
                            setSelectedReqs(prev =>
                              e.target.checked ? [...prev, req._id] : prev.filter(id => id !== req._id)
                            );
                          }}
                        />
                        <label className="form-check-label w-100" htmlFor={`req-${req._id}`}>
                          <strong>Title:</strong> {req.title} <br />
                          <strong>Location:</strong> {req.locations?.join(', ') || 'N/A'} <br />
                          <strong>Rate:</strong> {req.rate || 'N/A'} <br />
                          <strong>Employment Type:</strong> {req.employmentType || 'N/A'} <br />
                          <strong>Work Setting:</strong> {req.workSetting || 'N/A'} <br />
                          <strong>Skills:</strong> {req.primarySkills || 'N/A'} <br />
                          {expandedDescriptions.includes(req._id) ? (
                            <>
                              <strong>Description:</strong> {req.description || 'N/A'} <br />
                              <button type="button" className="btn btn-link p-0" onClick={() => toggleDescription(req._id)}>
                                🔽 View Less
                              </button>
                            </>
                          ) : (
                            <button type="button" className="btn btn-link p-0" onClick={() => toggleDescription(req._id)}>
                              🔼 View More
                            </button>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <h6>Select Recruiters</h6>
                    {recruiters.map(r => (
                      <div key={r.email} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`rec-${r.email}`}
                          checked={selectedRecruiters.includes(r.email)}
                          onChange={e => {
                            setSelectedRecruiters(prev =>
                              e.target.checked ? [...prev, r.email] : prev.filter(email => email !== r.email)
                            );
                          }}
                        />
                        <label className="form-check-label" htmlFor={`rec-${r.email}`}>{r.name || r.email}</label>
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-success mb-4" onClick={handleBulkAssign} disabled={selectedReqs.length === 0 || selectedRecruiters.length === 0}>
                    🎯 Assign Selected Requirements
                  </button>
                </>
              )}
            </section>
          )}

          {activeSection === 'assignedToMe' && (
            <section>
              <h4 className="text-primary mb-3">📌 Requirements Assigned to Me</h4>
              {myReqs.length === 0 ? (
                <p className="text-muted">No requirements have been assigned to you yet.</p>
              ) : (
                myReqs.map(req => (
                  <div key={req._id} className="card mb-3 border-primary">
                    <div className="card-body">
                      <h5>{req.title}</h5>
                      <p>{req.description}</p>
                      <small>Status: {req.status}</small>
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

        {activeSection === 'submittedCandidates' && (
  <section>
    <h4 className="text-primary mb-3">📦 Candidates Submitted by Recruiters</h4>
    <div className="row">
      {candidates.map(candidate => (
        <div key={candidate._id} className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 border shadow-sm p-3">
            <h5 className="text-success">👤 {candidate.name}</h5>
            <p><strong>Role:</strong> {candidate.role || candidate.Role || 'N/A'}</p>
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
            <button className="btn btn-success w-100" onClick={() => forwardToSales(candidate._id)}>
              🚀 Forward to Sales
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

          {activeSection === 'requirementHistory' && (
            <section>
              <h4 className="text-primary mb-3">📚 Full Requirement History</h4>
              {allReqs.length === 0 ? (
                <p className="text-muted">No requirements in history.</p>
              ) : (
                allReqs.map(req => (
                  <div key={req._id} className="card mb-3 border-secondary shadow-sm">
                    <div className="card-body">
                      <h6 className="text-secondary">{req.title}</h6>
                      <p>{req.description}</p>
                      <small>Sales: {req.createdBy} | Lead: {req.leadAssignedTo || '—'} | Recruiter: {Array.isArray(req.recruiterAssignedTo) ? req.recruiterAssignedTo.join(', ') : req.recruiterAssignedTo || '—'}</small>
                    </div>
                  </div>
                ))
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
