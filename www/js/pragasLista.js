var monitorPragaSelecionado;
var modoPragaForm="";

(function($){
	
	var $htmlListaPraga = undefined;
	bindClickItemListaPraga();
	
	$(document).on('pageshow','#pragasLista', function() {
		setScroll('wrapper');
		listarMonitoresPraga();
	});
	
	function bindClickItemListaPraga(){
		$(document).on('vclick','.li-item-praga', function() {
			setMonitorPragaSelecionado($(this).data('id'));
			modoPragaForm=MODO_EDICAO;
		});
	}
	
	$(document).on('vclick','.btn-novo-praga', function() {
		modoPragaForm=MODO_INCLUSAO;
	});

	function listarMonitoresPraga() {
		$.ajax({
			type : 'GET',
			url : rootURL + 'InsetoMonitor/' + cadernoSelecionado.id + cacheBuster,
			dataType : "json",
			success : renderlistaMonitoresPraga
		});
	}
	
	var modelsPraga = [];
	
	function renderlistaMonitoresPraga(data) {
		var itemsPraga = [];
		if($htmlListaPraga){
			$htmlListaPraga.remove();
		}
		
		if (data && data.length) {
			$.each(data, function(index, item) {
				modelsPraga.push(item);
				var strDataOcorrenciaPraga = dateToString(new Date(item.dataOcorrencia));
				itemsPraga.push(
				'<li data-theme="c" class="li-item-praga" data-id="' + item.id + '">' +
					'<a class="linkMonitorPraga" href="pragasForm.html" data-transition="slide">' +
						'<div> <span>' + 'Data:'        + '</span>  <span style="font-weight: normal">' + strDataOcorrenciaPraga + '</span> </div>' +
						'<div> <span>' + 'Praga:'       + '</span>  <span style="font-weight: normal">' + item.praga.nome         + '</span> </div>' +
						'<div> <span>' + 'Estádio:'     + '</span>  <span style="font-weight: normal">' + item.estadioTrigo.nome  + '</span> </div>' +
						'<div> <span>' + 'Responsável:' + '</span>  <span style="font-weight: normal">' + item.responsavel.nome   + '</span> </div>' +
                    '</a>'+
                '</li>');
			});
			
			$htmlListaPraga = $(itemsPraga.join(''));
			$htmlListaPraga.appendTo('#lista-monitores-praga');
			$('#lista-monitores-praga').listview("refresh");
			enableScroll();
		};
		
	}
	
	function setMonitorPragaSelecionado(id){
		$.each(modelsPraga, function(index, model) {
			if (model.id == id){
				monitorPragaSelecionado = model;
			}
		});
	};
})(jQuery);