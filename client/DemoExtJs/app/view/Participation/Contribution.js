Ext.define('DemoExtJs.view.Illustrate', {
	extend : 'Ext.form.Panel',
	// stores : ['TipoOcorrenciaCombo'],
	xtype : 'illustrate',
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
		src : 'resources/images/community_gray_80x80.png',
		itemId : 'imagecomponent160',
		height : 80
	}, {
		xtype : 'imagecomponent',
		src : 'resources/images/community_gray_80x80.png',
		itemId : 'imagecomponent32',
		height : 80
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
	}]
});

Ext.define('ImageModel', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'name'
	}, {
		name : 'url'
	}, {
		name : 'size',
		type : 'float'
	}, {
		name : 'lastmod',
		type : 'date',
		dateFormat : 'timestamp'
	}]
});

var store = Ext.create('Ext.data.Store', {
	model : 'ImageModel',
	data : [{
		"name" : "up_to_something.jpg",
		"size" : 2120,
		"lastmod" : 1368712528000,
		"url" : "images/up_to_something.jpg"
	}, {
		"name" : "sara_pumpkin.jpg",
		"size" : 2588,
		"lastmod" : 1368712528000,
		"url" : "images/sara_pumpkin.jpg"
	}, {
		"name" : "zacks_grill.jpg",
		"size" : 2825,
		"lastmod" : 1368712528000,
		"url" : "images/zacks_grill.jpg"
	}, {
		"name" : "zack_sink.jpg",
		"size" : 2303,
		"lastmod" : 1368712528000,
		"url" : "images/zack_sink.jpg"
	}, {
		"name" : "kids_hug2.jpg",
		"size" : 2476,
		"lastmod" : 1368712528000,
		"url" : "images/kids_hug2.jpg"
	}, {
		"name" : "zack_dress.jpg",
		"size" : 2645,
		"lastmod" : 1368712528000,
		"url" : "images/zack_dress.jpg"
	}, {
		"name" : "kids_hug.jpg",
		"size" : 2477,
		"lastmod" : 1368712528000,
		"url" : "images/kids_hug.jpg"
	}, {
		"name" : "sara_smile.jpg",
		"size" : 2410,
		"lastmod" : 1368712528000,
		"url" : "images/sara_smile.jpg"
	}, {
		"name" : "dance_fever.jpg",
		"size" : 2067,
		"lastmod" : 1368712528000,
		"url" : "images/dance_fever.jpg"
	}, {
		"name" : "zack_hat.jpg",
		"size" : 2323,
		"lastmod" : 1368712528000,
		"url" : "images/zack_hat.jpg"
	}, {
		"name" : "sara_pink.jpg",
		"size" : 2154,
		"lastmod" : 1368712528000,
		"url" : "images/sara_pink.jpg"
	}, {
		"name" : "zack.jpg",
		"size" : 2901,
		"lastmod" : 1368712528000,
		"url" : "images/zack.jpg"
	}, {
		"name" : "gangster_zack.jpg",
		"size" : 2115,
		"lastmod" : 1368712528000,
		"url" : "images/gangster_zack.jpg"
	}]
});

