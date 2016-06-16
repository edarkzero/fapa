Dropzone.autoDiscover = false;

$(document).ready(function () {
    var $elem = $('#custom-dropzone');
    var config = MainApp.dropzone.config($elem);
    config.maxFiles = 1;
    $elem.dropzone(config);
});