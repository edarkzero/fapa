var MainApp = MainApp || {};

MainApp.language = 'en';

MainApp.common = {
    undefined: function (value) {
        return typeof value == 'undefined'
    },
    null: function (value) {
        return value == null;
    },
    replaceUndefined: function (oldValue, newValue) {
        if (this.undefined(oldValue))
            return newValue;
        else return oldValue;
    },
    replaceNull: function (oldValue, newValue) {
        if (this.null(oldValue))
            return newValue;
        else return oldValue;
    }
};

MainApp.messages = {
    loading: "Loading",
    error: "Error",
    success: 'Success',
    set: function (loading, error, success) {
        this.loading = loading;
        this.error = error;
        this.success = success;
    }
};

MainApp.loading = {
    target: '#ajax-loading',
    title: '#ajax-loading-title',
    toggle: function (title, hide) {
        var $title = $(this.title);
        var $loading = $(this.target);

        if (typeof title == 'undefined')
            title = MainApp.messages.loading;

        $title.html(title);

        if (typeof hide == 'undefined')
            $loading.toggleClass('hide');
        else
            $loading.toggleClass('hide', hide);
    },
    show: function (title) {
        this.toggle(title, false);
    },
    hide: function () {
        this.toggle('', true);
    }
}

MainApp.ajax = {
    header: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    send: function (data, loadingMsj, url, method, dataType, handle,failHandle) {
        if (typeof loadingMsj == 'undefined')
            loadingMsj = MainApp.messages.loading;

        if (typeof url == 'undefined')
            url = '';

        if (typeof method == 'undefined')
            method = 'POST';

        if (typeof dataType == 'undefined')
            dataType = 'json';

        $.ajax({
                headers: this.header,
                method: method,
                dataType: dataType,
                data: data,
                url: url,
                beforeSend: function () {
                    MainApp.loading.show(loadingMsj);
                }
            })
            .done(function (response) {
                MainApp.loading.hide();
                //Tooltips
                $("#accordion").tooltip({ selector: '[data-toggle=tooltip]' });

                if (typeof handle != 'undefined')
                    handle(response, dataType);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                MainApp.loading.hide();
                if (MainApp.common.undefined(jqXHR.responseJSON)) {
                    //MainApp.modal.dialog(MainApp.messages.error, jqXHR.responseText);
                    var res = $.parseJSON(jqXHR.responseText);
                    $.each(res, function (attr, msj) {
                        MainApp.toast.error(msj);
                    });
                }
                else
                    $.each(jqXHR.responseJSON, function (index, value) {
                        if (typeof index == 'object') {
                            $.each(index, function (i, v) {
                                MainApp.toast.error(v);
                            });
                        }
                        else {
                            MainApp.toast.error(value);
                        }
                    });
                //MainApp.modal.dialog(MainApp.messages.error, jqXHR.responseJSON);

                if (typeof failHandle != 'undefined')
                    failHandle();
            });
    }
};

MainApp.html = {
    ajaxReplace: function (target, data, loadingMsj, url, method) {
        MainApp.ajax.send(data, loadingMsj, url, method, "html", function (res) {
            var $target = $(target);
            //$target.hide(0);
            $target.html(res);
            $target.fadeIn(800);
        });
    }
};

MainApp.modal = {
    dialogTarget: '#modal-dialog',
    dialogTitle: '.modal-header h4',
    dialogBody: '.modal-body',
    dialog: function (title, message, target) {
        if (MainApp.common.undefined(target))
            target = this.dialogTarget;

        $(target + " " + this.dialogTitle).html(title);
        $(target + " " + this.dialogBody).html(message);

        $(target).modal('show');
    },
    hide: function (target) {
        if (MainApp.common.undefined(target))
            target = this.dialogTarget;
        $(target).modal('hide');
    },
    ajax: function (data, loadingMsj, url, method, dataType, target, callback) {
        MainApp.ajax.send(data, loadingMsj, url, method, dataType, function (res, dt) {
            if (dt === 'json')
                MainApp.modal.dialog(res.title, res.body, target);
            else
                MainApp.modal.dialog("", res, target);

            if (typeof callback != 'undefined')
                callback(res, dt);
        });
    },
    delete: function (triggererID, wrapperID, modalID, handle, hideID) {
        triggererID = MainApp.common.replaceUndefined(triggererID, '#modal-delete-button');
        wrapperID = MainApp.common.replaceUndefined(modalID, '#modal-delete-wrapper');
        modalID = MainApp.common.replaceUndefined(modalID, '#modal-delete');

        $(wrapperID).on('click', triggererID, function (e) {
            e.preventDefault();
            var $elem = $(this);
            MainApp.ajax.send({_method: 'delete', id: $elem.attr('data-id')}, undefined, $elem.attr('data-url'), 'POST', 'json', function () {
                $(modalID).modal('hide');
                handle();
            });
        });
    }
};

MainApp.dropzone = {
    defaultFiles: 'application/pdf, .docx, .doc',
    defaultSize: 5,
    config: function ($elem) {
        return {
            url: $elem.attr('data-url'),
            paramName: $elem.attr('data-name'),
            headers: MainApp.ajax.header,
            maxFilesize: this.defaultSize,
            addRemoveLinks: true,
            acceptedFiles: this.defaultFiles,
            init: function () {
                this.on('success', function (file, response) {
                    file.realName = response.name;
                    var fileNameInput = '<input type="hidden" value="' + response.name + '" name="' + response.inputName + '">';
                    var fileSizeInput = '<input type="hidden" value="' + response.size + '" name="' + 'size_' + response.inputName + '">';
                    $(file.previewElement).append(fileNameInput + fileSizeInput);
                });
                /*this.on("complete", function (file) {
                 if(file.status == 'success')
                 MainApp.modal.dialog("Success","File added")
                 else
                 MainApp.modal.dialog("Error","Upload fail")
                 });*/
                this.on('removedfile', function (file) {
                    MainApp.ajax.send({name: file.realName}, undefined, $elem.attr('data-url'));
                });
            }
        };
    }
};

MainApp.toast = {
    success: function (html) {
        toastr.options = this.config;
        toastr.success(html);
    },
    error: function (html) {
        toastr.options = this.config;
        toastr.error(html);
    },
    config: {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "500",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
};

MainApp.view = {};