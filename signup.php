<?php
	include_once "common/connection.php";
	$pageTitle = "Register";
	include_once "common/header.php";

	if (!empty($_POST['username'])):
		include_once "inc/class.users.inc.php";
		$users = new ListUsers($db);
		if(($res = $users->createAccount()) != FALSE):
			echo $res;
		else:
?>
			<div class='message bad'>Invalid username. Please try again</div>
			<h2>Sign up</h2>
			<form method="post" action="signup.php" id="registerform">
				<div>
					<label for="username">Email:</label>
					<input type="text" name="username" id="username" /><br />
					<input type="submit" name="register" id="register" value="Sign up" />
					<input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>" />
				</div>
			</form>
<?php	
		endif;		
	else:
?>
	<h2>Sign up</h2>
	<form method="post" action="signup.php" id="registerform">
		<div>
			<label for="username">Email:</label>
			<input type="text" name="username" id="username" /><br />
			<input type="submit" name="register" id="register" value="Sign up" />
			<input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>" />
		</div>
	</form>

<?php
	endif;
	include_once 'common/footer.php';
?>
