

$(function(){
	// var url = $.url(); window.url = url;
	// var params = url.data.param.query;
	// console.log(url);
	// var API = null;
	
	// API = new SCORMAPI(params);
	
	// window.API = API;
	// $(window).on('beforeunload', function () {
	    
	// });
});

function initializeAPI (scorm) {
	var url = $.url(); window.url = url;
	var params = url.data.param.query;
	
	var API = null;
	params.id = scorm;
	params.vs = "SCORM1.2";
	API = new SCORMAPI(params);
	
	window.API = API;
	$(window).on('beforeunload', function () {
	    
	});
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
	req.open("POST", url, false);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send(param);
} 