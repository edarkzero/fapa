$.fn.modal.Constructor.prototype.enforceFocus = function() {};

$(document).ready(function(e)
{
    MainApp.view.admin = {
        target: null,
        url: null,
        panel: '.panel-collapse',
        filter: '.panel-filter',
        body: '.panel-body'
    };

    $(document).on('submit','#modal-dialog .modal-body form',function(e)
    {
        e.preventDefault();
        var $form = $(this);
        $form.children(':submit').addClass('disabled');
        MainApp.ajax.send($(this).serialize(),undefined,this.action,this.method,'text',function(re){
            $form.children(':submit').removeClass('disabled');
            MainApp.html.ajaxReplace(MainApp.view.admin.target,undefined,undefined,MainApp.view.admin.url,'GET');
            MainApp.toast.success(MainApp.common.replaceUndefined(MainApp.messages.success));
            MainApp.modal.hide();            
        },function(){
            $form.children(':submit').removeClass('disabled');
        });
    });
    
    

    $(MainApp.view.admin.panel).on('show.bs.collapse',function()
    {
        MainApp.view.admin.target = '#'+this.id+' .panel-body';
        MainApp.view.admin.url = $(this).attr('data-info');
        MainApp.html.ajaxReplace(MainApp.view.admin.target,undefined,undefined,MainApp.view.admin.url,'GET');
    });

    $(MainApp.view.admin.body).on('click', '.pagination a', function (e) {
        var params = this.href.split('?page=');
        var page = params[1];
        e.preventDefault();
        MainApp.html.ajaxReplace(MainApp.view.admin.target,{page: page},undefined,MainApp.view.admin.url,'GET');
    });

    $(MainApp.view.admin.body).on('click','.action-option', function(e) {
        e.preventDefault();
        var $elem = $(this);
        var data = '';
        if(typeof $elem.attr('data-id') != undefined)
            data = {id: $elem.attr('data-id')};
        MainApp.modal.ajax(data,undefined,this.href,'GET','html');
    });

    $(MainApp.view.admin.body).on('click',MainApp.view.admin.filter,function(e)
    {
        e.preventDefault();
        var dataInfo = $(this).attr('data-info');
        MainApp.html.ajaxReplace(MainApp.view.admin.target,undefined,undefined,dataInfo,'GET');
    });

    $(MainApp.view.admin.body).on('click', '.btn-delete', function (e) {
        e.preventDefault();
        var $elem = $(this);
        var $btn = $('#modal-delete-button');
        $btn.attr('data-id', $elem.attr('data-id'));
        $btn.attr('data-url', this.href);
        $('#modal-delete').modal('show');
    });

    MainApp.modal.delete(undefined,undefined,undefined,function(){
        MainApp.html.ajaxReplace(MainApp.view.admin.target,undefined,undefined,MainApp.view.admin.url,'GET');
    });
});