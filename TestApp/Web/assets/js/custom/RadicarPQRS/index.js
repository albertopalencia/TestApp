var checkedIds = new Array();
var archivos = new Array();
function selectRow() {
    var checked = this.checked,
    row = $(this).closest("tr"),
    grid = $("#grillaArchivos").data("kendoGrid"),
    dataItem = grid.dataItem(row);
    checkedIds[dataItem.IdArchivo] = checked;
}

(function ($) {

    var namespace;

    namespace = {
        Inicio: function () {

            if (window.jQuery) {
                $(document).ready(function () {
                    radicado.Inicializar();
                });
            } else {
                window.onload = function () {
                    radicado.Inicializar();
                }
            }
        },

        Inicializar: function () {

            utilidades.CargueInicial();
            utilidades.validarForm('#form0');
            utilidades.iniciarValidacion();

            $('.email').keyup(function (e) {
                $(this).validarEmail();
            });

            $('#btnLimpiar').click(function (e) {
                utilidades.RemoverValidador();
                utilidades.LimpiarControles('.divMain');
            });

            $("#ParmTipoRadi").change(function () {
                radicado.CargarDetallesTipoRadicacion();
            });

            //Posición

            $("#ParmTipoRadi").change(function () {
                var valorTipo = $(this).val().toString();
                if (valorTipo == '15' || valorTipo == '16') {
                    $("#dvPosicion").show();
                    $("#dvposicionTipoSolicitud").hide();
                    $("#TiprCodigo").removeClass("required");

                    $("#ServicioOperativo").addClass("required");
                    $("#ConceptoOperativo").addClass("required");
                    $("#CordinadorOperativo").addClass("required");
                    $("#Microruta").addClass("required");
                    $("#Latitud").addClass("required");
                    $("#Longitud").addClass("required");
                    $("#DireccionServicio").addClass("required");

                } else {                                        
                    $("#ServicioOperativo").removeClass("required");
                    $("#ConceptoOperativo").removeClass("required");
                    $("#CordinadorOperativo").removeClass("required");
                    $("#Microruta").removeClass("required");
                    $("#Latitud").removeClass("required");
                    $("#Longitud").removeClass("required");
                    $("#DireccionServicio").removeClass("required");

                    $("#dvPosicion").hide();
                    $("#dvposicionTipoSolicitud").show();
                    $("#TiprCodigo").addClass("required");
                    
                }
            });

            //Unidad residencial            

            $("#ddlTipoRadicacionBusqueda").change(function () {
                radicado.CargarDetallesTipoRadicacionBusqueda();
            });

            $("#ParmEstado").on("click", function () {
                radicado.ValidarTipoRadicado();
            });

            radicado.ValidarTipoRadicado();

            $("#btnActualizarRadicado").on("click", function () {               
                var action = $(this).attr('name');
                if (utilidades.validar($(this))) {
                    for (var i = 0; i < archivos.length; i++) {
                        if (checkedIds[archivos[i].IdArchivo]) {
                            archivos[i].Enviado = 'S';
                        } else {
                            archivos[i].Enviado = 'N';
                        }
                    }
                    bootbox.dialog({
                        title: 'Actualización de datos',
                        message: 'Se van a actualizar los datos. ¿Desea continuar? ',
                        buttons: {
                            cerrar: {
                                icon: "ace-icon fa fa-times",
                                label: "Cerrar",
                                className: "btn-default"
                            },
                            aceptar: {
                                icon: "ace-icon fa fa-floppy-o",
                                label: "Aceptar",
                                className: "btn-primary",
                                callback: function () {
                                    radicado.ActualizarRadicado('ActualizarRadicado');
                                }
                            }
                        }
                    });
                }
            });

            $("#btnTerminarRadicado").on("click", function () {
                var action = $(this).attr('name');
                if (utilidades.validar($(this))) {
                    for (var i = 0; i < archivos.length; i++) {
                        if (checkedIds[archivos[i].IdArchivo]) {
                            archivos[i].Enviado = 'S';
                        } else {
                            archivos[i].Enviado = 'N';
                        }
                    }
                    radicado.ValidarCambioEstadoDefinitivo();
                }
            });

            $('#btnConsultarRadicados').click(function (e) {
                if (utilidades.validar($('#btnConsultarRadicados'))) {
                    $('#divDatosRadicado').addClass('hidden');
                    $('#divGrillaBusqueda').removeClass('hidden');
                    var grid = $("#gridRadicados").data("kendoGrid");
                    grid.dataSource.page(1);
                }
            });

            $('#form0').on('submit', function () {
                $('#divProgress').show();
            });

            $('#DepartamentoNotificacion').change(function (e) {
                var data = { codigoDivision: $("#DepartamentoNotificacion").val() };
                var actionUrl = baseRadicadoURL + '/' + 'ConsultarMunicipios';
                utilidades.CargarComboAjax(actionUrl, '#MunicipioNotificacion', data);
            });

            $('#DepartamentoDocumento').change(function (e) {
                var data = { codigoDivision: $("#DepartamentoDocumento").val() };
                var actionUrl = baseRadicadoURL + '/' + 'ConsultarMunicipios';
                utilidades.CargarComboAjax(actionUrl, '#MunicipioDocumento', data);
            });
                        
            //DDL cascada 
            $("#ServicioOperativo").change(function () {                
                EliminarItems("ConceptoOperativo");
                EliminarItems("CordinadorOperativo");
                EliminarItems("Microruta");
                if ($(this).val() != "") {
                    var data = { codigoServicioOperativo: $(this).val(), TipoRadicacion: $("#ParmTipoRadi").val() };
                    var actionUrl = baseRadicadoURL + '/' + 'ObtenerConceptos';
                    utilidades.CargarComboAjaxSeleccione(actionUrl, '#ConceptoOperativo', data);
                }
            });
            
            $("#ConceptoOperativo").change(function () {

                EliminarItems("CordinadorOperativo");
                EliminarItems("Microruta");
                if ($(this).val() != "") {
                    var data = { codigoConceptoOperativo: $(this).val() };
                    var actionUrl = baseRadicadoURL + '/' + 'ObtenerCoordinadores';
                    utilidades.CargarComboAjaxSeleccione(actionUrl, '#CordinadorOperativo', data);
                }
            });

            $("#CordinadorOperativo").change(function () {

                EliminarItems("Microruta");
                if ($(this).val()) {
                    var data = { codigoCordinadorOperativo: $(this).val() };
                    var actionUrl = baseRadicadoURL + '/' + 'ObtenerMicroRuta';
                    utilidades.CargarComboAjaxSeleccione(actionUrl, '#Microruta', data);
                }
            });



            //FIN DDL cascada


            $('#TiprCodigo').change(function (e) {
                if (!neiva) {
                    var id = $("#TiprCodigo").val();
                    var parametro = { idTipoRadicacion: id };
                    $("#txtDocumentosAdjuntar").val("");
                    $.ajax({
                        url: '/Inicio/ObtenerTipoRadicacionPorId',
                        data: parametro,
                        type: 'POST',
                        async: true,
                        cache: false
                    }).success(function (data) {
                        if (data != null) {
                            $("#txtDocumentosAdjuntar").val(data.DocAjuntar);
                        }
                    }).error(function (xhr, status) {
                        alert(xhr.responseText);
                    });
                    $(".rowNuevoMedidor").hide();
                    $(".rowNuevoDireccion").hide();
                    $(".rowNuevoNombre").hide();
                    $(".rowNuevoEstrato").hide();
                    $(".rowNuevoClasesUso").hide();
                    $("#NuevoMedidor").val("");
                    $("#NuevoNombreSuscriptor").val("");
                    $("#NuevaDireccion").val("");
                    $('#IdNuevoEstrato').select2('val', "");
                    $('#CodigoNuevaClaseUso').select2('val', "");
                    utilidades.EliminarAgregarRequired('.rowNuevoMedidor', false);
                    utilidades.EliminarAgregarRequired('.rowNuevoDireccion', false);
                    utilidades.EliminarAgregarRequired('.rowNuevoNombre', false);
                    utilidades.EliminarAgregarRequired('.rowNuevoEstrato', false);
                    utilidades.EliminarAgregarRequired('.rowNuevoClasesUso', false);

                    if (id == "81" || id == "128") {
                        $(".rowNuevoMedidor").show();
                        utilidades.EliminarAgregarRequired('.rowNuevoMedidor', true);
                    } else {
                        if (id == "80" || id == "127") {
                            $(".rowNuevoNombre").show();
                            utilidades.EliminarAgregarRequired('.rowNuevoNombre', true);
                        } else {
                            if (id == "5" || id == "129") {
                                $(".rowNuevoDireccion").show();
                                utilidades.EliminarAgregarRequired('.rowNuevoDireccion', true);
                            } else {
                                if (id == "93" || id == "126" || id == "124" || id == "100") {
                                    $(".rowNuevoEstrato").show();
                                    utilidades.EliminarAgregarRequired('.rowNuevoEstrato', true);
                                } else {
                                    if (id == "57" || id == "85") {
                                        $(".rowNuevoClasesUso").show();
                                        utilidades.EliminarAgregarRequired('.rowNuevoClasesUso', true);
                                    }
                                }
                            }
                        }
                    }
                } else {

                    var id = $("#TiprCodigo").val();
                    var parametro = { idTipoRadicacion: id };
                    $(".rowNuevoEstrato").hide();
                    $(".rowDatosPagoAnterior").hide();
                    //$('#IdNuevoEstrato').select2('val', "");
                    //$("#Banco").val("");
                    //$("#NumeroFactura").val("");
                    //$("#FechaPago").val("");
                    //$("#ValorPago").val("");
                    utilidades.EliminarAgregarRequired('.rowNuevoEstrato', false);
                    utilidades.EliminarAgregarRequired('.rowDatosPagoAnterior', false);

                    //Contenedores 

                    utilidades.EliminarAgregarRequired('#dvUnidadesresidenciales', false);
                    utilidades.EliminarAgregarRequired('#dvActualizarDireccion', false);
                    utilidades.EliminarAgregarRequired('#dvActualizarDireccion', false);
                    utilidades.EliminarAgregarRequired('#dvSolicitudMultiusuario', false);
                    utilidades.EliminarAgregarRequired('#dvPagoAnterior', false);



                    if (id == "11") {
                        $(".rowNuevoEstrato").show();
                        utilidades.EliminarAgregarRequired('.rowNuevoEstrato', true);
                    }

                    //if (id == "154") {
                    //    $(".rowDatosPagoAnterior").show();
                    //    utilidades.EliminarAgregarRequired('.rowDatosPagoAnterior', true);
                    //}

                    //Mostrar o ocultar descuento por predio sin visita 
                    if (id == "630") {
                        $("#dvUnidadesresidenciales").show();
                        utilidades.EliminarAgregarRequired('#dvUnidadesresidenciales', true);
                        ValidarIndicadorPredioDesocupado();


                    } else {
                        $("#dvUnidadesresidenciales").hide();
                    }

                    //Mostrar o ocultar actualización de datos
                    if (id == "631") {
                        $("#dvActualizarDireccion").show();
                        utilidades.EliminarAgregarRequired('#dvActualizarDireccion', true);
                    } else {
                        $("#dvActualizarDireccion").hide();
                    }
                    
                    //Mostrar o ocultar Multiusuario
                    if (id == "22") {
                        $("#dvSolicitudMultiusuario").show();
                        utilidades.EliminarAgregarRequired('#dvSolicitudMultiusuario', true);
                    } else {
                        $("#dvSolicitudMultiusuario").hide();
                    }

                    //Mostrar o ocultar reclamo no aplica pago anterior
                    if (id == "154") {
                        $("#dvPagoAnterior").show();
                        utilidades.EliminarAgregarRequired('#dvPagoAnterior', true);
                    } else {
                        $("#dvPagoAnterior").hide();
                    }
                }
            });

            $('#btnCerrarRadicado').click(function (e) {
                $('#divDatosRadicado').addClass('hidden');
            });
        },

        CargarDetallesTipoRadicacion: function () {
            var data = { idTipoPqrs: $("#ParmTipoRadi").val() };
            var actionUrl = baseRadicadoURL + '/' + 'ConsultarDetallesTiposRadicacion';
            utilidades.CargarComboAjax(actionUrl, '#TiprCodigo', data);
        },

        CargarDetallesTipoRadicacionBusqueda: function () {
            var data = { idTipoPqrs: $("#ddlTipoRadicacionBusqueda").val() };
            var actionUrl = baseRadicadoURL + '/' + 'ConsultarDetallesTiposRadicacion';
            utilidades.CargarComboAjax(actionUrl, '#ddlTipoSolicitudBusqueda', data);
        },

        DesHabilidar: function (entidad, entidadNombre, contenedor, estado) {
            if (contenedor == undefined) {
                contenedor = '';
            }

            $.each(entidad, function (name, value) {
                var valorControl;
                var control;

                if (entidadNombre != '' &&
					contenedor != '') {
                    control = $(contenedor).find(entidadNombre + '_' + name);
                }
                else if (entidadNombre != '' &&
						contenedor == '') {
                    control = $(entidadNombre + '_' + name);
                }
                else if (entidadNombre == '' &&
						contenedor != '') {
                    control = $(contenedor).find('#' + name);
                }
                else {
                    control = $('#' + name);
                }

                if (control != undefined) {
                    if (control.attr('id') != undefined) {
                        $(control).prop("disabled", estado);
                    }
                }
            });

        },

        SeleccionarRadicado: function (e, improcedente) {
            e.preventDefault();

            var tr = $(e.target).closest("tr");
            var dataItem = $("#gridRadicados").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));

            var data = { id: dataItem.id };
            var actionUrl = baseRadicadoURL + '/' + 'ConsultarRadicado';
            var resul;

            utilidades.LimpiarControles('#divDatosRadicado');
            resul = utilidades.FuncionAjaxAction(actionUrl, data);
            archivos = utilidades.FuncionAjaxAction(baseRadicadoURL + '/ConsultarArchivosRadicado', data);
            utilidades.CargarValores(resul, '', '#divDatosRadicado');
            utilidades.CargarValores(resul, '', '#divCodigosEstados');

            $('#DepartamentoNotificacion').change();
            $('#MunicipioNotificacion').select2('val', resul.MunicipioNotificacion);
            $('#DepartamentoDocumento').change();
            $('#MunicipioDocumento').select2('val', resul.MunicipioDocumento);
            $('#AtncHora').val(utilidades.FormatoHora(resul.AtncHora));

            $("#ParmTipoRadi").change();
            $('#ServicioOperativo').select2('val', resul.ServicioOperativo);
            $("#ServicioOperativo").change();
            $('#ConceptoOperativo').select2('val', resul.ConceptoOperativo);
            $("#ConceptoOperativo").change();
            $('#CordinadorOperativo').select2('val', resul.CordinadorOperativo);
            $("#CordinadorOperativo").change();
            $('#Microruta').select2('val', resul.Microruta);

            $('#TiprCodigo').select2('val', resul.TiprCodigo);
            $('#divDatosRadicado').removeClass('hidden');
            $('#divDatosRadicado').focus().scrollToControl();
            $(".k-upload-files.k-reset").find("li").remove();

            $(".rowNuevoMedidor").hide();
            $(".rowNuevoDireccion").hide();
            $(".rowNuevoNombre").hide();
            $(".rowNuevoEstrato").hide();
            $(".rowNuevoClasesUso").hide();

            $("#hdnAtncDireccionEditada").val("");
            $("#hdnDireccionCorrespondenciaEditada").val("");
            $("#hdnNuevaDireccionEditada").val("");

            var id = $("#TiprCodigo").val();

            if (!neiva) {
                if (id == "81" || id == "128") {
                    $(".rowNuevoMedidor").show();
                    utilidades.EliminarAgregarRequired('.rowNuevoMedidor', true);
                } else {
                    if (id == "80" || id == "127") {
                        $(".rowNuevoNombre").show();
                        utilidades.EliminarAgregarRequired('.rowNuevoNombre', true);
                    } else {
                        if (id == "5" || id == "129") {
                            $(".rowNuevoDireccion").show();
                            utilidades.EliminarAgregarRequired('.rowNuevoDireccion', true);
                        } else {
                            if (id == "93" || id == "126" || id == "124" || id == "100") {
                                $(".rowNuevoEstrato").show();
                                utilidades.EliminarAgregarRequired('.rowNuevoEstrato', true);
                            } else {
                                if (id == "57" || id == "85") {
                                    $(".rowNuevoClasesUso").show();
                                    utilidades.EliminarAgregarRequired('.rowNuevoClasesUso', true);
                                }
                            }
                        }
                    }
                }
            }
            else {

                $('#TiprCodigo').change();
                if (id == "11") {
                    $(".rowNuevoEstrato").show();
                    utilidades.EliminarAgregarRequired('.rowNuevoEstrato', true);
                }

                if (id == "154") {
                    $(".rowDatosPagoAnterior").show();
                    utilidades.EliminarAgregarRequired('.rowDatosPagoAnterior', true);
                }
            }

            radicado.ValidarTipoRadicado();
            if ($("#ParmEstado").val() == $("#CodigoEstadoRadicacioRadicada").val()) {
                $('#btnTerminarRadicado').hide();
                $('#btnActualizarRadicado').hide();
                radicado.DesHabilidar(resul, '', '#divDatosRadicado', true);
                radicado.DesHabilidar(resul, '', '#divCodigosEstados', true);
            } else {
                if (neiva) {
                    radicado.DesHabilidar(resul, '', '#divDatosRadicado', false);
                    radicado.DesHabilidar(resul, '', '#divCodigosEstados', false);
                    $("#SecuenciaRadicacion").prop("disabled", false);
                    $("#ParmEstado").prop("disabled", false);
                    $("#AtncRespuesta").prop("disabled", false);
                } else {
                    radicado.DesHabilidar(resul, '', '#divDatosRadicado', false);
                    radicado.DesHabilidar(resul, '', '#divCodigosEstados', false);
                    $("#AtncFecha").prop("disabled", true);
                    $("#AtncHora").prop("disabled", true);
                    $("#DireccionCorrespondencia").prop("disabled", true);
                    $("#AtncDireccion").prop("disabled", true);
                    $("#NuevaDireccion").prop("disabled", true);
                }
            }

            checkedIds = new Array();

            if (archivos != null && archivos.length > 0) {

                for (var ii = 0; ii < archivos.length; ii++) {
                    checkedIds[archivos[ii].IdArchivo] = archivos[ii].Enviado == "S";
                }
                $("#divGrillaArchivos").show();
                $("#grillaArchivos").kendoGrid({
                    dataSource: {
                        data: archivos
                    },
                    sortable: false,
                    scrollable: true,
                    columns: [{
                        field: "Nombre",
                        title: "Nombre Archivo",
                        attributes: {
                            style: "font-size: 12px"
                        },
                        template: function (dataItem) {
                            return '<a href="' + baseDescargarArchivo + '?idArchivo=' + dataItem.IdArchivo + '">' + dataItem.Nombre + '</a>';
                        }
                    }, {
                        title: "Adjuntar",
                        template: "<input type='checkbox' class='checkboxSeleccion' # if(Enviado=='S') { #checked='checked'#}# />"
                    }, {
                        title: "Actividad",
                        template: "# if(TipoArchivo==1) { # Radicado #}else{# Improcedente #}#"
                    }]
                }).data("kendoGrid").table.on("click", ".checkboxSeleccion", selectRow);
            } else {
                $("#divGrillaArchivos").hide();
            }

            if (improcedente !== undefined && improcedente == true) {
                radicado.DesHabilidar(resul, '', '#divDatosRadicado', true);
                radicado.DesHabilidar(resul, '', '#divCodigosEstados', true);
            }
        },

        SeleccionarRadicadoImprocedente: function (e) {
            radicado.SeleccionarRadicado(e, true);
        },

        SeleccionarRadicadoSeguimiento: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            var data = { id: dataItem.id };
            var actionUrl = baseSeguimientoURL + '/' + 'ConsultarRadicado';
            var resul;

            resul = utilidades.FuncionAjaxAction(actionUrl, data);
            $('#txtRespuestaPqrs').val(resul.AtncRespuesta);
            $('#modalRespuestaPqrs').modal('show');
        },

        ValidarTipoRadicado: function (e) {
            if ($("#ParmEstado").val() == $("#CodigoEstadoRadicacionImprocedente").val()) {
                $("#divRespuesta").removeClass('hidden');
                utilidades.EliminarAgregarRequired('#divRespuesta', true);
            }
            else {
                $("#divRespuesta").addClass('hidden');
                utilidades.EliminarAgregarRequired('#divRespuesta', false);
            }

            if ($("#ParmEstado").val() == $("#CodigoEstadoRadicacioRadicada").val()) {
                $('#btnTerminarRadicado').show();
                $('#btnActualizarRadicado').hide();
            }
            else {
                $('#btnTerminarRadicado').hide();
                $('#btnActualizarRadicado').show();
            }
        },

        ValidarCambioEstadoDefinitivo: function (e) {
            if ($("#ParmEstado").val() == $("#CodigoEstadoRadicacioRadicada").val()) {
                var hayArchivos = false;

                if (archivos != null && archivos.length > 0) {
                    for (var i = 0; i < archivos.length; i++) {
                        if (archivos[i].Enviado == 'S') {
                            hayArchivos = true;
                            break;
                        }
                    }
                }

                if (neiva) {
                    estadoRadicado.RadicadoDefinifivo();
                } else {
                    if (!hayArchivos) {
                        estadoRadicado.RadicadoDefinifivo();
                    } else {
                        estadoRadicado.RadicadandoTemporal();
                    }
                }
            }
        },

        ActualizarRadicado: function (action) {
            debugger;
            var jobject = {
                Radicacion: {
                    Secuencia: $('#Secuencia').val()
                    , Cuenta: $('#Cuenta').val()
                    , AtncNombre: $('#AtncNombre').val()
                    , ParmTipoDoc: $('#ParmTipoDoc').val()
                    , PersNroDoc: $('#PersNroDoc').val()
                    , ParmTipoRadi: $('#ParmTipoRadi').val()
                    , TiprCodigo: $('#TiprCodigo').val()
                    , AtncFecha: $('#AtncFecha').val()
                    , AtncHora: $('#AtncHora').val()
                    , AtncDireccion: $('#AtncDireccion').val()
                    , AtncTelefono: $('#AtncTelefono').val()
                    , RadiMail: $('#RadiMail').val()
                    , AtncPretensiones: $('#AtncPretensiones').val()
                    , AtncRespuesta: $('#AtncRespuesta').val()
                    , FaxRadicado: $('#FaxRadicado').val()
                    , CodigoTipoUsuario: $('#CodigoTipoUsuario').val()
                    , DireccionCorrespondencia: $('#DireccionCorrespondencia').val()
                    , DireccionServicio: $('#DireccionServicio').val()
                    , CodigoBarrio: $('#CodigoBarrio').val()
                    , DepartamentoNotificacion: $('#DepartamentoNotificacion').val()
                    , MunicipioNotificacion: $('#MunicipioNotificacion').val()
                    , TipoRadicacion: $('#ParmTipoRadi').text()
                    , DepartamentoDocumento: $('#DepartamentoDocumento').val()
                    , MunicipioDocumento: $('#MunicipioDocumento').val()
                    , NuevoMedidor: $('#NuevoMedidor').val()
                    , NuevaDireccion: $('#NuevaDireccion').val()
                    , NuevoNombreSuscriptor: $('#NuevoNombreSuscriptor').val()
                    , IdNuevoEstrato: $('#IdNuevoEstrato').val()
                    , ParmEstado: $("#ParmEstado").val()
                    , SecuenciaRadicacion: $('#SecuenciaRadicacion').val()
                    , AtncDireccionEditada: $('#AtncDireccionEditada').val()
                    , DireccionCorrespondenciaEditada: $('#DireccionCorrespondenciaEditada').val()
                    , NuevaDireccionEditada: $('#NuevaDireccionEditada').val()
                    , CodigoNuevaClaseUso: $('#CodigoNuevaClaseUso').val()
                    , NumeroRadicadoServicio: $('#NumeroRadicadoServicio').val()
                    , ObservacionesServicio: $('#ObservacionesServicio').val()
                    , NumeroCelular: $('#NumeroCelular').val()
                    , TipoPrioridad: $('#TipoPrioridad').val()
                    , ServicioOperativo: $('#ServicioOperativo').val()
                    , ConceptoOperativo: $('#ConceptoOperativo').val()
                    , CordinadorOperativo: $('#CordinadorOperativo').val()
                    , Ambiental: $('#Ambiental').val()
                    , Microruta: $('#Microruta').val()
                    , Latitud: $('#Latitud').val()
                    , Longitud: $('#Longitud').val()
                    , UnidadResidencial : $("#UnidadResidencial").val()
                    , UnidadResidencialocupada: $("#UnidadResidencialocupada").val()
                    , UnidadNoResidencial: $("#UnidadNoResidencial").val()
                    , UnidadNoResidencialNoocupada: $("#UnidadNoResidencialNoocupada").val()
                    , IndicadorPredioDesocupado: $("#IndicadorPredioDesocupado").val()
                    , NuevoNombrePersona: $("#NuevoNombrePersona").val()
                    , NuevoDireccionPersona: $("#NuevoDireccionPersona").val()
                    , Propietario: $("#Propietario").val()
                    , Responsable: $("#Responsable").val()
                    , Acta: $("#Acta").val()
                    , FechaActa: $("#FechaActa").val()
                    , Coeficiente: $("#Coeficiente").val()
                    , CantidadSuscriptores: $("#CantidadSuscriptores").val()
                    , Banco: $("#Banco").val()
                    , NumeroFactura: $("#NumeroFactura").val()
                    , FechaPago: $("#FechaPago").val()
                    , ValorPago: $("#ValorPago").val()
                },
                archivos: archivos
            };

            var actionUrl = baseRadicadoURL + '/' + action;
            var resul;
            resul = utilidades.FuncionAjaxAction(actionUrl, jobject);
            if (resul != null) {
                if (resul.Success == true) {
                    utilidades.Mensaje('Actualización Exitosa', 'El registro se actualizo correctamente.');
                    utilidades.LimpiarControles('#divDatosRadicado');
                    $('#divDatosRadicado').addClass('hidden');
                    var grid = $("#gridRadicados").data("kendoGrid");
                    grid.dataSource.read();
                    //grid.dataSource.page(1);
                } else {
                    utilidades.Mensaje('Error', resul.Mensaje);
                }
            }
        }
    };

    window.radicado = namespace;

})(this.jQuery);


