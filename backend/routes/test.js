// routes/test.js
router.get('/test-email', async (req, res) => {
    try {
      await transporter.sendMail({
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test email'
      });
      res.send('Email sent successfully');
    } catch (error) {
      console.error('Email test error:', error);
      res.status(500).send('Failed to send test email');
    }
  });