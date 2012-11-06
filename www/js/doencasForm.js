(function($){
	function createDatePickerDoenca(){		
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
		if (modoDoencaForm == MODO_EDICAO && monitorDoencaSelecionado.dataOcorrencia){
			$('#dtOcorrencia').scroller('setDate',  new Date(monitorDoencaSelecionado.dataOcorrencia) , true);
		}
	}
	
	$(document).on('pageshow','#doencas', function() {
		if (modoDoencaForm == MODO_EDICAO){
			JSONToFormDoenca(monitorDoencaSelecionado);
			$('#btn-excluir-doenca').css('display', 'block');
		} else {
			$('#btn-excluir-doenca').css('display', 'none');
			createDatePickerDoenca();
			popularPragasDoenca();
			popularEstadiosTrigoDoenca();
			popularResponsaveisDoenca();
		}
	});
	
	$(document).on('click','#btnSaveDoenca', function() {
		saveDoenca();
	});
	
	$(document).on('click','#btn-excluir-doenca', function() {
		showDeleteDoencaConfirm();
	});
	
	function deleteMonitorDoenca(idToRemove) {
		$.ajax({
			type : 'DELETE',
			url : rootURL + 'DoencaMonitor/' + idToRemove + cacheBuster,
			dataType : "json",
			success : deleteDoencaSuccess
		});
	}
	
	function handleDeleteDoencaChoice(button){
		if (button == 1){
			deleteMonitorDoenca($('#hiddenId').val());
		}
	}
	
	function deleteDoencaSuccess(){
		navigator.notification.alert(
			    'Registro excluído com sucesso!',  // message
			     $.mobile.changePage('doencasLista.html'),//callback
			    'Monitoramento de doencas',            // title
			    'OK'                  // buttonName
			);
	}
	
	function showDeleteDoencaConfirm(){
		navigator.notification.confirm(
		        'Confirma a exclusão do registro ?',  // message
		        handleDeleteDoencaChoice,// callback
		        'Excluir registro', // title
		        'Confirmar,Cancelar'// buttonLabels
		);
	}
	
	function isFormDoencaValid(){
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
	
	function saveDoenca(){
		if (isFormDoencaValid()){
			$.ajax({
				type : 'POST',
				contentType: 'application/json',
				url : rootURL + 'DoencaMonitor' + cacheBuster,
				data : formDoencaToJSON(),
				dataType : "json",
				success : saveDoencaSuccess
			});
		}
	}
	
	function saveDoencaSuccess(){
		navigator.notification.alert(
		    'Registro salvo com sucesso!',  // message
		     $.mobile.changePage('doencasLista.html'),//callback
		    'Monitoramento de doencas',            // title
		    'OK'                  // buttonName
		);
	}

	function popularPragasDoenca() {
		$.ajax({
			type : 'GET',
			url : rootURL + 'Praga' + cacheBuster,
			dataType : "json",
			success : renderComboPragasDoenca
		});
	}

	function popularEstadiosTrigoDoenca() {
		$.ajax({
			type : 'GET',
			url : rootURL + 'EstadioTrigo' + cacheBuster,
			dataType : "json",
			success : renderComboEstadiosTrigoDoenca
		});
	}
	
	function popularResponsaveisDoenca() {
		renderResponsaveisDoenca(cadernoSelecionado.responsaveis);
	}

	function renderComboPragasDoenca(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				options.push('<option value="' + item.id + '">' + item.nome + '</option>');
			});
			$("#select-pragas").append(options.join('')).selectmenu('refresh', true);
			if (modoDoencaForm == MODO_EDICAO){
				findAndSelectOption('#select-pragas', monitorDoencaSelecionado.praga.id);
			}
		}
	}

	function renderComboEstadiosTrigoDoenca(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				options.push('<option value="' + item.id + '">' + item.nome + '</option>');
			});
			$("#select-estadio-trigo").append(options.join('')).selectmenu('refresh', true);
			if (modoDoencaForm == MODO_EDICAO){
				findAndSelectOption('#select-estadio-trigo', monitorDoencaSelecionado.estadioTrigo.id);
			}
		}
	}
	
	function renderResponsaveisDoenca(data) {
		var options = [];
		if (data && data.length) {
			$.each(data, function(index, item) {
				options.push('<option value="' + item.id + '">' + item.nome + '</option>');
			});
			$("#select-responsaveis").append(options.join('')).selectmenu('refresh', true);
			if (modoDoencaForm == MODO_EDICAO){
				findAndSelectOption('#select-responsaveis', monitorDoencaSelecionado.responsavel.id);
			}
		}
	}
	
	function JSONToFormDoenca() {
		$('#hiddenId').val(monitorDoencaSelecionado.id);
		$('#qtdOcorrencia').val(monitorDoencaSelecionado.qtdOcorrencia);
		createDatePickerDoenca();
		popularPragasDoenca();
		popularEstadiosTrigoDoenca();
		popularResponsaveisDoenca();
	}
	
	function formDoencaToJSON() {
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