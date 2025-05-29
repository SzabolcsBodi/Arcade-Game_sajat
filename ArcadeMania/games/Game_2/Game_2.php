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
    <link rel="stylesheet" href="Game_2.css">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <title>Memória játék</title>
</head>
<body>
    <ul>
        <li><a href="http://localhost/ArcadeMania/menu/main.php">Home</a></li>
        <li style="float:right"><a href="?logout=true">Log Out</a></li>
        <li style="float:right"><a href=""><?php echo htmlspecialchars($_SESSION['username']); ?></a></li>
    </ul>
    
    <!-- Score and High Score Section -->
    <div id="score-container">
        <h1 id="score" class="eddigiKattintas">Flipped Cards: 0</h1>
    </div>
    <div id="high-score-container">
        <h1 id="high-score" class="legjobbEredmeny">High Score: 0</h1>
    </div>
    
    <div class="jatekter">
        <h3 id="won1" style="display:none">You Won!</h3>
        <br><br>
        <h3 id="won2" style="display:none">Press space to go another round</h3>
    </div>
    
    <script src="Game_2.js"></script>

</body>
</html>