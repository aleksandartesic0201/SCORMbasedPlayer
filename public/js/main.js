function initializeAPI (scorm, sco, user) {
	
	var params = new Object();
	params.id = new Object();
	params.user = new Object();
	params.scoe = new Object();
	params.id = scorm;
	params.user = user;
	params.sco = sco;
	params.vs = "SCORM1.2";
	var API = null;
	API = new SCORMAPI(params);
	
	window.API = API;
}

var attempt;
var req;
//var DispatchDriver = null;
var REGISTRATION_ID = '15138024';
function NewHttpReq()
{
	if (window.XMLHttpRequest) 
	{
		req = new XMLHttpRequest();
	} else if (window.ActiveXObject) 
	{		
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return req;
}

function DoRequests(req, url, param) 
{
	console.log(param);
	console.log(url);
	req.open("POST", url, false);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send(param);
} 