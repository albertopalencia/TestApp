(function ($) {
    function InicializarValidacionesIGAC(forma) {
        forma.validate({
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
    }

    function validarFormaIGAC(t) {
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

    var datosConfiguracion = null;
    var combosCargados = false;
    var modalIGAC = modalIGAC ||
        $('<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-m" style="width:95%;"><form id="formDireccion"><div class="modal-content"><div class="modal-header"><h3 style="margin:0;">Dirección</h3></div><div class="modal-body"><div class="row"><div class="col-xs-12"><label id="lblDireccion"></label></div></div><div class="row">' +
        '<div class="col-xs-12"><table style="width:100%; border-spacing: 4px; border-collapse: separate;"><tr>' +
        '<td style="width:9%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Tipo Vía:</label><select style="width:100%" id="ddlTipoVia" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option></select></div></div></td>' +
        '<td style="width:8%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Nro. Vía Ppal:</label><input type="text" style="width:100%" id="txtViaPrincipal" grupovalidacion="direccionigac" class="form-control input-sm" /></div></div></td>' +
        '<td style="width:5%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Letra Vía Ppal:</label><select style="width:100%" id="ddlLetraViaPrincipal" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option></select></div></div></td>' +
        '<td style="width:5%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Bis:</label><select style="width:100%" id="ddlPrefijoBis" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option><option value="BIS">Bis</option></select></div></div></td>' +
        '<td style="width:6%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Cuadrante:</label><select style="width:100%" id="ddlCuadrante1" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option></select></div></div></td>' +
        '<td style="width:6%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Nro. Vía Gene:</label><input type="text" style="width:100%" id="txtNumeroVia" grupovalidacion="direccionigac" class="form-control input-sm" /></div></div></td>' +
        '<td style="width:6%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Letra Vía Gene:</label><select style="width:100%" id="ddlLetraViaGeneradora" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option></select></div></div></td>' +
        '<td style="width:5%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Bis:</label><select style="width:100%" id="ddlSufijoBis" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option><option value="BIS">Bis</option></select></div></div></td>' +
        '<td style="width:8%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Nro. Placa:</label><input type="text" style="width:100%" id="txtNumeroPlaca" grupovalidacion="direccionigac" class="form-control input-sm" /></div></div></td>' +
        '<td style="width:6%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Cuadrante:</label><select style="width:100%" id="ddlCuadrante2" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option></select></div></div></td>' +
        '<td style="width:7%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Manzana:</label><select style="width:100%" id="ddlManzana" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option></select></div></div></td>' +
        '<td style="width:8%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Nro. Manzana:</label><input type="text" style="width:100%" id="txtNumeroManzana" grupovalidacion="direccionigac" class="form-control input-sm" /></div></div></td>' +
        '<td style="width:12%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Tipo Predio:</label><select style="width:100%" id="ddlTipoPredio" grupovalidacion="direccionigac" class="form-control input-sm"><option value=""> </option></select></div></div></td>' +
        '<td style="width:9%"><div class="row"><div class="col-xs-12"><label style="font-size:9px !important;">Nro. Predio:</label><input type="text" style="width:100%" id="txtNumeroComplemento" grupovalidacion="direccionigac" class="form-control input-sm" /></div></div></td>' +
        '</tr></table></div></div></div><div class="modal-footer"><button type="button" class="btn btn-sm" data-dismiss="modal"><i class=" ace-icon fa fa-times"></i>Cerrar</button>' +
        '<button type="button" class="btn btn-sm btn-primary" id="btnAceptar" grupovalidacion="direccionigac"><i class="ace-icon fa fa-check"></i><span class="bigger-110">Aceptar</span></button></div></div></form></div></div>');

    $(document).ready(function () {
        InicializarValidacionesIGAC(modalIGAC.find("#formDireccion"));
        $.ajax({
            url: '/Service/ServiceIGAC.svc/ObtenerDatosConfiguracion',
            type: 'POST',
            async: true,
            cache: false
        }).success(function (data) {
            datosConfiguracion = data;
        }).error(function (xhr, status) {
            alert(xhr.responseText);
        });
    });

    var ddlTipoVia = modalIGAC.find('#ddlTipoVia');
    var txtViaPrincipal = modalIGAC.find('#txtViaPrincipal');
    var ddlLetraViaPrincipal = modalIGAC.find('#ddlLetraViaPrincipal');
    var ddlPrefijoBis = modalIGAC.find('#ddlPrefijoBis');
    var ddlCuadrante1 = modalIGAC.find('#ddlCuadrante1');
    var txtNumeroVia = modalIGAC.find('#txtNumeroVia');
    var ddlLetraViaGeneradora = modalIGAC.find('#ddlLetraViaGeneradora');
    var ddlSufijoBis = modalIGAC.find('#ddlSufijoBis');
    var txtNumeroPlaca = modalIGAC.find('#txtNumeroPlaca');
    var ddlCuadrante2 = modalIGAC.find('#ddlCuadrante2');
    var ddlManzana = modalIGAC.find('#ddlManzana');
    var txtNumeroManzana = modalIGAC.find('#txtNumeroManzana');
    var ddlTipoPredio = modalIGAC.find('#ddlTipoPredio');
    var txtNumeroComplemento = modalIGAC.find('#txtNumeroComplemento');

    var xmlValidaciones = null;

    modalIGAC.find('select').on("change", function () {
        validacionesIGAC($(this));
    });

    modalIGAC.find('input').on("change", function () {
        validacionesIGAC($(this));
    });

    function validacionesIGAC(control) {
        var valorSeleccion = control.val();
        var idControl = control.attr('id');

        xmlValidaciones.find("validacion[id='" + idControl + "']").each(function () {
            $(this).find("control").each(function () {
                modalIGAC.find('#' + $(this).attr('id')).removeClass("required");
            });
        });

        if (valorSeleccion != null && valorSeleccion.length > 0) {
            xmlValidaciones.find("validacion[id='" + idControl + "']").each(function () {
                operacion = $(this).attr('operacion');
                valor = $(this).attr('valor');
                switch (operacion) {
                    case "igual":
                        if (valor == valorSeleccion) {
                            $(this).find("control").each(function () {
                                modalIGAC.find('#' + $(this).attr('id')).addClass("required");
                            });
                        }
                        break;
                    case "diferente":
                        if (valor != valorSeleccion) {
                            $(this).find("control").each(function () {
                                modalIGAC.find('#' + $(this).attr('id')).addClass("required");
                            });
                        }
                        break;
                }
            });
        }
    }

    modalIGAC.find("#btnAceptar").on("click", function () {
        if (validarFormaIGAC(modalIGAC.find("#btnAceptar"))) {
            $(this).data("codigoIGAC").aceptar();
            modalIGAC.modal("hide");
        }
    });

    var CodigoIGAC = function (element, campooculto, campomostrar) {
        this.element = $(element);
        this.campooculto = campooculto;
        this.campomostrar = campomostrar;
        this.element.on("click", function () {
            modalIGAC.find("#btnAceptar").data("codigoIGAC", $(this).data("codigoIGAC"));
            $(this).data("codigoIGAC").show();
        });
        this.element.keypress(function (event) {
            event.preventDefault();
        });
    }

    CodigoIGAC.prototype = {
        constructor: CodigoIGAC,
        aceptar: function () {
            var direccion = "";

            if (ddlTipoVia.val() != null && ddlTipoVia.val().length > 0) {
                direccion = ddlTipoVia.val() + " ";
            }

            if (txtViaPrincipal.val() != null && txtViaPrincipal.val().length > 0) {
                direccion = direccion + txtViaPrincipal.val() + " ";
            }

            if (ddlLetraViaPrincipal.val() != null && ddlLetraViaPrincipal.val().length > 0) {
                direccion = direccion + ddlLetraViaPrincipal.val() + " ";
            }

            if (ddlPrefijoBis.val() != null && ddlPrefijoBis.val().length > 0) {
                direccion = direccion + ddlPrefijoBis.val() + " ";
            }

            if (ddlCuadrante1.val() != null && ddlCuadrante1.val().length > 0) {
                direccion = direccion + ddlCuadrante1.val() + " ";
            }

            if (txtNumeroVia.val() != null && txtNumeroVia.val().length > 0) {
                direccion = direccion + txtNumeroVia.val() + " ";
            }

            if (ddlLetraViaGeneradora.val() != null && ddlLetraViaGeneradora.val().length > 0) {
                direccion = direccion + ddlLetraViaGeneradora.val() + " ";
            }

            if (ddlSufijoBis.val() != null && ddlSufijoBis.val().length > 0) {
                direccion = direccion + ddlSufijoBis.val() + " ";
            }

            if (txtNumeroPlaca.val() != null && txtNumeroPlaca.val().length > 0) {
                direccion = direccion + txtNumeroPlaca.val() + " ";
            }

            if (ddlCuadrante2.val() != null && ddlCuadrante2.val().length > 0) {
                direccion = direccion + ddlCuadrante2.val() + " ";
            }

            if (ddlManzana.val() != null && ddlManzana.val().length > 0) {
                direccion = direccion + ddlManzana.val() + " ";
            }

            if (txtNumeroManzana.val() != null && txtNumeroManzana.val().length > 0) {
                direccion = direccion + txtNumeroManzana.val() + " ";
            }

            if (ddlTipoPredio.val() != null && ddlTipoPredio.val().length > 0) {
                direccion = direccion + ddlTipoPredio.val() + " ";
            }

            if (txtNumeroComplemento.val() != null && txtNumeroComplemento.val().length > 0) {
                direccion = direccion + txtNumeroComplemento.val() + " ";
            }

            this.element.val(direccion.toUpperCase().trim());

            if (this.campooculto !== undefined) {
                $(this.campooculto).val((ddlTipoVia.val() + "$" + txtViaPrincipal.val() + "$" + ddlLetraViaPrincipal.val() + "$" + ddlPrefijoBis.val() + "$" + ddlCuadrante1.val() +
                                 "$" + txtNumeroVia.val() + "$" + ddlLetraViaGeneradora.val() + "$" + ddlSufijoBis.val() + "$" + txtNumeroPlaca.val() + "$" + ddlCuadrante2.val() +
                                 "$" + ddlManzana.val() + "$" + txtNumeroManzana.val() + "$" + ddlTipoPredio.val() + "$" + txtNumeroComplemento.val()).toUpperCase());
            }
        },
        show: function () {
            if (!combosCargados) {
                if (datosConfiguracion != null) {
                    xmlValidaciones = $($.parseXML(datosConfiguracion.XmlValidaciones));

                    var pos = "A".charCodeAt(0);
                    var posFinal = "Z".charCodeAt(0);

                    for (; pos <= posFinal; pos++) {
                        ddlLetraViaPrincipal.append($('<option>', {
                            value: String.fromCharCode(pos),
                            text: String.fromCharCode(pos)
                        }));

                        ddlLetraViaGeneradora.append($('<option>', {
                            value: String.fromCharCode(pos),
                            text: String.fromCharCode(pos)
                        }));
                    }

                    $.each(datosConfiguracion.TipoVia, function (i, item) {
                        ddlTipoVia.append($('<option>', {
                            value: item.Valor,
                            text: item.Descripcion
                        }));
                    });

                    $.each(datosConfiguracion.Cuadrante, function (i, item) {
                        ddlCuadrante1.append($('<option>', {
                            value: item.Valor,
                            text: item.Descripcion
                        }));

                        ddlCuadrante2.append($('<option>', {
                            value: item.Valor,
                            text: item.Descripcion
                        }));
                    });

                    $.each(datosConfiguracion.Manzana, function (i, item) {
                        ddlManzana.append($('<option>', {
                            value: item.Valor,
                            text: item.Descripcion
                        }));
                    });

                    $.each(datosConfiguracion.TipoPredio, function (i, item) {
                        ddlTipoPredio.append($('<option>', {
                            value: item.Valor,
                            text: item.Descripcion
                        }));
                    });

                    combosCargados = true;
                }
            }

            if (combosCargados) {
                modalIGAC.modal();

                ddlTipoVia.find('option').removeAttr("selected");
                txtViaPrincipal.val("");
                ddlLetraViaPrincipal.find('option').removeAttr("selected");
                ddlPrefijoBis.find('option').removeAttr("selected");
                ddlCuadrante1.find('option').removeAttr("selected");
                txtNumeroVia.val("");
                ddlLetraViaGeneradora.find('option').removeAttr("selected");
                ddlSufijoBis.find('option').removeAttr("selected");
                txtNumeroPlaca.val("");
                ddlCuadrante2.find('option').removeAttr("selected");
                ddlManzana.find('option').removeAttr("selected");
                txtNumeroManzana.val("");
                ddlTipoPredio.find('option').removeAttr("selected");
                txtNumeroComplemento.val("");

                if (this.campomostrar !== undefined) {
                    modalIGAC.find('#lblDireccion').text("Dirección: " + $(this.campomostrar).val());
                }

                if (this.campooculto !== undefined) {
                    var direccionFULL = $(this.campooculto).val();
                    var arrayIGAC = direccionFULL.split("$");
                    if (arrayIGAC.length == 14) {
                        ddlTipoVia.val(arrayIGAC[0]);
                        txtViaPrincipal.val(arrayIGAC[1]);
                        ddlLetraViaPrincipal.val(arrayIGAC[2]);
                        ddlPrefijoBis.val(arrayIGAC[3]);
                        ddlCuadrante1.val(arrayIGAC[4]);
                        txtNumeroVia.val(arrayIGAC[5]);
                        ddlLetraViaGeneradora.val(arrayIGAC[6]);
                        ddlSufijoBis.val(arrayIGAC[7]);
                        txtNumeroPlaca.val(arrayIGAC[8]);
                        ddlCuadrante2.val(arrayIGAC[9]);
                        ddlManzana.val(arrayIGAC[10]);
                        txtNumeroManzana.val(arrayIGAC[11]);
                        ddlTipoPredio.val(arrayIGAC[12]);
                        txtNumeroComplemento.val(arrayIGAC[13]);
                        modalIGAC.find('select').change();
                        modalIGAC.find('input').change();
                        return;
                    }
                }

                ddlTipoVia.find('option:first').attr("selected", "selected");
                ddlLetraViaPrincipal.find('option:first').attr("selected", "selected");
                ddlPrefijoBis.find('option:first').attr("selected", "selected");
                ddlCuadrante1.find('option:first').attr("selected", "selected");
                ddlLetraViaGeneradora.find('option:first').attr("selected", "selected");
                ddlSufijoBis.find('option:first').attr("selected", "selected");
                ddlCuadrante2.find('option:first').attr("selected", "selected");
                ddlManzana.find('option:first').attr("selected", "selected");
                ddlTipoPredio.find('option:first').attr("selected", "selected");
                modalIGAC.find('select').change();
                modalIGAC.find('input').change();
            }
        }
    }

    $.fn.codigoIGAC = function (campooculto, campomostrar) {
        this.each(function () {
            var $this = $(this);
            var data = $this.data('codigoIGAC');
            if (!data) {
                $this.data('codigoIGAC', new CodigoIGAC(this, campooculto, campomostrar));
            }
        });
        return this;
    };
})(jQuery);