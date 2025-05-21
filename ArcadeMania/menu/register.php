<?php
session_start();
require_once 'db_connection.php';

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // Először ellenőrizzük, hogy a felhasználónév már foglalt-e
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $checkStmt->bind_param("s", $username);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        $message = "This username is already taken. Please choose another.";
    } else {
        // Jelszó hash-elése
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Új felhasználó beszúrása
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $hashedPassword);

        if ($stmt->execute()) {
            header('Location: login.php');
            exit;
        } else {
            $message = "Registration error: " . $stmt->error;
        }
        $stmt->close();
    }

    $checkStmt->close();
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Arcade Mania</title>
    
    <style>
        body {
            background-image: url('./assets/arcade.png');
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
    <li style="float: right;"><a href="login.php">Login</a></li>
</ul>

<?php if (!empty($message)): ?>
    <div class="message"><?php echo htmlspecialchars($message); ?></div>
<?php endif; ?>

<h1 style="text-align: center;">Register</h1>
<form action="register.php" method="POST">
    <input type="text" name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Register</button>
</form>
</body>
</html>
