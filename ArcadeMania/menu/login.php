<?php
session_start();
require_once 'db_connection.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Validate user credentials
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Verify the hashed password
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id']; // Set the user ID in the session
            $_SESSION['username'] = $user['username']; // Optionally set the username
            header('Location: main.php'); // Redirect to the main page
            exit;
        } else {
            echo "Invalid username or password.";
        }
    } else {
        echo "Invalid username or password.";
    }
}
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