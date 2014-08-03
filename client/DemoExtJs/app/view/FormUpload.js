Ext.define('DemoExtJs.CustomReader', {
	extend : 'Ext.data.reader.Reader',
	alias : 'reader.ns-customreader',
	read : function(xhr) {
		var resp = Ext.JSON.decode(response.responseText, true);
		console.log('ns-customreader');
		// Handle the case where response is not JSON too (unhandled server errror?)
		return {
			success : resp ? !!resp.id : false
		};
	}
});

Ext.define('DemoExtJs.view.FormUpload', {
	extend : 'Ext.form.Panel',

	xtype : 'form-upload',

	requires : ['Ext.form.field.File', 'Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],

	title : 'Form File Upload',

	bodyPadding : 5,

	/*
	 api : {
	 submit : 'ExtRemote.DXFormTest.filesubmitshapefile'
	 },
	 */

	errorReader : 'ns-customreader',

	paramOrder : ['uid'],

	items : [{
		xtype : 'imagecomponent',
		src : 'uploaded_images/Wiki.png' // 'http://www.sencha.com/img/20110215-feat-html5.png'
	}, {
		xtype : 'textfield',
		fieldLabel : 'Description', //
		name : 'callback'
	}, {
		xtype : 'textfield',
		fieldLabel : 'forcePlainText', //
		name : 'forcePlainText'
	}, {
		xtype : 'filefield',
		name : 'upload', // 'photo',
		fieldLabel : 'Photo',
		labelWidth : 50,
		msgTarget : 'side',
		allowBlank : false, // true,
		anchor : '40%',
		buttonText : 'Select file...'
	}],
	dockedItems : [{
		xtype : 'box',
		dock : 'top',
		height : 25,
		padding : 5,
		html : 'Important: Cross domain file upload is limited. There is no direct way to parse the response!For this example to work server and client code should be hosted on the same domain including port!'
	}],
	tbar : [{
		text : 'Upload..',
		disabled : true,
		handler : function(btn) {

			btn.up('form').getForm().submit({
				waitMsg : 'Uploading your photo...',

				callback : function(fp, o) {

				},

				success : function(fp, o) {
					Ext.Msg.alert('Success', 'Your photo "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
				},

				failure : function(form, action) {
					console.log(arguments);
					Ext.MessageBox.show({
						title : 'EXCEPTION',
						msg : 'Erro ao carregar o arquivo',
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.Msg.OK
					});
				}
			});

		}
	}, {
		text : 'Upload shapefile',
		handler : function(btn) {

			if (btn.up('form').getForm().isValid()) {
				btn.up('form').getForm().submit({
					waitMsg : 'Uploading your shapefile ...',

					callback : function(fp, o) {

					},

					success : function(fp, o) {
						Ext.Msg.alert('Success', 'Your shapefile "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
						console.log(mapDebug);
					},

					failure : function(form, action) {
						console.log(arguments);
						Ext.MessageBox.show({
							title : 'EXCEPTION',
							msg : 'Erro ao carregar o arquivo',
							icon : Ext.MessageBox.ERROR,
							buttons : Ext.Msg.OK
						});
					}
				});
			} else {
				Ext.MessageBox.show({
					title : 'EXCEPTION',
					msg : 'Form inválido...',
					icon : Ext.MessageBox.ERROR,
					buttons : Ext.Msg.OK
				});
			}
		}
	}, {
		text : 'Upload to OGRE',
		handler : function(btn) {

			if (btn.up('form').getForm().isValid()) {
				btn.up('form').getForm().submit({

					method : 'POST',
					url : 'http://cm-agueda.geomaster.pt:3001/convert',
					errorReader : 'ns-customreader',
					waitMsg : 'Uploading your shapefile ...',

					callback : function(fp, o) {
						console.log('--> callback');
					},

					success : function(fp, o) {
						Ext.Msg.alert('Success', 'Your shapefile "' + o.result.name + '" has been uploaded.<br> File size:' + o.result.size + ' bytes.');
					},

					failure : function(form, action) {
						console.log(arguments);
						Ext.MessageBox.show({
							title : 'EXCEPTION',
							msg : 'Erro ao carregar o arquivo',
							icon : Ext.MessageBox.ERROR,
							buttons : Ext.Msg.OK
						});
					}
				});
			} else {
				Ext.MessageBox.show({
					title : 'EXCEPTION',
					msg : 'Form inválido...',
					icon : Ext.MessageBox.ERROR,
					buttons : Ext.Msg.OK
				});
			}
		}
	}]
});

