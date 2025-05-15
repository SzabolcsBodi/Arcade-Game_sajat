<?php
session_start();
require_once 'db_connection.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in.']);
        exit;
    }

    $userId = $_SESSION['user_id']; // Get the logged-in user's ID
    $data = json_decode(file_get_contents('php://input'), true); // Get JSON data
    $highScore = intval($data['high_score']); // Get the high score from the request

    // Update the high score in the database
    $stmt = $conn->prepare("
        INSERT INTO user_high_scores (user_id, high_score) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE high_score = GREATEST(high_score, VALUES(high_score))
    ");
    $stmt->bind_param("ii", $userId, $highScore);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'High score updated successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update high score.']);
    }

    $stmt->close();
    $conn->close();
}
?>