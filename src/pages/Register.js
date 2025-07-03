import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  try {
    await axios.post('http://localhost:5000/api/auth/register', formData);
    setMessage('✅ Registration successful!');
    setFormData({ username: '', email: '', password: '', role: '' });
  } catch (err) {
    console.error('❌ Registration error:', err.response?.data || err.message);
    setMessage('❌ Registration failed. Please check all fields.');
  }
};

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-4 text-primary">Register</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input type="text" name="username" className="form-control" required value={formData.username} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select name="role" className="form-control" required value={formData.role} onChange={handleChange}>
            <option value="">-- Select Role --</option>
            <option value="admin">Admin</option>
            <option value="recruiter">Recruiter</option>
            {/* <option value="candidate">Candidate</option> */}
            <option value="candidate">Sales</option>
            <option value="candidate">Leads</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}
