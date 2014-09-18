Ext.define('DemoExtJs.controller.Participation.Contribution', {
	extend : 'Ext.app.Controller',
	// Ext.ComponentQuery.query('profile checkbox')
	refs : [{
		selector : 'contribution form#detail',
		ref : 'formContribution' // gera um getFormContribution
	}, {
		ref : 'comboplano', // this.getComboplano()
		selector : 'app-main-map-panel combo#plano'
	}, {
		ref : 'mapa',
		selector : 'app-main-map-panel'
	}],
	init : function() {
		this.control({
			"contribution form#detail toolbar button#gravar" : {
				click : this.onButtonGravar
			},
			"contribution form#detail toolbar button#limpar" : {
				click : this.onButtonLimpar
			}
		});
	},
	onButtonGravar : function(button, e, options) {
		var params = button.up('form').getForm().getValues(false, true, false, false);
		/*
		 if (this.getSexoCheckbox().isDirty()) {
		 console.log("Mexeu no sexo");
		 params['masculino'] = this.getSexoCheckbox().checked ? "1" : "0";
		 }
		 */
		var fid = this.getFormContribution().getForm().findField('feature').getValue();
		if (fid) {

			var report = this.getMapa().map.getLayersByName('Report')[0];
			var f = report.getFeatureById(fid);
			var ponto = f.geometry;

			// var ponto = this.getMapa().map.getExtent().toGeometry().getCentroid();

			var parser = new OpenLayers.Format.GeoJSON();
			var pontoasjson = parser.write(ponto);

			var plano = this.getComboplano().getValue();
			// console.log(params);
			Ext.apply(params, {
				idplano : plano,
				idestado : 1,
				the_geom : pontoasjson
			});
			ExtRemote.DXParticipacao.createOcorrencia(params, function(result, event) {
				if (result.success) {
					Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
					console.log(result.data[0].id);
					// associar o id ao fid do novo feature inserido no openlayers
					f.fid = result.data[0].id;
					f.state = null;
					// limpar o formulário!
					this.onButtonLimpar(button, e, options);
				} else {
					Ext.Msg.alert('Erro', 'Ocorreu um erro ao gravar as alterações.');
				}
			});
		} else {
			Ext.Msg.alert('Atenção', 'Tem que indicar a localização da ocorrência.');
		}
	},
	onButtonLimpar : function(button, e, options) {
		Ext.each(this.getFormContribution().getForm().getFields().items, function(field) {
			field.setValue('');
		});
	}
});
