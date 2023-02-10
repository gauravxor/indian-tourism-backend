const SigninForm = () => {
	return (
	  <div className="signinForm">
		<h1> Sign in Form </h1>
		<form action = "http://127.0.0.1:4000/" method = "post">
			<div className="email-input">
				<label htmlFor="email"> Email Id </label>
				<input type="email" name="email" id="email" />
		  	</div>

			<div className="pswd-input">
				<label htmlFor="password"> Password </label>
				<input type="password" name="pswd" id="password" />
		  	</div>

			<div className="signin-btn">
				<button type="submit"> Sign In </button>
			</div>
		</form>
	  </div>
	);
  };

  export default SigninForm;
