select * from students;

USE student_management;

INSERT INTO students (id, name, gender, dob, year_of_admission, course, street, city, state, postal_code, phone, email) VALUES
(UUID(), 'Rahul Sharma', 'Male', '2003-05-14', 2021, 'Computer Engineering', 'FC Road', 'Pune', 'Maharashtra', '411004', '9876543210', 'rahul.s@example.com'),
(UUID(), 'Priya Patel', 'Female', '2004-08-22', 2022, 'Data Science', 'MG Road', 'Mumbai', 'Maharashtra', '400001', '9123456789', 'priya.p@example.com'),
(UUID(), 'Amit Kumar', 'Male', '2002-11-30', 2020, 'Information Technology', 'Ring Road', 'Delhi', 'Delhi', '110001', '9988776655', 'amit.k@example.com'),
(UUID(), 'Neha Singh', 'Female', '2003-01-15', 2021, 'Artificial Intelligence & Machine Learning', 'Link Road', 'Bhopal', 'Madhya Pradesh', '462001', '9776655443', 'neha.s@example.com');