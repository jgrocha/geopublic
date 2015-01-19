Ext.define('GeoPublic.controller.DiscussaoRegulamento', {
	extend : 'Ext.app.Controller',
	init : function() {
		this.control({
			'discussao-regulamento' : {
				// 'beforerender' : this.onBemVindoPanelBeforeRender,
				// 'render' : this.onStartPanelRender
				'afterrender' : this.onDiscussaoRegulamentoAfterRender
			}
		}, this);
	},
	onDiscussaoRegulamentoAfterRender : function(panel) {
		var me = this;

		console.log('onDiscussaoRegulamentoAfterRender');

		$('#compare').mergely({
			cmsettings: { readOnly: false, lineNumbers: true },
			lhs: function(setValue) {
				setValue('the quick red fox\njumped over the hairy dog');
			},
			rhs: function(setValue) {
				setValue('the quick brown fox\njumped over the lazy dog');
			}
		});

	}
});
