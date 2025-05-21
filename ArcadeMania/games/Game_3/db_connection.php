<?php
$servername = "localhost"; // Your database server (usually localhost)
$username = "root";        // Your database username (default for XAMPP is "root")
$password = "";            // Your database password (default for XAMPP is empty)
$dbname = "arcade_mania";  // Replace with your database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>