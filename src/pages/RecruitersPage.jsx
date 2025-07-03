// src/pages/RecruiterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function RecruiterPage() {
    const [candidates, setCandidates] = useState([]);
    const [message, setMessage] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            setCandidates(data);
        };

        reader.readAsBinaryString(file);
    };

    const handleSubmit = async () => {
        try {
            const responses = await Promise.all(
                candidates.map(candidate =>
                    axios.post('http://localhost:5000/api/candidates/recruiter/submit', candidate)
                )
            );
            setMessage(`✅ Uploaded ${responses.length} candidates.`);
            setCandidates([]);
        } catch (err) {
            console.error('❌ Upload error:', err);
            setMessage('Upload failed.');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-3">Recruiter Excel Upload</h3>

            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control mb-3" />

            {candidates.length > 0 && (
                <>
                    <p>📋 Preview: {candidates.length} candidates loaded.</p>
                    <button className="btn btn-primary" onClick={handleSubmit}>Submit Candidates</button>
                </>
            )}

            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
}
