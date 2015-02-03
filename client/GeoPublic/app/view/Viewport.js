Ext.apply(Ext.form.field.VTypes, {
	password : function(val, field) {
		var formPanel = field.up('form'), pwd = formPanel.down('textfield[name=password]').getValue();
		// console.log(val, field.name, pwd);
		// consoante eu sou a password de cima ou de baixo, tenho que fazera comparação
		// tenho que por este vtype em ambos os campos
		return val == pwd;
	},
	passwordText : 'Passwords do not match'.translate()
});

// http://stackoverflow.com/questions/9704913/confirm-password-validator-extjs-4

Ext.define('GeoPublic.view.Viewport', {
	extend : 'Ext.container.Viewport',
	requires : ['Ext.tab.Panel', 'Ext.layout.container.Border', 'Ext.layout.container.Column'],
	layout : 'border',
	items : [{
		region : 'north',
		xtype : 'topheader'
	}, {
		region : 'center',
		xtype : 'tabpanel',
		plain : true, // remover o fundo da barra dos panels
		items : [{
			xtype : 'startpanel',
            glyph: 0xf015
		}, /* {
			xtype : 'mapa-com-projeto'
		}, {
			xtype: 'discussao-regulamento'
		},*/ {
            itemId: 'separador',
            tabConfig : {
                xtype : 'tbfill'
            }
        } /*, {
            title : 'Estatísticas',
            hmtl : 'Estatísticas'
        }, {
            xtype : 'grid-promotor'
        },  {
			xtype : 'bem-vindo-panel'
		}*/ ]
	}]
});