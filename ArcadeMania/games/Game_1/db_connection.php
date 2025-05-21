<?php
$servername = "srv1.tarhely.pro"; // Your database server (usually localhost)
$username = "v2labgwj_kando3";        // Your database username (default for XAMPP is "root")
$password = "UjNSCL6gLDHQGbCuNRch";   // Your database password (default for XAMPP is empty)
$dbname = "v2labgwj_kando3";  // Replace with your database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>