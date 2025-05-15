<?php
session_start();
require_once 'db_connection.php'; // Include your database connection file

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

$userId = $_SESSION['user_id']; // Get the logged-in user's ID

// Fetch the high score from the database
$stmt = $conn->prepare("SELECT high_score FROM user_high_scores WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    echo json_encode(['success' => true, 'high_score' => $row['high_score']]);
} else {
    echo json_encode(['success' => true, 'high_score' => 0]); // Default high score is 0
}

$stmt->close();
$conn->close();
?>