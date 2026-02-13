# EmailJS Setup Instructions

To enable the contact form to send emails directly to your inbox, follow these steps:

1.  **Create an account** at [EmailJS](https://www.emailjs.com/).
2.  **Add a New Service**: Connect your email provider (like Gmail). Note down the `Service ID`.
3.  **Create a New Template**: 
    - Use the following variables in your template: `{{from_name}}`, `{{from_email}}`, `{{message}}`, and `{{to_name}}`.
    - Note down the `Template ID`.
4.  **Get your Public Key**: Go to the "Account" section and find your `Public Key`.

### 📧 Recipient Email
Once you connect your email service (like Gmail) in Step 2, all messages sent through the contact form will be delivered to the email address associated with that service (which should be **bhargawpradhan@gmail.com**).

### Update the Code

In `src/components/ContactSection.tsx`, replace the placeholders with your actual credentials:

const result = await emailjs.send(
  'YOUR_SERVICE_ID', // Replace with your Service ID
  'YOUR_TEMPLATE_ID', // Replace with your Template ID
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    to_name: 'Bhargaw',
  },
  'YOUR_PUBLIC_KEY' // Replace with your Public Key
);
```

> [!TIP]
> Alternatively, you can use `.env` variables if you prefer not to hardcode them. Use `import.meta.env.VITE_EMAILJS_SERVICE_ID`, etc.
