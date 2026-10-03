const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Update with your local MySQL Workbench credentials
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Spyrob@2909',
  database: 'student_management',
  waitForConnections: true,
  connectionLimit: 10
});

// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
    const formatted = rows.map(r => ({
      id: r.id,
      name: r.name,
      gender: r.gender,
      dob: r.dob ? r.dob.toISOString().split('T')[0] : '',
      yearOfAdmission: Number(r.year_of_admission),
      course: r.course,
      address: {
        street: r.street,
        city: r.city,
        state: r.state,
        postalCode: r.postal_code
      },
      contact: {
        phone: r.phone,
        email: r.email
      }
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create student
app.post('/api/students', async (req, res) => {
  const s = req.body;
  const sql = `INSERT INTO students (id, name, gender, dob, year_of_admission, course, street, city, state, postal_code, phone, email)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    await pool.query(sql, [
      s.id, s.name, s.gender, s.dob, s.yearOfAdmission, s.course,
      s.address.street, s.address.city, s.address.state, s.address.postalCode,
      s.contact.phone, s.contact.email
    ]);
    res.status(201).json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update student
app.put('/api/students/:id', async (req, res) => {
  const s = req.body;
  const sql = `UPDATE students SET name=?, gender=?, dob=?, year_of_admission=?, course=?,
               street=?, city=?, state=?, postal_code=?, phone=?, email=? WHERE id=?`;
  try {
    await pool.query(sql, [
      s.name, s.gender, s.dob, s.yearOfAdmission, s.course,
      s.address.street, s.address.city, s.address.state, s.address.postalCode,
      s.contact.phone, s.contact.email, req.params.id
    ]);
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
app.delete('/api/students/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));