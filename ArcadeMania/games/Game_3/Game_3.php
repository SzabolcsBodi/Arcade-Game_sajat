<?php
session_start();

// Handle logout
if (isset($_GET['logout']) && $_GET['logout'] === 'true') {
    session_destroy(); // Destroy the session
    header('Location: http://localhost/ArcadeMania/menu/login.php'); // Redirect to the login page
    exit;
}

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: http://localhost/ArcadeMania/menu/login.php'); 
    exit;
}
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="Game_3.css">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <title>Snake</title>
</head>
<body>
    <ul class="header">
        <li><a href="http://localhost/ArcadeMania/menu/main.php">Home</a></li>
        <li style="float:right"><a href="?logout=true">Log Out</a></li>
        <li style="float:right"><a href=""><?php echo htmlspecialchars($_SESSION['username']); ?></a></li>
    </ul>
    
    <!-- Score and High Score Section -->
    <div id="score-container">
        <h1 id="score">Score: 000</h1>
    </div>
    <div id="high-score-container">
        <h1 id="high-score">High Score: 000</h1>
    </div>

    <div>
        <div class="game-border-1">
            <div class="game-border-2">
                <div class="game-border-3">
                    <div id="game-board"></div>
                </div>
            </div>
        </div>
    </div>

    <h1 id="text">Press space to start</h1>

    <script src="Game_3.js"></script>
</body>
</html>