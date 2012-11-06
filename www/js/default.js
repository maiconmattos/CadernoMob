var server = '';
var rootURL = '';
var cadernoSelecionado= '';
var scroll = undefined;
var cacheBuster = "?timeStamp=" + new Date();

var MODO_EDICAO = "MODO_EDICAO";
var MODO_INCLUSAO = "MODO_INCLUSAO";

function dateToString(date){
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	return day + "/" + month + "/" + year;
}


function setScroll(wrapperId){
	scroll = new iScroll(wrapperId, { vScrollbar: false, hScrollbar:false, hScroll: false });
}

function enableScroll(){
	setTimeout(function(){
		scroll.refresh();
	},100);
}


function findAndSelectOption(selectId, modelId){
	var select = $(selectId); 
	select.find('option[value=' + modelId + ']').attr('selected',true);
	select.selectmenu('refresh', true);
}

(function($){
	$(document).on('pageshow','#main', function() {
		server = prompt("Server :","192.168.0.118");
		rootURL = "http://" + server + ":8080/Caderno/"; 
		$.mobile.changePage('login.html');
	});
})(jQuery);