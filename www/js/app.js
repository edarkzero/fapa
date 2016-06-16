$(document).ready(function() {
    MainApp.view.schedule = {
        target: null,
        url: null,
        modal: '#modal-dialog-schedule',
        activator: '.btn-schedule'
    };

    $(document).on('submit',MainApp.view.schedule.modal+' .modal-body form',function(e)
    {
        e.preventDefault();
        var $form = $(this);
        $form.children(':submit').addClass('disabled');
        MainApp.ajax.send($(this).serialize(),undefined,this.action,this.method,'text',function(re){
            $form.children(':submit').removeClass('disabled');
            MainApp.html.ajaxReplace(MainApp.view.schedule.target,undefined,undefined,MainApp.view.schedule.url,'GET');
            MainApp.toast.success(MainApp.common.replaceUndefined(MainApp.messages.success));
            MainApp.modal.hide();
        },function(){
            $form.children(':submit').removeClass('disabled');
        });
    });

    $(MainApp.view.schedule.activator).click(function(e)
    {
        e.preventDefault();
        MainApp.view.schedule.url = this.href;
        MainApp.view.schedule.target = MainApp.view.schedule.modal+' .modal-body';
        MainApp.modal.ajax('id=1',undefined,this.href,'GET','text',MainApp.view.schedule.modal);
    });

    $(MainApp.view.schedule.modal).on('click', '.pagination a', function (e) {
        var params = this.href.split('?page=');
        var page = params[1];
        e.preventDefault();
        MainApp.html.ajaxReplace(MainApp.view.schedule.target,{page: page},undefined,MainApp.view.schedule.url,'GET');
    });

    $(MainApp.view.schedule.modal).on('click','.action-option', function(e) {
        e.preventDefault();
        var $elem = $(this);
        var data = '';
        if(typeof $elem.attr('data-id') != undefined)
            data = {id: $elem.attr('data-id')};
        MainApp.modal.ajax(data,undefined,this.href,'GET','html',MainApp.view.schedule.modal);
    });

    $(MainApp.view.schedule.modal).on('click', '.btn-delete', function (e) {
        e.preventDefault();
        var $elem = $(this);
        var $btn = $('#modal-delete-button');
        $btn.attr('data-id', $elem.attr('data-id'));
        $btn.attr('data-url', this.href);
        $(MainApp.view.schedule.modal).modal('hide');
        $('#modal-delete').modal('show');
    });

    MainApp.modal.delete(undefined,undefined,undefined,function(){
        MainApp.html.ajaxReplace(MainApp.view.admin.target,undefined,undefined,MainApp.view.admin.url,'GET');
    });
});