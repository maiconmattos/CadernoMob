(function($){
	function createDatePickerPlanta(){		
		$('#dtOcorrencia').scroller({
	        preset: 'date',
	        dayText : 'Dia',
	        monthText : 'Mês',
	        yearText : 'Ano',
	        cancelText : 'Cancelar',
	        setText : 'OK',
	        theme: 'ios',
	        display: 'modal',
	        mode: 'scroller',
	        dateFormat: 'dd/mm/yyyy',
	        dateOrder: 'dd mm yyyy'
	    });
		$('#dtOcorrencia').scroller('setDate',  new Date() , true);
		if (modoPlantaForm == MODO_EDICAO && monitorPlantaSelecionado.dataOcorrencia){
			$('#dtOcorrencia').scroller('setDate',  new Date(monitorPlantaSelecionado.dataOcorrencia) , true);
		}
	}
	
	$(document).on('pageshow','#plantas', function() {
		if (modoPlantaForm == MODO_EDICAO){
			JSONToFormPlanta(monitorPlantaSelecionado);
			$('#btn-excluir-planta').css('display', 'block');
		} else {
			$('#btn-excluir-planta').css('display', 'none');
			createDatePickerPlanta();
			popularProdutosPlanta();
			popularResponsaveisPlanta();
		}
	});
	
	$(document).on('click','#btnSavePlanta', function() {
		savePlanta();
	});
	
	$(document).on('click','#btn-excluir-planta', function() {
		showDeletePlantaConfirm();
	});
	
	function deleteMonitorPlanta(idToRemove) {
		$.ajax({
			type : 'DELETE',
			url : rootURL + 'PlantaMonitor/' + idToRemove + cacheBuster,
			dataType : "json",
			success : deletePlantaSuccess
		});
	}
	
	function handleDeletePlantaChoice(button){
		if (button == 1){
			deleteMonitorPlanta($('#hiddenId').val());
		}
	}
	
	function deletePlantaSuccess(){
		navigator.notification.alert(
			    'Registro excluído com sucesso!',  // message
			     $.mobile.changePage('plantasLista.html'),//callback
			    'Monitoramento de plantas',            // title
			    'OK'                  // buttonName
			);
	}
	
	function showDeletePlantaConfirm(){
		navigator.notification.confirm(
		        'Confirma a exclusão do registro ?',  // message
		        handleDeletePlantaChoice,// callback
		        'Excluir registro', // title
		        'Confirmar,Cancelar'// buttonLabels
		);
	}
	
	function isFormPlantaValid(){
		var errorMessage = "Preencha os seguintes campos :\n";
		var valid = true;
		if (!$("#dtOcorrencia").scroller("getDate", true)){
			errorMessage += "- Data de ocorrência\n";
			valid = false;
		}
		if(!$('#dose').val()){
			errorMessage += "- Dose\n";
			valid = false;
		}
		
		if(!$("#select-responsaveis").val()){
			errorMessage += "- Responsável\n";
			valid = false;
		}
		if(!$("#select-produtos").val()){
			errorMessage += "- Produto\n";
			valid = false;
		}
		
		if (!valid){
			navigator.notification.alert(
			     errorMessage,  // message
			     null,//callback
			    'Atenção',            // title
			    'OK'                  // buttonName
			);
		}
		return valid;
	}
	
	function savePlanta(){
		if (isFormPlantaValid()){
			$.ajax({
				type : 'POST',
				contentType: 'application/json',
				url : rootURL + 'PlantaMonitor' + cacheBuster,
				data : formPlantaToJSON(),
				dataType : "json",
				success : savePlantaSuccess
			});
		}
	}
	
	function savePlantaSuccess(){
		navigator.notification.alert(
		    'Registro salvo com sucesso!',  // message
		     $.mobile.changePage('plantasLista.html'),//callback
		    'Monitoramento de plantas',            // title
		    'OK'                  // buttonName
		);
	}

	function popularProdutosPlanta() {
		$.ajax({
			type : 'GET',
			url : rootURL + 'Produto' + cacheBuster,
			dataType : "json",
			success : renderComboProdutosPlanta
		});
	}
	
	function popularResponsaveisPlanta() {
		renderResponsaveisPlanta(cadernoSelecionado.responsaveis);
	}

	function renderComboProdutosPlanta(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				options.push('<option value="' + item.id + '">' + item.nomeComercial + '</option>');
			});
			$("#select-produtos").append(options.join('')).selectmenu('refresh', true);
			if (modoPlantaForm == MODO_EDICAO){
				findAndSelectOption('#select-produtos', monitorPlantaSelecionado.produto.id);
			}
		}
	}
	
	function renderResponsaveisPlanta(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				options.push('<option value="' + item.id + '">' + item.nome + '</option>');
			});
			$("#select-responsaveis").append(options.join('')).selectmenu('refresh', true);
			if (modoPlantaForm == MODO_EDICAO){
				findAndSelectOption('#select-responsaveis', monitorPlantaSelecionado.responsavel.id);
			}
		}
	}
	
	function JSONToFormPlanta() {
		$('#hiddenId').val(monitorPlantaSelecionado.id);
		$('#dose').val(monitorPlantaSelecionado.dose);
		createDatePickerPlanta();
		popularProdutosPlanta();
		popularResponsaveisPlanta();
	}
	
	function formPlantaToJSON() {
	    var strJson = JSON.stringify({
	    	"id": $('#hiddenId').val(),
			"dataOcorrencia": $("#dtOcorrencia").scroller("getDate", true),
			"dose": $('#dose').val(),
			"observacao": "",
			"status": "",
			"justificativa": "",
			"caderno": cadernoSelecionado,
			"responsavel": 
			{
				"id": $("#select-responsaveis").val(),
				"nome": $("#select-responsaveis option:selected").text()
			},
			"produto": 
			{
				"id": $("#select-produtos").val(),
				"nomeComercial": $("#select-produtos option:selected").text()
			}
	    });
	    return strJson;
	}
})(jQuery);