(function($){
	$(document).on('pageshow','#cadernos', function() {
		setScroll('wrapper');
		listarCadernos();
	});
	
	$(document).on('tap','.linkCaderno', function() {
		setCadernoSelecionado($(this).data('id'));
	});

	function listarCadernos() {
		var sourceUrl = rootURL + 'CadernoCampo/' + pessoaId;
		$.ajax({
			type : 'GET',
			url : sourceUrl  + cacheBuster,
			dataType : "json",
			success : renderlistaCaderno,
			error: function (xhr, ajaxOptions, thrownError) {
				showErrorMessageREST(sourceUrl, xhr, thrownError);
		    }
		});
	}
	
	var models = [];
	
	function renderlistaCaderno(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				models.push(item);
				options.push(
				'<li>' +
					'<a class="linkCaderno" href="desktop.html" data-id="' + item.id +  '" data-transition="slide">' +
						'<div> <span>' + 'Ano base    :' + '</span>  <span style="font-weight: normal">' + item.anoBase                    + '</span> </div>' +
						'<div> <span>' + 'Proprietário :' + '</span>  <span style="font-weight: normal">' + item.lavoura.proprietario.nome  + '</span> </div>' +
						'<div> <span>' + 'Parcela     :' + '</span>  <span style="font-weight: normal">' + item.lavoura.descricao          + '</span> </div>' +
                    '</a>' +
                '</li>');
			});
			$("#lista-cadernos").append(options.join('')).listview("refresh");
			enableScroll();
		}
	}
	
	function setCadernoSelecionado(id){
		$.each(models, function(index, model) {
			if (model.id == id){
				cadernoSelecionado = model;
			}
		});
	};
})(jQuery);