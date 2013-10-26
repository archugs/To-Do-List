<?php
	include_once "common/connection.php";
	$pageTitle = "Home";
	include_once "common/header.php";

	if (isset($_SESSION['LoggedIn']) && isset($_SESSION['Username'])):
?>
	<p>You are currenly <strong>logged in.</strong></p>
	<p><a href="logout.php">Log out</a></p>
<?php
	elseif(isset($_POST['username']) && isset($_POST['password'])):
		include_once 'inc/class.users.inc.php';
		$users = new ListUsers($db);
		if($users->accountLogin() == TRUE):
			echo "<meta http-equiv='refresh' content='0;index.php' />";
			exit;
		else:
?>
	<h2>Login failed&mdash;Try Again?</h2>
	<form method="post" action="login.php" name="loginform" id="loginform">
		<div>
			<input type="text" name="username" id="username" />
			<label for="username">Email</label>
			<br /><br />
			<input type="password" name="password" id="password" />
			<label for="password">Password</label>
			<br /><br />
			<input type="submit" name="login" id="login" value="Login" class="button" />
		</div>
	</form>
	<p><a href="password.php">Did you forget your password?</a></p>

<?php
		endif;
	else:
?>

	<h2>Your list awaits...</h2>
	<form method="post" action="login.php" name="loginform" id="loginform">
		<div>
			<input type="text" name="username" id="username" />
			<label for="username">Email</label>
			<br /><br />
			<input type="password" name="password" id="password" />
			<label for="password">Password</label>
			<br /><br />
			<input type="submit" name="login" id="login" value="Login" class="button" />
		</div>
	</form><br /><br />
	<p><a href="password.php">Did you forget your password?</a></p>

<?php
	endif;
?>
		<div style="clear: both;"></div>
<?php
	include_once "common/sidebar.php";
	include_once "common/footer.php";
?>
	
