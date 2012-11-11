var monitorPlantaSelecionado;
var modoPlantaForm="";

(function($){
	
	var $htmlListaPlanta = undefined;
	bindClickItemListaPlanta();
	
	$(document).on('pageshow','#PlantasLista', function() {
		setScroll('wrapper');
		listarMonitoresPlanta();
	});
	
	function bindClickItemListaPlanta(){
		$(document).on('vclick','.li-item-planta', function() {
			setMonitorPlantaSelecionado($(this).data('id'));
			modoPlantaForm=MODO_EDICAO;
		});
	}
	
	$(document).on('vclick','.btn-novo-planta', function() {
		modoPlantaForm=MODO_INCLUSAO;
	});

	function listarMonitoresPlanta() {
		var sourceUrl = rootURL + 'PlantaMonitor/' + cadernoSelecionado.id;
		$.ajax({
			type : 'GET',
			url : sourceUrl  + cacheBuster,
			dataType : "json",
			success : renderlistaMonitoresPlanta,
			error: function (xhr, ajaxOptions, thrownError) {
				showErrorMessageREST(sourceUrl, xhr, thrownError);
		    }
		});
	}
	
	var modelsPlanta = [];
	
	function renderlistaMonitoresPlanta(data) {
		var itemsPlanta = [];
		if($htmlListaPlanta){
			$htmlListaPlanta.remove();
		}
		
		if (data && data.length) {
			$.each(data, function(index, item) {
				modelsPlanta.push(item);
				var strDataOcorrenciaPlanta = dateToString(new Date(item.dataOcorrencia));
				itemsPlanta.push(
				'<li data-theme="c" class="li-item-planta" data-id="' + item.id + '">' +
					'<a class="linkMonitorPlanta" href="plantasForm.html" data-transition="slide">' +
						'<div> <span>' + 'Data:'        + '</span>  <span style="font-weight: normal">' + strDataOcorrenciaPlanta + '</span> </div>' +
						'<div> <span>' + 'Agroquimico:'       + '</span>  <span style="font-weight: normal">' + item.produto.nomeComercial         + '</span> </div>' +
						'<div> <span>' + 'Dose:'     + '</span>  <span style="font-weight: normal">' + item.dose + '</span> </div>' +
						'<div> <span>' + 'Responsável:' + '</span>  <span style="font-weight: normal">' + item.responsavel.nome   + '</span> </div>' +
                    '</a>'+
                '</li>');
			});
			
			$htmlListaPlanta = $(itemsPlanta.join(''));
			$htmlListaPlanta.appendTo('#lista-monitores-planta');
			$('#lista-monitores-planta').listview("refresh");
			enableScroll();
		};
	}
	
	function setMonitorPlantaSelecionado(id){
		$.each(modelsPlanta, function(index, model) {
			if (model.id == id){
				monitorPlantaSelecionado = model;
			}
		});
	};
})(jQuery);