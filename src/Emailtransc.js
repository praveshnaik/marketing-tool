import React, { useState } from 'react';
import axios from 'axios';

const Emailtransc = () => {
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSendEmails = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/sending-emails', {
                recipients: recipients.split(',').map(email => email.trim()),
                subject,
                message
            });
            setStatus(response.data);
        } catch (error) {
            console.error(error);
            setStatus('Error sending emails');
        }
    };

    return (
        <div>
            <h1>Bulk Email Sender</h1>
            <form onSubmit={handleSendEmails}>
                <div>
                    <label>Recipients:</label>
                    <input
                        type="text"
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Subject:</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Message:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Emails</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default Emailtransc;
