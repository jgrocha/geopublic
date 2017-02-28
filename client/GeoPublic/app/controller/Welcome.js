Ext.define('GeoPublic.controller.Welcome', {
    extend: 'Ext.app.Controller',
    requires: [, 'GeoPublic.view.StartPlanoDescricao', 'GeoPublic.view.DiscussaoRegulamento', 'GeoPublic.view.DiscussaoGeografica'],
    stores: ['PlanToShow'], // getPlanToShowStore
    refs: [{
        selector: 'viewport tabpanel',
        ref: 'painelPrincipal' // gera um getPainelPrincipal
    }, {
        selector: 'viewport tabpanel welcome #plantoshowbar',
        ref: 'planToShowPanel' // gera um getPlanToShowPanel
    }, {
        selector: 'viewport tabpanel welcome #planpresentationbar',
        ref: 'planPresentationBar' // gera um getPlanPresentationBar
    }, {
        selector: 'viewport tabpanel welcome #rulebar',
        ref: 'planRuleBar' // gera um getPlanRuleBar
    }, {
        selector: 'welcome',
        ref: 'welcome' // gera um getWelcome
    }],
    active: -1,
    currentPlan: {},
    init: function () {
        this.getPlanToShowStore().on({
            scope: this,
            load: this.showPlanos
        });
        this.control({
            'welcome': {
                afterrender: function (view) {
                    console.log('Welcome afterrender');
                    var layout = view.getLayout();
                    this.active = view.items.indexOf(layout.getActiveItem());
                    console.log('Welcome active item: ' + this.active);

                    var store = this.getPlanToShowStore();
                    store.load();

                }
            },
            'welcome plano button#apresentacao': {
                'click': this.onMostraApresentacaoPlano
            },
            'welcome #rulebar button#previous': {
                'click': this.onPrev
            },
            'welcome #planpresentationbar button#previous': {
                'click': this.onPrev
            },
            'welcome #planpresentationbar button#rules': {
                'click': this.onNext
            },
            'welcome #planpresentationbar button#discuss': {
                'click': this.onDiscussPlano
            },
            'welcome #rulebar button#discuss': {
                'click': this.onDiscussPlano
            },
            'welcome #card-prev': {
                'click': this.onPrev
            },
            'welcome #card-next': {
                'click': this.onNext
            }
        }, this);
    },
    onDiscussPlano: function (button, e, options) {
        var me = this;
        var plano = this.currentPlan;
        if (plano) {
            // console.log(plano);
            var tabPanel = me.getPainelPrincipal();

            var pos = tabPanel.items.findIndex('title', plano.designacao);

            if (pos > -1) {
                // já existe e está aberto
                me.getPainelPrincipal().setActiveTab(pos);
            } else {
                // vamos criar um novo tab para discutir um dado plano
                var sepTab = tabPanel.child('#separador');
                var sepTabIndex = tabPanel.items.findIndex('id', sepTab.id);
                if (plano.proposta.length > 0) {
                    me.getPainelPrincipal().insert(sepTabIndex, Ext.create(GeoPublic.view.DiscussaoRegulamento, {
                        itemId: 'discussion-' + plano.idplano,
                        idplano: plano.idplano,
                        idpromotor: plano.idpromotor,
                        title: plano.designacao,
                        designacao: plano.designacao,
                        descricao: plano.descricao,
                        // the_geom: plano.the_geom,
                        proposta: plano.proposta,
                        alternativeproposta: plano.alternativeproposta,
                        email: plano.email,
                        closed: plano.closed
                    }));
                } else {
                    me.getPainelPrincipal().insert(sepTabIndex, Ext.create(GeoPublic.view.DiscussaoGeografica, {
                        itemId: 'discussion-' + plano.idplano,
                        idplano: plano.idplano,
                        idpromotor: plano.idpromotor,
                        title: plano.designacao,
                        designacao: plano.designacao,
                        descricao: plano.descricao,
                        the_geom: plano.the_geom,
                        email: plano.email,
                        closed: plano.closed
                        // proposta: plano.proposta,
                        // alternativeproposta: plano.alternativeproposta
                    }));
                }
                me.getPainelPrincipal().setActiveTab(sepTabIndex);
            }
        } else {
            console.log('Plan details missing');
        }
    },
    onMostraApresentacaoPlano: function (button, e, options) {
        console.log('Welcome onMostraApresentacaoPlano');

        var startplano = button.up('plano');

        this.currentPlan = startplano;
        // Teste na consola
        // var tp = Ext.ComponentQuery.query('viewport tabpanel welcome #planpresentationbar')[0]

        var tp = this.getPlanPresentationBar();
        tp.setTitle(startplano.title);
        // the next panel
        // this.getPlanRuleBar().setTitle(startplano.title);

        tp.update(startplano.descricao);
        // tp.addCls(startplano.planocls);

        if (startplano.background) {
            var url = 'url("' + startplano.background + '")';
            tp.setBodyStyle('background-image', url);
            tp.setBodyStyle('background-repeat', 'no-repeat');
            tp.setBodyStyle('background-position', 'center top');
        } else {
            console.log('No background-image');
        }

        if (this.active < 2) {
            var layout = this.getWelcome().getLayout();
            layout.setActiveItem(++this.active);
        }

    },
    onPrev: function (b) {
        console.log('Welcome onPrev');
        if (this.active > 0) {
            var layout = this.getWelcome().getLayout();
            layout.setActiveItem(--this.active);
        }
    },
    onNext: function (b) {
        console.log('Welcome onNext');
        if (this.active < 2) {
            var layout = this.getWelcome().getLayout();
            layout.setActiveItem(++this.active);
        }
        this.getPlanRuleBar().setTitle(this.currentPlan.title);
    },
    showPlanos: function (store, records) {
        var me = this;
        var bar = me.getPlanToShowPanel();
        bar.removeAll(true);

        store.each(function (rec) {
            console.log('showPlanos → ' + rec.get('designacao'));

            var hoje = new Date();
            var closed = false;
            if (rec.get('fim') < hoje) {
                closed = true;
            }

            var plano = Ext.apply({}, rec.data, {
                idplano: rec.data.id,
                closed: closed
            });
            delete plano.id;
            var newPlano = new GeoPublic.view.Plano(plano);
            bar.add(newPlano);
        });

        bar.doLayout();
    }
});
