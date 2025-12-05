import React, { useState } from 'react';
import * as z from "zod";

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    age: z.coerce.number().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((data) => !data.phone || /^\d{10}$/.test(data.phone), {
    path: ['phone'],
    message: 'Phone must be 10 digits'
  })
  .refine((data) =>
    data.age === undefined || (data.age >= 18 && data.age <= 100),
    {
      path: ['age'],
      message: 'Age must be between 18 and 100',
    }
  );

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      phone: formData.phone === '' ? undefined : formData.phone.replace(/\D/g, ''),
      age: formData.age.trim() === '' ? undefined : formData.age,
    };

    const result = schema.safeParse(payload);

    if (!result.success) {
      const newErrors = {};
     (result.error.issues || []).forEach((issue) => {
        const key = issue.path[0] || '_';
        newErrors[key] = issue.message;
      });

      setErrors(newErrors);
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    console.log('Form submitted:', result.data);

    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      age: '',
    });

    setErrors({});
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h2>
        Form Validation with <span style={{ color: "red" }}>ZOD</span>
      </h2>

      {submitted && (
        <p style={{ color: 'green' }}>✓ Form submitted successfully!</p>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          value={formData.name}
          placeholder="required"
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="email"
          name="email"
          value={formData.email}
          placeholder="required"
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          placeholder="required"
          onChange={handleChange}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="required"
          error={errors.confirmPassword}
        />
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="1234567890(Not required)"
          error={errors.phone}
        />
        <Input
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="18(Not required)"
          error={errors.age}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>

      </form>
    </div>
  );
};
const Input = ({ label, error, ...rest }) => (
  <div style={{ marginBottom: '15px' }}>
    <label>{label}:</label>
    <input
      {...rest}
      style={{
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: error ? '2px solid red' : '1px solid #ccc'
      }}
    />
    {error && (
      <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>
    )}
  </div>
);

export default App;
