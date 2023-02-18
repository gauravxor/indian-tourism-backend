const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization'];
  	const token = authHeader
	console.log(authHeader);
	if(token == null)
		return res.status(401).send({msg: "Token not found"});

	jwt.verify(token, "gaurav", (err, user) => {
		if(err){
			res.status(403).send({msg: "Invalid token"});
		}
		else{
			req.user = user;
			console.log("User" + user);
			next();
		}
	});
}

module.exports = verifyToken;