// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    if (!form || !submitBtn || !formMessage) {
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validate
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json().catch(() => ({
                success: false,
                message: 'Unexpected server response. Please try again.'
            }));

            if (data.success) {
                showMessage(data.message, 'success');
                form.reset();
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to send message. Please try again.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.classList.remove('hidden');
        
        if (type === 'success') {
            formMessage.classList.remove('text-red-500', 'bg-red-500/10');
            formMessage.classList.add('text-green-500', 'bg-green-500/10');
        } else {
            formMessage.classList.remove('text-green-500', 'bg-green-500/10');
            formMessage.classList.add('text-red-500', 'bg-red-500/10');
        }

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
});
