<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  

        <title> To-Do List | <?php echo $pageTitle ?> </title>

        <link rel="stylesheet" href="style.css" type="text/css" />
        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />

	<link rel="icon" type="image/x-icon" href="favicon.ico" />

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"> </script>
</head>

<body>
        <div id="page-wrap">
                <div id="header">
                        <h1><a href="/">To-Do-List</a></h1>
                        <div id="control">
                        <?php 
				if (isset($_SESSION['LoggedIn']) && isset($_SESSION['Username']) && $_SESSION['LoggedIn'] == 1):
			?>
                                <p><a href="logout.php" class="button">Log out</a> 
                                <a href="account.php" class="button">Your Account</a></p>
                        <?php else: ?>
                                <p><a href="signup.php" class="button">Sign Up</a>
                                &nbsp;
                                <a href="login.php" class="button">Log in</a></p>
			<?php endif; ?>
                        </div>
                </div>                                                      
