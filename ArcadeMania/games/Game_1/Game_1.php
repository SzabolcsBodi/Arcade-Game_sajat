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
    <link rel="stylesheet" href="Game_1.css">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <title>Repülős lövölde</title>
</head>
<body>
    <ul>
        <li><a href="http://localhost/ArcadeMania/menu/main.php">Home</a></li>
        <li style="float:right"><a href="?logout=true">Log Out</a></li>
        <li style="float:right"><a href=""><?php echo htmlspecialchars($_SESSION['username']); ?></a></li>
    </ul>
 <!-- Score and High Score Section -->
    <div id="score-container">
        <h1 id="score" class="jelenlegiEredmeny">Score: 0</h1>
    </div>
    <div id="high-score-container">
        <h1 id="high-score" class="maxEredmeny">High Score: 0</h1>
    </div>
    <!-- Loss message (hidden by default) -->
    <div id="loss-message" style="display:none; text-align:center; font-size:2em; color:white; margin-bottom:10px;">
        You lost!
        <br><br>
        Press Space to play again.
    </div>
    

    <div class="jatekter"></div>

    <!-- <div class="gombok">
        <h1>A játok újraindításához nyomd meg: Space</h1>
    </div>
     -->
    <script src="Game_1.js"></script>

</body>
</html>