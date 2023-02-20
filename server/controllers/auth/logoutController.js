const Auth = require('../../helper/authHelper');

const  logoutController = async (req, res) => {
	const userId = req.userId;
	console.log("User Id = " + userId);
	const credentialsSearchResult = await Auth.searchCredentials(userId);
	if(credentialsSearchResult == null)
		res.status(404).send({msg: "Credentials not found"});
	else
	{
		const updateQueryResult = await Auth.updateLoginStatus(credentialsSearchResult._id, false);
		console.log("Update query result = " + updateQueryResult);
		if(updateQueryResult != null)
		{
			res.status(200).send({
				msg: "Logged out successfully",
			});
		}
		else
			res.status(404).send({msg: "Error in updating login/logout status"});
	}
};


module.exports = logoutController;
