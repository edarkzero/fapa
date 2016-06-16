$(document).ready(function (e) {
    var lastTarget = null;

    $('.panel .panel-body').each(function(index,elem){
        var data = {m:0};
        var method;

        if(!$(this).attr('data-method'))
            method = '';
        else
            method = $(this).attr('data-method');
        MainApp.html.ajaxReplace(this, data, undefined, $(this).attr('data-url'), method);
    });

    $('.panel .panel-body').on('click','.action-option', function(e) {
        e.preventDefault();
        var $elem = $(this);
        var data = {m:0};
        var parent = $elem.parents('.panel-body');

        if(typeof $elem.attr('data-id') != undefined)
            data.id = $elem.attr('data-id');

        MainApp.html.ajaxReplace(parent,data,undefined,this.href,'GET');
    });

    $('.panel .panel-body').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        var $elem = $(this);
        var $btn = $('#modal-delete-button');
        lastTarget = $elem.parents('.panel-body')[ 0 ];
        $btn.attr('data-id', $elem.attr('data-id'));
        $btn.attr('data-url', this.href);
        $(MainApp.view.schedule.modal).modal('hide');
        $('#modal-delete').modal('show');
    });

    MainApp.modal.delete(undefined,undefined,undefined,function(){
        MainApp.html.ajaxReplace(lastTarget,undefined,undefined, lastTarget.href,'GET');
    });

});