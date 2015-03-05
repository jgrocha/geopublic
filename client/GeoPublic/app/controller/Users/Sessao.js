Ext.define('GeoPublic.controller.Users.Sessao', {
    extend: 'Ext.app.Controller',
    refs: [
        {
            ref: 'editor',
            selector: 'grid-sessao #todoForm'
        },
        {
            ref:'todoGrid',
            selector:'grid-sessao #todoGrid'
        }
    ],
    init: function(application) {
        this.control({
            "grid-sessao #todoGrid": {
                itemclick: this.onTodoGridItemClick
            },

            'grid-sessao button': { //listening for all buttons on grid-sessao here, then narrow down to particular button inside actual method
                click: this.buttonActions
            },

            'grid-sessao #todoGrid toolbar trigger': {
                'filter-reset': function(){ //not the best practice, please avoid if possible! this only shows that you can use dashes for event names.
                    //we can define logic also here
                    Ext.getStore('Users.Sessao').clearFilter();
                }
            }
        });
    },

    //improves excessive query overhead
    buttonActions: function(button, e, eOpts){
        switch(button.action){
            case 'insertRecord': this.onInsertBtnClick(); break;
            case 'updateRecord': this.onUpdateBtnClick(); break;
            case 'removeRecord': this.onRemoveBtnClick(); break;
            case 'loadStore': this.laodStore(); break;
            case 'filterStore': this.filterStore(); break;
            default: break;
        }
    },

    laodStore:function(){
        this.getTodoGrid().getStore().reload();
    },

    filterStore: function(){
        console.log('filterStore?');
        var field = Ext.ComponentQuery.query('grid-sessao toolbar trigger')[0],
            value = field.getValue(),
            store = Ext.getStore('Users.Sessao');

        if(value){
            store.clearFilter(true);
            store.filter('hostname', value);  // filter on 'hostname' field
        }
    },

    onTodoGridItemClick: function(dataview, record, item, index, e, eOpts) {
        var form = this.getEditor();
        form.getForm().loadRecord(record);
        form.enable();
    },

    onInsertBtnClick: function() {
        var store = Ext.getStore('Todo');
        var record = Ext.create('GeoPublic.model.TodoItem', {text:'New todo action ' + +(store.getCount() +1), complete:0});
        record.save({
            callback:function(records, operation, success){
                //we add to store only after successful insertion at the server-side
                if(success){
                    Ext.getStore('Todo').add(records);
                }else{
                    console.log('Failure to add record: ', arguments);
                    Ext.Msg.alert('Server side Error', 'Unable to insert record');
                }
            }
        });
    },

    onRemoveBtnClick: function() {
        var me = this;
        if(this.missingSelection()){
            Ext.Msg.alert('Error', 'Please select record to remove');
        }else{
            var form = me.getEditor().getForm(),
                record = form.getRecord(),
                store = Ext.getStore('Todo');
            me.getTodoGrid().getSelectionModel().deselect(record);

            store.remove(record);

            record.destroy({
                callback:function(records, operation){
                    var success = operation.wasSuccessful();
                    form.reset();
                    me.getEditor().disable();
                    if(success){
                        console.log('Sucessfully removed record: ', arguments);
                    }else{
                        // store.insert(record.index, record);
                        store.add(record);
                        console.log('Failure to remove record: ', arguments);
                        Ext.Msg.alert('Server side Error', 'Unable to remove the record');
                    }
                }
            });
        }
    },

    onUpdateBtnClick: function() {
        //prevent errors if no records selected
        if(this.missingSelection()){
            return false;
        }

        var form = this.getEditor().getForm();

        if (form.isValid()) {
            var record = form.getRecord();
            form.updateRecord(record);

            record.save({
                success: function(record, operation) {
                    record.commit(); // ##Juris :: Commit record in the store
                    console.log('success', record, operation);
                    // update form from computed remote record
                    form.loadRecord(record);
                },
                failure: function(record, operation) {
                    var exception = operation.getError();
                    if (exception && exception.errors) form.markInvalid(exception.errors);
                    console.log('failure', record, operation, exception);
                    Ext.Msg.alert('Server side Error', 'Unable to update the record');
                },
                scope: this
            });
        }
    },

    missingSelection: function(){
        return this.getTodoGrid().getSelectionModel().getSelection().length === 0;
    }
});