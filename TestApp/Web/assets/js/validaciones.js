function InicializarValidaciones(idForma) {
    $("#" + idForma).validate({
        onsubmit: false,
        showErrors: function (map, list) {
            $.each(this.validElements(), function (index, element) {
                var element = $(element);
                if (element.parent().hasClass('has-error')) {
                    element.tooltip("destroy");
                    element.removeClass('tooltip-error').attr("title", "").parent().removeClass('has-error');
                    if (!element.hasClass('date-picker') && !element.hasClass('date-timepicker')) {
                        element.parent().find("i").removeClass("ace-icon fa fa-times-circle red");
                    }
                }
            });

            $.each(list, function (index, error) {
                var element = $(error.element);
                if (!element.parent().hasClass('has-error')) {
                    if (!element.hasClass('date-picker') && !element.hasClass('date-timepicker') && !element.is('select') && !element.is(':file')) {
                        var span;
                        if (!element.parent().is("span")) {
                            span = $("<span>").appendTo(element.parent());
                            span.addClass("block input-icon input-icon-right");
                            element.appendTo(span);
                        } else {
                            span = element.parent();
                        }
                        span.addClass('has-error');
                        if (span.find("i").length > 0) {
                            span.find("i").addClass("ace-icon fa fa-times-circle red");
                        } else {
                            $("<i>").appendTo(span).addClass("ace-icon fa fa-times-circle red");
                        }
                    } else {
                        element.parent().addClass('has-error');
                    }
                    if (!element.is('select')) {
                        element.addClass('tooltip-error').attr("title", error.message).tooltip();
                    }
                } else {
                    if (!element.is('select')) {
                        element.tooltip("destroy");
                        element.attr("title", error.message).tooltip();
                    }
                }
            });
        }
    });

    $(':submit[grupovalidacion], a[grupovalidacion]').unbind("click");
    $(':submit[grupovalidacion], a[grupovalidacion]').click(function (e) {
        if (!validarForma($(this))) {
            e.preventDefault();
            return false;
        }
    });
}

function validarForma(t) {
    var isValid = true;
    if (t.is(":submit, :button, a")) {
        var grupo = t.attr("grupovalidacion");
        $("[grupovalidacion=" + grupo + "]").not(":submit, :button, a").each(function (i, item) {
            if (!$(item).valid())
                isValid = false;
        });
    }
    return isValid;
}