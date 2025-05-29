<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    // Redirect to login.php if not logged in
    header("Location: login.php");
    exit();
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arcade mánia</title>
</head>

<style>
/* Set the arcade screen background */
body {
  background-image: url('./assets/arcade.png'); 
  margin: 0;
  padding: 0;
  background-size: cover; /* Ensure the background covers the entire screen */
  font-family: 'Press Start 2P', cursive; /* Use a pixelated font */
  color: white; /* Set text color to white for better contrast */
  padding-top: 50px; /* Avoid content being hidden under the navbar */
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.8); 
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

li {
  float: left;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li a:hover {
  background-color: green;
}

li:last-child {
  margin-left: 2px;
}

form {
  margin: 20px auto;
  width: 300px;
  text-align: center;
}

input, button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  font-family: 'Press Start 2P', cursive; /* Pixelated font for inputs and buttons */
  font-size: 12px;
  border: 2px solid white;
  background-color: black;
  color: white;
}

button:hover {
  background-color: green;
  color: black;
}
</style>

<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<body>
<ul>
  <li><a href="">Welcome</a></li>
  <li style="float:right"><a href="?logout=true">Log Out</a></li>
  <li style="float:right"><a href=""><?php echo htmlspecialchars($_SESSION['username']); ?></a></li>
</ul>

<div style="text-align: center; margin-top: 100px;">
    <h1>Choose Your Game</h1>
    <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 20px;">
        <!-- Game 1 Card -->
        <div style="width: 200px; background-color: rgba(0, 0, 0, 0.8); border: 2px solid white; border-radius: 10px; padding: 10px; text-align: center;">
            <img src="./assets/game1.png" alt="Game 1" style="width: 100%; height: auto; border-radius: 5px;">
            <h3 style="color: white; font-size: 14px; margin: 10px 0;">Fighter</h3>
            <a href="http://localhost/ArcadeMania/games/Game_1/Game_1.php" style="text-decoration: none;">
                <button>Play Game</button>
            </a>
        </div>

        <!-- Game 2 Card -->
        <div style="width: 200px; background-color: rgba(0, 0, 0, 0.8); border: 2px solid white; border-radius: 10px; padding: 10px; text-align: center;">
            <img src="./assets/card.png" alt="Game 2" style="width: 100%; height: auto; border-radius: 5px;">
            <h3 style="color: white; font-size: 14px; margin: 10px 0;">Memory</h3>
            <a href="http://localhost/ArcadeMania/games/Game_2/Game_2.php" style="text-decoration: none;">
                <button>Play Game</button>
            </a>
        </div>


        <!-- Game 3 Card -->
        <div style="width: 200px; background-color: rgba(0, 0, 0, 0.8); border: 2px solid white; border-radius: 10px; padding: 10px; text-align: center;">
            <img src="./assets/snake.png" alt="Game 3" style="width: 100%; height: auto; border-radius: 5px;">
            <h3 style="color: white; font-size: 14px; margin: 10px 0;">Snake</h3>
            <a href="http://localhost/ArcadeMania/games/Game_3/Game_3.php" style="text-decoration: none;">
                <button>Play Game</button>
            </a>
        </div>

        <!-- Game 4 Card -->
        <div style="width: 200px; background-color: rgba(0, 0, 0, 0.8); border: 2px solid white; border-radius: 10px; padding: 10px; text-align: center;">
            <img src="./assets/game4.png" alt="Game 4" style="width: 100%; height: auto; border-radius: 5px;">
            <h3 style="color: white; font-size: 14px; margin: 10px 0;">Matrix Shooter</h3>
            <a href="http://localhost/ArcadeMania/games/Game_4/pontszam.php" style="text-decoration: none;">
                <button>Play Game</button>
            </a>
        </div>
    </div>
</div>
</div>
</body>
</html>
</html>