Ext.define('DemoExtJs.view.Participation.Contribution', {
	extend : 'Ext.panel.Panel',
	xtype : 'contribution',
	// title : 'Participar',
	requires : ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
	bodyPadding : 5,
	// autoScroll : true,
	items : [{
		xtype : 'form',
		itemId : 'detail',
		trackResetOnLoad : true, // saber que fields estão dirty
		// title : 'Dados',
		autoWidth : true,
		items : [{
			xtype : 'hiddenfield',
			name : 'feature'
		}, {
			xtype : 'textfield',
			// fieldLabel : 'titulo',
			emptyText : 'Título...',
			name : 'titulo',
			anchor : '100%'
		}, {
			xtype : 'combo',
			name : 'idtipoocorrencia', // o que é submetido no form...
			itemId : 'id_tipo_ocorrencia',
			editable : false,
			valueField : 'id',
			displayField : 'designacao',
			emptyText : 'Escolha um tipo...',
			forceSelection : true,
			triggerAction : 'all',
			store : 'TipoOcorrenciaCombo',
			queryMode : 'local',
			listConfig : {
				itemTpl : '<tpl for="."><div class="combo-superior-{isclass}"><span>{designacao}</span></div></tpl>'
			},
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Obrigatório">*</span>',
			anchor : '100%'
		}, {
			xtype : 'textareafield',
			// grow : true,
			name : 'participacao',
			// fieldLabel : 'Descrição',
			emptyText : 'Descreva a sua participação...',
			anchor : '100%',
			height : 120,
			afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Obrigatório">*</span>'
		}, {
			id : 'images-view', //importante por causa do CSS
			// frame : true,
			autoHeight : true,
			height : 110,
			autoScroll : true,
			// title : 'Simple DataView (0 items selected)',

			// http://honoluluhacker.com/2008/12/15/horizontal-scrollbars-on-extjs-dataview/
			items : [{
				xtype : 'dataview',
				title : 'Fotografias',
				store : store,
				tpl : ['<tpl for=".">', '<div class="thumb-wrap" id="{name:stripTags}">', '<div class="thumb"><img src="/ext/examples/view/{url}" title="{name:htmlEncode}"></div>', '<span class="x-editable">{shortName:htmlEncode}</span>', '</div>', '</tpl>', '<div class="x-clear"></div>'],
				multiSelect : true,
				width : 2000,
				height : 95,
				trackOver : true,
				overItemCls : 'x-item-over',
				itemSelector : 'div.thumb-wrap',
				emptyText : 'No images to display',
				/*
				 plugins : [Ext.create('Ext.ux.DataView.DragSelector', {}), Ext.create('Ext.ux.DataView.LabelEditor', {
				 dataIndex : 'name'
				 })],
				 */
				prepareData : function(data) {
					Ext.apply(data, {
						shortName : Ext.util.Format.ellipsis(data.name, 15),
						sizeString : Ext.util.Format.fileSize(data.size),
						dateString : Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
					});
					return data;
				},
				listeners : {
					selectionchange : function(dv, nodes) {
						var l = nodes.length, s = l !== 1 ? 's' : '';
						// this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
					}
				}
			}]
		} /*, {
		 xtype : 'textfield',
		 name : 'user_name',
		 fieldLabel : 'Nome',
		 allowBlank : false, // requires a non-empty value
		 afterLabelTextTpl : required
		 }, {
		 xtype : 'textfield',
		 name : 'email',
		 fieldLabel : 'Email',
		 vtype : 'email', // requires value to be a valid email address format
		 afterLabelTextTpl : required
		 } */ ],
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
				itemId : 'local',
				// formBind : true,
				icon : 'resources/images/target.png',
				enableToggle : true,
				text : ''
			}, {
				xtype : 'filefield',
				name : 'instantaneo',
				itemId : 'instantaneo',
				// fieldLabel : 'Photo',
				labelWidth : 50,
				msgTarget : 'side',
				allowBlank : true,
				anchor : '40%',
				icon : 'resources/assets/pencil.png',
				buttonOnly : true,
				buttonText : '',
				buttonConfig : {
					iconCls : 'upload-icon'
				},
				listeners : {
					afterrender : function(cmp) {
						cmp.fileInputEl.set({
							accept : 'image/*'
						});
					}
				}
			}, {
				xtype : 'button',
				itemId : 'remove',
				formBind : true,
				icon : 'resources/images/icons/fam/image_remove.png',
				text : ''
			}, {
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				itemId : 'limpar',
				formBind : true,
				text : 'Limpar'
			}, {
				xtype : 'button',
				itemId : 'gravar',
				formBind : true,
				icon : 'resources/assets/pencil.png',
				text : 'Participar'
			}]
		}]
	}]
});
