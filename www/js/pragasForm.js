(function($){
	function createDatePickerPraga(){		
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
		if (modoPragaForm == MODO_EDICAO && monitorPragaSelecionado.dataOcorrencia){
			$('#dtOcorrencia').scroller('setDate',  new Date(monitorPragaSelecionado.dataOcorrencia) , true);
		}
	}
	
	$(document).on('pageshow','#pragas', function() {
		if (modoPragaForm == MODO_EDICAO){
			JSONToFormPraga(monitorPragaSelecionado);
			$('#btn-excluir-praga').css('display', 'block');
		} else {
			$('#btn-excluir-praga').css('display', 'none');
			createDatePickerPraga();
			popularPragasPraga();
			popularEstadiosTrigoPraga();
			popularResponsaveisPraga();
		}
	});
	
	$(document).on('click','#btnSavePraga', function() {
		savePraga();
	});
	
	$(document).on('click','#btn-excluir-praga', function() {
		showDeletePragaConfirm();
	});
	
	function deleteMonitorPraga(idToRemove) {
		$.ajax({
			type : 'DELETE',
			url : rootURL + 'InsetoMonitor/' + idToRemove + cacheBuster,
			dataType : "json",
			success : deletePragaSuccess
		});
	}
	
	function handleDeletePragaChoice(button){
		if (button == 1){
			deleteMonitorPraga($('#hiddenId').val());
		}
	}
	
	function deletePragaSuccess(){
		navigator.notification.alert(
			    'Registro excluído com sucesso!',  // message
			     $.mobile.changePage('pragasLista.html'),//callback
			    'Monitoramento de pragas',            // title
			    'OK'                  // buttonName
			);
	}
	
	function showDeletePragaConfirm(){
		navigator.notification.confirm(
		        'Confirma a exclusão do registro ?',  // message
		        handleDeletePragaChoice,// callback
		        'Excluir registro', // title
		        'Confirmar,Cancelar'// buttonLabels
		);
	}
	
	function isFormPragaValid(){
		var errorMessage = "Preencha os seguintes campos :\n";
		var valid = true;
		if (!$("#dtOcorrencia").scroller("getDate", true)){
			errorMessage += "- Data de ocorrência\n";
			valid = false;
		}
		if(!$('#qtdOcorrencia').val()){
			errorMessage += "- Quantidade de ocorrências\n";
			valid = false;
		}
		
		if(!$("#select-responsaveis").val()){
			errorMessage += "- Responsável\n";
			valid = false;
		}
		if(!$("#select-pragas").val()){
			errorMessage += "- Praga\n";
			valid = false;
		}
		if(!$("#select-estadio-trigo").val()){
			errorMessage += "- Estádio trigo\n";
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
	
	function savePraga(){
		if (isFormPragaValid()){
			$.ajax({
				type : 'POST',
				contentType: 'application/json',
				url : rootURL + 'InsetoMonitor' + cacheBuster,
				data : formPragaToJSON(),
				dataType : "json",
				success : savePragaSuccess
			});
		}
	}
	
	function savePragaSuccess(){
		navigator.notification.alert(
		    'Registro salvo com sucesso!',  // message
		     $.mobile.changePage('pragasLista.html'),//callback
		    'Monitoramento de pragas',            // title
		    'OK'                  // buttonName
		);
	}

	function popularPragasPraga() {
		$.ajax({
			type : 'GET',
			url : rootURL + 'Praga' + cacheBuster,
			dataType : "json",
			success : renderComboPragasPraga
		});
	}

	function popularEstadiosTrigoPraga() {
		$.ajax({
			type : 'GET',
			url : rootURL + 'EstadioTrigo' + cacheBuster,
			dataType : "json",
			success : renderComboEstadiosTrigoPraga
		});
	}
	
	function popularResponsaveisPraga() {
		renderResponsaveisPraga(cadernoSelecionado.responsaveis);
	}

	function renderComboPragasPraga(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				options.push('<option value="' + item.id + '">' + item.nome + '</option>');
			});
			$("#select-pragas").append(options.join('')).selectmenu('refresh', true);
			if (modoPragaForm == MODO_EDICAO){
				findAndSelectOption('#select-pragas', monitorPragaSelecionado.praga.id);
			}
		}
	}

	function renderComboEstadiosTrigoPraga(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				options.push('<option value="' + item.id + '">' + item.nome + '</option>');
			});
			$("#select-estadio-trigo").append(options.join('')).selectmenu('refresh', true);
			if (modoPragaForm == MODO_EDICAO){
				findAndSelectOption('#select-estadio-trigo', monitorPragaSelecionado.estadioTrigo.id);
			}
		}
	}
	
	function renderResponsaveisPraga(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				options.push('<option value="' + item.id + '">' + item.nome + '</option>');
			});
			$("#select-responsaveis").append(options.join('')).selectmenu('refresh', true);
			if (modoPragaForm == MODO_EDICAO){
				findAndSelectOption('#select-responsaveis', monitorPragaSelecionado.responsavel.id);
			}
		}
	}
	
	function JSONToFormPraga() {
		$('#hiddenId').val(monitorPragaSelecionado.id);
		$('#qtdOcorrencia').val(monitorPragaSelecionado.qtdOcorrencia);
		createDatePickerPraga();
		popularPragasPraga();
		popularEstadiosTrigoPraga();
		popularResponsaveisPraga();
	}
	
	function formPragaToJSON() {
	    var strJson = JSON.stringify({
	    	"id": $('#hiddenId').val(),
			"dataOcorrencia": $("#dtOcorrencia").scroller("getDate", true),
			"qtdOcorrencia": $('#qtdOcorrencia').val(),
			"observacao": "",
			"status": "",
			"justificativa": "",
			"caderno": cadernoSelecionado,
			"responsavel": 
			{
				"id": $("#select-responsaveis").val(),
				"nome": $("#select-responsaveis option:selected").text()
			},
			"praga": 
			{
				"id": $("#select-pragas").val(),
				"nome": $("#select-pragas option:selected").text()
			},
			"estadioTrigo": 
			{
				"id": $("#select-estadio-trigo").val(),
				"nome": $("#select-estadio-trigo option:selected").text()
			}
	    });
	    return strJson;
	}
})(jQuery);