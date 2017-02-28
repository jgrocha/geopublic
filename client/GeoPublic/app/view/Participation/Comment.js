Ext.define('GeoPublic.view.Participation.Comment', {
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'hbox',
        // padding: '5',
        align: 'top'
    },
    alias: 'widget.comment',
    bodyStyle: 'background:none',
    style: 'border-top: 1px solid #CCCCCC',
    // style: 'border-bottom: 1px solid #5C5C5C',
    initComponent: function () {
        var me = this;
        // console.debug(this.initialConfig);
        // console.log('Abrir com a discussao ', this.initialConfig);
        /*
         id serial NOT NULL,
         comentario character varying(255),
         datacriacao timestamp with time zone DEFAULT now(),
         datamodificacao timestamp with time zone DEFAULT now(),
         idocorrencia integer,
         idutilizador integer NOT NULL,
         */
        this.idcomentario = this.initialConfig.idcomentario;
        this.comentario = this.initialConfig.comentario;
        this.idutilizador = this.initialConfig.idutilizador; // quem lançou o comentário
        this.idresponsavel = this.initialConfig.idresponsavel; // id responsável por este plano
        this.nome = this.initialConfig.nome;
        this.closed = this.initialConfig.closed;

        var botoesComentarios = [];

        botoesComentarios.push('->');
        /*
        botoesComentarios.push({
            glyph: 0xf005,  // fa-star [&#xf005;]
            xtype: 'button',
            action: 'favorite',
            tooltip: 'Favorite'.translate()
        });
        */

        if (GeoPublic.LoggedInUser) {
            showComments = true;
            // TODO: check if it is read only
            if ((GeoPublic.LoggedInUser.data.id == this.idutilizador) && !this.closed) {
                // console.log('Mostra botões para a participação ' + this.initialConfig.id_ocorrencia);
                botoesComentarios.push({
                    glyph: 0xf044, // fa-edit (alias) [&#xf044
                    xtype: 'button',
                    action: 'edit-comment',
                    tooltip: 'Edit comment'.translate()
                });
                botoesComentarios.push({
                    glyph: 0xf014, // fa-trash-o [&#xf014;]
                    xtype: 'button',
                    action: 'delete-comment',
                    tooltip: 'Delete comment'.translate()
                });
            }
        }
        // http://docs.sencha.com/extjs/4.2.2/#!/api/Ext.Date

        this.items = [{
            xtype: 'image',
            margin: '10 10 0 10',
            width: 32,
            height: 32,
            src: this.initialConfig.fotografia
        }, {
            bodyStyle: 'background:none',
            itemId: 'comment-body',
            flex: 1,
            margin: '10 0 0 0',
            html: '<b>' + this.initialConfig.nome + '</b> - <i>' + this.initialConfig.tempo + '</i><br/>' + this.initialConfig.comentario
        }];
        this.dockedItems = [{
            style: 'background-color: #EEEEEE;',
            dock: 'bottom',
            xtype: 'toolbar',
            itemId: 'botoes-comentarios',
            items: botoesComentarios
        }];
        this.callParent(arguments);
    }
});