(function ($) {

    var namespace;

    namespace = {
        RadicadoDefinifivo: function () {
            bootbox.dialog({
                title: 'Radicación Definitiva',
                message: 'La radicación se creará de forma definitiva. ¿Desea continuar? ',
                buttons: {
                    cerrar: {
                        icon: "ace-icon fa fa-times",
                        label: "Cerrar",
                        className: "btn-default"
                    },
                    aceptar: {
                        icon: "ace-icon fa fa-floppy-o",
                        label: "Aceptar",
                        className: "btn-primary",
                        callback: function () {
                            radicado.ActualizarRadicado('ActualizarRadicado');
                        }
                    }
                }
            });
        },

        RadicadandoTemporal: function () {
            bootbox.dialog({
                title: 'Radicación Definitiva',
                message: 'La radicación se creará de forma definitiva, pero como contiene archivos adjuntos se programara su radicación. ¿Desea continuar?',
                buttons: {
                    cerrar: {
                        icon: "ace-icon fa fa-times",
                        label: "Cerrar",
                        className: "btn-default"
                    },
                    aceptar: {
                        icon: "ace-icon fa fa-floppy-o",
                        label: "Aceptar",
                        className: "btn-primary",
                        callback: function () {
                            radicado.ActualizarRadicado('ActualizarRadicado');
                        }
                    }
                }
            });
        }
    };

    window.estadoRadicado = namespace;

})(this.jQuery);

