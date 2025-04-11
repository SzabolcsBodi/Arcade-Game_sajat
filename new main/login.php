<?php
// filepath: c:\xampp\htdocs\login.php
session_start(); // Start the session

$conn = new mysqli('localhost', 'root', '', 'arcade_game');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    if (password_verify($password, $hashed_password)) {
        // Set the session variable for the logged-in user
        $_SESSION['username'] = $username;

        // Redirect to main.php
        header("Location: main.php");
        exit();
    } else {
        $message = "Invalid username or password.";
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Arcade Mania</title>
    <style>
        /* Reuse styles from main.php */
        body {
            background-image: url('arcade.png');
            margin: 0;
            padding: 0;
            background-size: cover;
            font-family: 'Press Start 2P', cursive;
            color: white;
            padding-top: 50px;
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
            font-family: 'Press Start 2P', cursive;
            font-size: 12px;
            border: 2px solid white;
            background-color: black;
            color: white;
        }

        button:hover {
            background-color: green;
            color: black;
        }

        .message {
            text-align: center;
            margin: 20px auto;
            font-size: 14px;
            color: yellow;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>
<body>
<ul>
    <li style="float: right"><a href="register.php">Register</a></li>
</ul>

<?php if (!empty($message)): ?>
    <div class="message"><?php echo $message; ?></div>
<?php endif; ?>

<h1 style="text-align: center;">Login</h1>
<form action="login.php" method="POST">
    <input type="text" name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Login</button>
</form>
</body>
</html>