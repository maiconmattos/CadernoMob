var monitorDoencaSelecionado;
var modoDoencaForm="";

(function($){
	
	var $htmlListaDoenca = undefined;
	bindClickItemListaDoenca();
	
	$(document).on('pageshow','#doencasLista', function() {
		setScroll('wrapper');
		listarMonitoresDoenca();
	});
	
	function bindClickItemListaDoenca(){
		$(document).on('vclick','.li-item-doenca', function() {
			setMonitorDoencaSelecionado($(this).data('id'));
			modoDoencaForm=MODO_EDICAO;
		});
	}
	
	$(document).on('vclick','.btn-novo-doenca', function() {
		modoDoencaForm=MODO_INCLUSAO;
	});

	function listarMonitoresDoenca() {
		$.ajax({
			type : 'GET',
			url : rootURL + 'DoencaMonitor/' + cadernoSelecionado.id + cacheBuster,
			dataType : "json",
			success : renderlistaMonitoresDoenca
		});
	}
	
	var modelsDoenca = [];
	
	function renderlistaMonitoresDoenca(data) {
		var itemsDoenca = [];
		if($htmlListaDoenca){
			$htmlListaDoenca.remove();
		}
		
		if (data && data.length) {
			$.each(data, function(index, item) {
				modelsDoenca.push(item);
				var strDataOcorrenciaDoenca = dateToString(new Date(item.dataOcorrencia));
				itemsDoenca.push(
				'<li data-theme="c" class="li-item-doenca" data-id="' + item.id + '">' +
					'<a class="linkMonitorDoenca" href="doencasForm.html" data-transition="slide">' +
						'<div> <span>' + 'Data:'        + '</span>  <span style="font-weight: normal">' + strDataOcorrenciaDoenca + '</span> </div>' +
						'<div> <span>' + 'Praga:'       + '</span>  <span style="font-weight: normal">' + item.praga.nome         + '</span> </div>' +
						'<div> <span>' + 'Estádio:'     + '</span>  <span style="font-weight: normal">' + item.estadioTrigo.nome  + '</span> </div>' +
						'<div> <span>' + 'Responsável:' + '</span>  <span style="font-weight: normal">' + item.responsavel.nome   + '</span> </div>' +
                    '</a>'+
                '</li>');
			});
			
			$htmlListaDoenca = $(itemsDoenca.join(''));
			$htmlListaDoenca.appendTo('#lista-monitores-doenca');
			$('#lista-monitores-doenca').listview("refresh");
			enableScroll();
		};
		
	}
	
	function setMonitorDoencaSelecionado(id){
		$.each(modelsDoenca, function(index, model) {
			if (model.id == id){
				monitorDoencaSelecionado = model;
			}
		});
	};
})(jQuery);