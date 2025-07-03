import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RecruiterSubmit() {
  const [formData, setFormData] = useState({
    name: '', role: '', rate: '', phone: '', email: '', source: '', addedBy: ''
  });
  const [resume, setResume] = useState([]);
  const [message, setMessage] = useState('');
  const [submittedCandidates, setSubmittedCandidates] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormId, setShowFormId] = useState(null);
  const [expandedReq, setExpandedReq] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) return;

    setFormData(prev => ({ ...prev, addedBy: userEmail }));

    const fetchAssignedRequirements = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/requirements/recruiter/view?email=${userEmail}`);
        setRequirements(res.data);
      } catch (error) {
        console.error('❌ Failed to fetch requirements', error);
      }
    };

    const fetchMyCandidates = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/candidates/leads');
        const myCandidates = res.data.filter(c => c.addedBy === userEmail);
        setSubmittedCandidates(myCandidates);
      } catch (error) {
        console.error('❌ Failed to fetch candidates', error);
      }
    };

    fetchAssignedRequirements();
    fetchMyCandidates();
  }, [userEmail]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setResume(Array.from(e.target.files));
  };

  const handleSubmit = async (e, reqId) => {
    e.preventDefault();
    if (!resume.length) return setMessage('❌ Please upload at least one resume');

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    resume.forEach(file => data.append('resumes', file));
    data.append('requirementId', reqId);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/candidates/recruiter/upload', data);
      setMessage(`✅ ${res.data.message}`);
      setFormData({ name: '', role: '', rate: '', phone: '', email: '', source: '', addedBy: userEmail });
      setResume([]);
      setShowFormId(null);

      const updatedCandidates = await axios.get('http://localhost:5000/api/candidates/leads');
      const myCandidates = updatedCandidates.data.filter(c => c.addedBy === userEmail);
      setSubmittedCandidates(myCandidates);
    } catch {
      setMessage('❌ Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '950px' }}>
      <h2 className="text-center text-primary mb-4">👷 Recruiter Dashboard</h2>

      {/* ✅ Assigned Requirements */}
      <div className="mb-5">
        <h4 className="text-success">📌 Assigned Requirements from Leads</h4>
        {requirements.length === 0 ? (
          <p className="text-muted">No requirements assigned yet.</p>
        ) : (
          <div className="row">
            {requirements.map((req) => (
              <div key={req._id} className="col-md-6 mb-4">
                <div className="card shadow-sm border-success">
                  <div className="card-body">
                    <h5 className="card-title">{req.title}</h5>
                    <p><strong>Location:</strong> {req.locations?.join(', ')}</p>
                    <p><strong>Rate:</strong> {req.rate}</p>
                    <p><strong>Skills:</strong> {req.primarySkills}</p>
                    <p><strong>Employment:</strong> {req.employmentType}</p>
                    <p><strong>Setting:</strong> {req.workSetting}</p>
                    <button className="btn btn-sm btn-link p-0 text-primary" onClick={() => setExpandedReq(expandedReq === req._id ? null : req._id)}>
                      {expandedReq === req._id ? 'Hide Description' : 'View Description'}
                    </button>
                    {expandedReq === req._id && <p className="mt-2">{req.description}</p>}
                    <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => setShowFormId(req._id)}>Apply</button>
                  </div>

                  {showFormId === req._id && (
                    <form onSubmit={(e) => handleSubmit(e, req._id)} className="p-3 border-top">
                      <h6>Apply for: {req.title}</h6>
                      <input type="text" name="name" className="form-control mb-2" placeholder="Candidate Name" value={formData.name} onChange={handleChange} required />
                      <input type="text" name="role" className="form-control mb-2" placeholder="Role" value={formData.role} onChange={handleChange} required />
                      <input type="text" name="rate" className="form-control mb-2" placeholder="Rate" value={formData.rate} onChange={handleChange} required />
                      <input type="tel" name="phone" className="form-control mb-2" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                      <input type="email" name="email" className="form-control mb-2" placeholder="Email" value={formData.email} onChange={handleChange} required />
                      <input type="text" name="source" className="form-control mb-2" placeholder="Source" value={formData.source} onChange={handleChange} required />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="form-control mb-2"
                        onChange={handleFileChange}
                        multiple
                        required
                      />
                      <button type="submit" className="btn btn-sm btn-success w-100" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Feedback */}
      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>{message}</div>
      )}

      {/* ✅ Submitted Candidates */}
      <h4 className="text-info mb-3">🧾 Your Submitted Candidates</h4>
      {submittedCandidates.length === 0 ? (
        <p className="text-muted">No submissions yet.</p>
      ) : (
        <div className="row">
          {submittedCandidates.map(c => (
            <div key={c._id} className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{c.name}</h5>
                  <p><strong>Role:</strong> {c.role || 'N/A'}</p>
                  <p><strong>Email:</strong> {c.email}</p>
                  <p><strong>Phone:</strong> {c.phone}</p>
                  <p><strong>Rate:</strong> {c.rate || 'N/A'}</p>

                  {/* Handle single or multiple resumeUrls */}
                  {Array.isArray(c.resumeUrls) ? (
                    c.resumeUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={`http://localhost:5000/${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary me-2 mb-2"
                      >
                        📎 View Resume {idx + 1}
                      </a>
                    ))
                  ) : c.resumeUrl ? (
                    <a
                      href={`http://localhost:5000/${c.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      📎 View Resume
                    </a>
                  ) : (
                    <p className="text-muted">No resumes attached</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
