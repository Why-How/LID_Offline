var save = require('../save.js');

module.exports = (req, resp) => {
	var reqData = "";
	req.on('data', function(chunk){ reqData += chunk});
	req.on('end', function(){
		save.setSoul(JSON.parse(reqData)['mv']['soul']);
		let flrFile;
		if(JSON.parse(reqData)["mv"]["fromarea"]==="MET_AREA_010")
			flrFile = require('../Data/floors/Imokawa-Cho.json');
		else
			flrFile = require('../Data/floors/Tamata.json');

		resp.send({
			"flr": flrFile["flr"],
			"user": save.getUser(),
			"msgs": [],
			"rescuelog": [],
			"deathbox": "COPPER",
			"playlog": save.getPlaylog(),
			"av":3,
			"dv":146,
			"e":"0",
			"st":0,
			"emsg":"",
			"eparam":"",
			"env":"prds",
			"accountId":save.getAccountId(),
			"json":1,
			"ctime":save.getCtime()
		});
	});
}