function validacionesAdicionales() {
    var resul;
    var data = { cuenta: $('#Cuenta').val() }
    var actionUrl = baseRadicadoURL + '/' + 'ConsultarEstadoCuenta';
    resul = utilidades.FuncionAjaxAction(actionUrl, data);

    if (resul.Existe == true) {
        $('#Suscripcion').val(resul.Suscripcion);
        return true;
    }
    else {
        utilidades.Mensaje('Error en la Cuenta', 'El número de cuenta de contrato diligenciado no se encuentra registrado en el sistema');
        return false;
    }
}

function EliminarItems(objeto) {
    $("#" + objeto).html("<option value=''>Seleccione</option>");
    $("#" + objeto).select2("val", "");
}

function AgregarSeleccione(lista) {
    $("#" + lista).select2("val", "");
}

function EstablecerValorLista(lista, valor)
{
    $("#" + lista).select2("val", valor);
}

function ValidarIndicadorPredioDesocupado () {
    $('#UnidadNoResidencialNoocupada, #UnidadResidencialocupada').focusout(function () {
        if ($(this).val() != undefined && $(this).val() != '') {
            CalcularPeriodosDesocupado(true);
        }
    });
}

function CalcularPeriodosDesocupado(focus) {
    var undResidencial = parseInt($("#UnidadResidencial").val());
    var undNoResidencial = parseInt($("#UnidadNoResidencial").val());
    var undResidencialesHabitadas = parseInt($("#UnidadResidencialocupada").val());
    var undNoResidencialesHabitadas = parseInt($("#UnidadNoResidencialNoocupada").val());
    var totalUnidades = parseInt(undResidencial + undNoResidencial);
    var totalHabitadas = parseInt(undResidencialesHabitadas + undNoResidencialesHabitadas);
    var $indicadorpredioDesocupado = $("#IndicadorPredioDesocupado");

    $("#UnidadResidencialocupada").rules("add", { max: parseInt($("#UnidadResidencial").val()) });
    $("#UnidadNoResidencialNoocupada").rules("add", { max: parseInt($("#UnidadNoResidencial").val()) });
    

    if (totalUnidades == totalHabitadas) {
        $indicadorpredioDesocupado.rules("remove", "max");
        $indicadorpredioDesocupado.rules("remove", "min");
        $indicadorpredioDesocupado.prop('readonly', true).val('0');
    } else {

        if (focus) {
            $indicadorpredioDesocupado.prop('readonly', false).val('');
        } else {
            $indicadorpredioDesocupado.prop('readonly', false);
        }
        $indicadorpredioDesocupado.rules("remove", "max");
        $indicadorpredioDesocupado.rules("remove", "min");
        $indicadorpredioDesocupado.rules("add", { min: 1, max: 2 });
    }
}

