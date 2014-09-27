Ext.define('DemoExtJs.view.Avatar', {
	extend : 'Ext.form.Panel',
	alias : 'widget.avatar',
	requires : ['Ext.form.field.File', 'Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
	title : 'Avatar',
	bodyPadding : 5,
	api : {
		submit : 'ExtRemote.DXFormTest.filesubmitphotoprofile'
	},
	/*
	 * The Profile Image dimensions are 160px by 160px!
	 * The profile image that appears next to your name on comments and posts is the same image but is automatically scaled down to 32px by 32px!
	 */
	items : [{
		xtype : 'imagecomponent',
		src : 'resources/images/Man-Silhouette-Clip-Art-160.jpg',
		itemId : 'imagecomponent160',
		height : 160
	}, {
		xtype : 'imagecomponent',
		src : 'resources/images/Man-Silhouette-Clip-Art-32.jpg',
		itemId : 'imagecomponent32',
		height : 32
	}, {
		xtype : 'filefield',
		name : 'photo',
		itemId : 'photo',
		// fieldLabel : 'Photo',
		labelWidth : 50,
		msgTarget : 'side',
		allowBlank : true,
		anchor : '40%',
		buttonText : 'Fotografia...',
		buttonOnly : true
	}] /*,
	bbar : [{
		xtype : 'button',
		itemId : 'upload',
		text : 'Enviar'
	}]
	*/
});

Ext.define('DemoExtJs.view.ChangePassword', {
	extend : 'Ext.form.Panel',
	alias : 'widget.xpassword',
	bodyPadding : 5,
	defaults : {
		xtype : 'textfield',
		// anchor : '100%',
		// labelWidth : 60,
		allowBlank : false,
		// vtype : 'alphanum',
		minLength : 3,
		// msgTarget : 'under',
		msgTarget : 'side',
		minLengthText : 'O mínimo são {0} carateres'
	},
	items : [{
		inputType : 'password',
		name : 'oldpassword',
		itemId : 'oldpassword',
		fieldLabel : 'Senha atual',
		enableKeyEvents : true,
		maxLength : 15,
		allowBlank : false,
		tooltip : 'Introduza a senha atual',
		disabled : true
	}, {
		// http://stackoverflow.com/questions/9704913/confirm-password-validator-extjs-4
		inputType : 'password',
		name : 'password',
		itemId : 'password',
		fieldLabel : 'Nova senha',
		enableKeyEvents : true,
		maxLength : 15,
		allowBlank : false,
		tooltip : 'Escolha uma senha'
	}, {
		inputType : 'password',
		name : 'password2x',
		vtype : 'password', // para validar
		fieldLabel : 'Repetir senha',
		enableKeyEvents : true,
		maxLength : 15,
		allowBlank : false,
		tooltip : 'Repita a senha escolhida para confirmar'
	}],
	bbar : [{
		xtype : 'button',
		itemId : 'alterar',
		text : 'Alterar'
	}]
});

//
// http://lists.osgeo.org/pipermail//mapproxy/2013-January/001450.html
// http://wiki.openstreetmap.org/wiki/MapProxy
//

Ext.define('DemoExtJs.view.Home', {
	extend : 'GeoExt.panel.Map',
	alias : 'widget.home-map-panel',
	// center : '-940328.71082446, 4949944.6827996', // coordenadas ESPG:900913
	width : 256,
	height : 256,
	// funciona!
	center : [-940328.71082446, 4949944.6827996], // coordenadas ESPG:900913
	zoom : 12,
	stateful : false, // true, // false,
	// o estado [do mapa] é guardado num cookie
	stateId : 'home-map-panel',
	initComponent : function() {
		var options = {
			controls : [new OpenLayers.Control.MousePosition({
				prefix : 'Coordenadas <a href="http://www.igeo.pt/produtos/Geodesia/inf_tecnica/sistemas_referencia/Datum_ETRS89.htm" target="_blank">PT-TM06/ETRS89</a>: ',
				suffix : ' (long, lat)',
				numDigits : 0
			}), new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoom(), new OpenLayers.Control.LayerSwitcher()],
			projection : new OpenLayers.Projection("EPSG:900913"),
			// displayProjection : new OpenLayers.Projection("EPSG:3763"),
			units : 'm'
		};
		this.map = new OpenLayers.Map(options);
		this.callParent(arguments);
	}
});

Ext.define('DemoExtJs.view.Users.Profile', {
	extend : 'Ext.panel.Panel',
	// com vários forms dentro
	alias : 'widget.profile',
	title : 'Profile',
	requires : ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
	bodyPadding : 5,
	autoScroll : true,
	items : [{
		xtype : 'avatar',
		title : 'Fotografia'
	}, {
		xtype : 'form',
		itemId : 'dados',
		trackResetOnLoad : true, // saber que fields estão dirty
		title : 'Dados',
		items : [{
			xtype : 'fieldset',
			title : 'Identificação',
			frame : false,
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Nome',
				name : 'nome'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Nº de Identificação Fiscal',
				name : 'nif'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Nº de Identificação Civil (BI ou CC)',
				name : 'nic'
			}, {
				xtype : 'checkbox',
				fieldLabel : 'Masculino?',
				name : 'masculino',
				inputValue : '1',
				uncheckedValue : '0'
			}]
		}, {
			xtype : 'fieldset',
			title : 'Endereço de email',
			layout : 'hbox',
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Email',
				name : 'email',
				readOnly : true,
				disabled : true,
				maxLength : 48
			}, {
				xtype : 'button',
				itemId : 'changeEmail',
				text : 'Alterar o email'
			}]
		}, {
			xtype : 'fieldset',
			title : 'Telefones',
			frame : false,
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Telefone',
				name : 'telefone'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Telemóvel',
				name : 'telemovel'
			}]
		}, {
			xtype : 'fieldset',
			title : 'Endereço postal',
			frame : false,
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Morada',
				name : 'morada'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Localidade',
				name : 'localidade'
			}, {
				xtype : 'panel',
				layout : 'hbox',
				items : [{
					xtype : 'textfield',
					fieldLabel : 'Código',
					name : 'codpostal',
					maxLength : 8, // 4715-281
					minLength : 4,
					minLengthText : 'O código postal tem que ter 4 digitos.'
				}, {
					xtype : 'textfield',
					name : 'despostal'
				}]
			}]
		}],
		dockedItems : [{
			xtype : 'toolbar',
			flex : 1,
			dock : 'bottom',
			layout : {
				pack : 'end',
				type : 'hbox'
			},
			items : [/*{
			 xtype : 'button',
			 itemId : 'carregar',
			 text : 'Carregar'
			 }, {
			 xtype : 'button',
			 itemId : 'cancelar',
			 text : 'Cancelar'
			 }, */
			{
				xtype : 'button',
				itemId : 'gravar',
				formBind : true,
				text : 'Gravar'
			}, {
				xtype : 'tbfill'
			}]
		}]
	}, {
		xtype : 'panel',
		itemId : 'localizacao',
		title : 'Localização',
		items : [{
			xtype : 'label',
			text : 'Para aceder rapidamente à informação na sua vizinhança, indique a sua localização.',
			style : 'display:block; padding:20px 0px 20px 0px' // top right bottom left
		}, {
			xtype : 'home-map-panel'
		}, {
			xtype : 'form',
			itemId : 'home',
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Longitude',
				name : 'longitude',
				readOnly : true,
				minLength : 1
				// disabled : true
			}, {
				xtype : 'textfield',
				fieldLabel : 'Latitude',
				name : 'latitude',
				readOnly : true,
				minLength : 1
				// disabled : true
			}],
			dockedItems : [{
				xtype : 'toolbar',
				flex : 1,
				dock : 'bottom',
				layout : {
					pack : 'end',
					type : 'hbox'
				},
				items : [{
					xtype : 'button',
					itemId : 'limpar',
					text : 'Remover informação de localização'
				}, {
					xtype : 'button',
					itemId : 'gravar',
					text : 'Gravar informação da localização'
				}, {
					xtype : 'tbfill'
				}]
			}]
		}]

	}, {
		xtype : 'xpassword',
		title : 'Alterar senha',
		collapsible : true
	}]

});
