-- Create the database
CREATE DATABASE IF NOT EXISTS db_api;
USE db_api;

-- Users table
CREATE TABLE users (
    user_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','patient') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE admins (
    admin_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    suffix VARCHAR(50),
    email VARCHAR(100),
    contact_no VARCHAR(20),
    gender ENUM('Male','Female','Other'),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Patients table
CREATE TABLE patients (
    patient_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    suffix VARCHAR(50),
    address VARCHAR(255),
    gender ENUM('Male','Female','Other'),
    date_of_birth DATE,
    email VARCHAR(100),
    contact_no VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Inventory table
CREATE TABLE inventory (
    inventory_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stock INT(11) NOT NULL DEFAULT 0,
    category ENUM('Medicine','Equipment') NOT NULL
);

-- Items table
CREATE TABLE items (
    item_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    inventory_id INT(11) NOT NULL,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE
);

-- Procedures table
CREATE TABLE procedures (
    procedure_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    procedure_name VARCHAR(100) NOT NULL,
    cost FLOAT,
    item_id INT(11) NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- Procedure Items table
CREATE TABLE procedure_items (
    procedure_items_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    procedure_id INT(11) NOT NULL,
    item_id INT(11) NOT NULL,
    quantity_used INT(11) NOT NULL DEFAULT 1,
    FOREIGN KEY (procedure_id) REFERENCES procedures(procedure_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE appointments (
    appointment_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT(11) NOT NULL,
    admin_id INT(11),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('Pending','Confirmed','Done','Canceled') DEFAULT 'Pending',
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- Appointment Procedures table
CREATE TABLE appointment_procedures (
    appointment_procedure_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT(11) NOT NULL,
    procedure_items_id INT(11) NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (procedure_items_id) REFERENCES procedure_items(procedure_items_id) ON DELETE CASCADE
);

ALTER TABLE patients
ADD COLUMN `region` VARCHAR(100),
ADD COLUMN `province` VARCHAR(100),
ADD COLUMN `city` VARCHAR(100),
ADD COLUMN `barangay` VARCHAR(100),
ADD COLUMN `postal_code` VARCHAR(20);
