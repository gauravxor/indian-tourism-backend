const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', (req, res) => {
	console.log("Received something from client");
	const email = req.body.email;
	const pswd = req.body.pswd;
	res.send({
		"provided email": email,
		"provided pswd" : pswd
	});
});

app.listen(4000, () => {
	console.log("Server started on port 4000");
});
