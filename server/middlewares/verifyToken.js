const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
	console.log("Verify token");
	if(req.headers.authorization == null)
		return res.status(401).send({msg: "Token not found"});
	else
	{
		const authHeader = req.headers.authorization;
		const token = authHeader.split(' ')[1];
		console.log(token);
		if(token == null)
			return res.status(401).send({msg: "Token not found"});

		jwt.verify(token, process.env.JWT_SECRET , (err, user) => {
			if(err){
				res.status(403).send({msg: "Invalid token"});
			}
			else{
				console.log(user);
				req.userId = user.userId;
				next();
			}
		});
	}
}

module.exports = verifyToken;