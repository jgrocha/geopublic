Ext.define('GeoPublic.view.Participation.FrameViewer', {
    extend: 'Ext.window.Window',
    alias: 'widget.frameviewer',
    layout: 'border',
    title: "Fotografias", // nome do vídeo e número da frame
    modal: true,
    closable: true,
    closeAction: 'destroy', // default!
    minWidth: 200,
    minHeight: 200,
    resizable: {
        preserveRatio: true
    },
    initComponent: function () {
        //<debug>
        console.log(this.initialConfig);
        //</debug>

        this.store = this.initialConfig.store;
        this.indice = this.initialConfig.indice;

        var tam = this.calculaDimensoesJanela(this.initialConfig.largura, this.initialConfig.altura);
        this.width = tam.largura;
        this.height = tam.altura;

        var drawComponent = Ext.create('Ext.draw.Component', {
            region: 'center',
            margin: '0 36 0 36',
            // width: this.width,
            // height: this.height,
            items: [{
                type: 'image',
                // x : 0,
                // y : 0,
                width: this.initialConfig.largura,
                height: this.initialConfig.altura,
                src: this.initialConfig.caminho
            }]
        });
        //<debug>
        console.log(drawComponent);
        //</debug>
        this.items = [{
            region: 'center',
            itemId: 'tela',
            layout: 'border',
            bodyStyle: 'background:none',
            autoScroll: false, // true,
            items: [drawComponent]
        }];
        this.bbar = ['->',
            {
                // text: '-1',
                action: 'previousframe',
                glyph: 0xf0d9, // fa-caret-left [&#xf0d9;]
                enableToggle: false,
                disabled: this.indice == 0
            }, {
                // text: '+1',
                action: 'nextframe',
                glyph: 0xf0da, // fa-caret-right [&#xf0da;]
                enableToggle: false,
                disabled: this.indice >= this.store.count()-1
            }, {
                text: 'Fechar',
                action: 'fechar',
                glyph: 0xf00d, // fa-close (alias) [&#xf00d;]
                enableToggle: false
            }];
        this.callParent(arguments);
    },
    calculaDimensoesJanela: function (largura, altura) {
        // Isto não é fácil, porque a janela tem uma geometria diferente da imagem, certo?
        var heightJanela = 0;
        var widthJanela = 0;
        var vracio = 1.0;
        var hracio = 1.0;
        var heightBrowser = Ext.getBody().getViewSize().height - 120;
        var heightImagem = altura;
        if (heightBrowser < heightImagem) {
            vracio = heightBrowser / heightImagem;
        }
        var widthBrowser = Ext.getBody().getViewSize().width - 120;
        var widthImagem = largura;
        if (widthBrowser < widthImagem) {
            hracio = widthBrowser / widthImagem;
        }
        if (vracio == 1.0 && hracio == 1.0) {
            // porreiro, a imagem cabe
            heightJanela = heightImagem;
            widthJanela = widthImagem;
        } else {
            if (vracio < hracio) {
                heightBrowser = heightBrowser - 120;
                // há maior restrição na altura
                heightJanela = Math.round(heightImagem * vracio);
                widthJanela = Math.round(widthImagem * vracio);
            } else {
                heightJanela = Math.round(heightImagem * hracio);
                widthJanela = Math.round(widthImagem * hracio);
            }
        }
        return({
            largura: widthJanela,
            altura: heightJanela + 36
        });
    },
    setImage: function (indice, caminho, largura, altura) {
        this.indice = indice;
        this.down('#tela').removeAll(true);
        var tam = this.calculaDimensoesJanela(largura, altura);
        this.resizer.resizeTo(tam.largura, tam.altura);
        // Além do resize, era necessário centrar de novo a imagem...

        var widthBrowser = Ext.getBody().getViewSize().width;
        this.setX((widthBrowser-tam.largura)/2);

        var heightBrowser = Ext.getBody().getViewSize().height;
        this.setY((heightBrowser-tam.altura)/2);

        var drawComponent = Ext.create('Ext.draw.Component', {
            region: 'center',
            // width: this.width,
            // height: this.height,
            items: [{
                type: 'image',
                // x : 0,
                // y : 0,
                width: largura,
                height: altura,
                src: caminho
            }]
        });
        this.down('#tela').add(drawComponent);

        if (indice > 0) {
            this.down('toolbar button[action=previousframe]').enable();
        } else {
            this.down('toolbar button[action=previousframe]').disable();
        }

        if (indice < this.store.count()-1) {
            this.down('toolbar button[action=nextframe]').enable();
        } else {
            this.down('toolbar button[action=nextframe]').disable();
        }
    }
});