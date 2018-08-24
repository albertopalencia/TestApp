(function ($) {

    var namespace;

    namespace = {
        getPartialView: function (action, requestData, container, httpType) {

            if (typeof (httpType) === "undefined") { httpType = "GET"; }
            var actionUrl = action

            $.ajax({
                url: actionUrl,
                data: requestData,
                type: httpType,
                async: false,
                cache: false
            }).success(function (result) {
                container.html(result);
            }).error(function (xhr, status) {
                alert(xhr.responseText);
            })

        },

        EliminarAgregarRequired: function (contenedor, agregar) {

            var controles = (contenedor + ' input[type="text"]' + ', ' + contenedor + ' select' + ', ' + contenedor + ' textarea');

            if (agregar) {
                $(controles).addClass('required');
            }
            else {
                $(controles).removeClass('required');
            }
        },

        CargarValores: function (entidad, entidadNombre, contenedor) {

            if (contenedor == undefined) {
                contenedor = '';
            }

            $.each(entidad, function (name, value) {
                var valorControl;
                var control;
				
				if(entidadNombre != '' &&
					contenedor != ''){
					control = $(contenedor).find(entidadNombre + '_' + name);
				}					
				else if(entidadNombre != '' &&
						contenedor == ''){
					control = $(entidadNombre + '_' + name);
				}
				else if(entidadNombre == '' &&
						contenedor != ''){
					control = $(contenedor).find('#' + name);
				}
				else{
					control = $('#' + name);
				}
				
                if (control != undefined) {

                    var attr = $(control).attr('type');
                    var classDatePicker = $(control).hasClass('date-picker');
                    var classSelect2 = $(control).hasClass('select2-offscreen');

                    if(control.prop('id') != undefined)
					{
                        if (attr != 'radio' &&
                            attr != 'checkbox') {
                            if (!classDatePicker) {
                                if (!classSelect2) {
                                    control.val(value);
                                }
                                else {
                                    control.select2('val', value);
                                }
							}
							else{
								control.val(utilidades.formatoFecha(value));
							}
						}
						else if (attr == 'radio' &&
							value != null) {

							if (value != false &&
								value != true) {
								valorControl = value.trim();
							}
							else {
								valorControl = value;
							}

							if (valorControl == '1' ||
								valorControl == true) {
								$('#' + control.prop('id') + '[value="true"]').prop("checked", true);

							}
							else if (valorControl == '0' ||
								valorControl == false) {
								$('#' + control.prop('id') + '[value="false"]').prop("checked", true);
							}
						}
						else if (attr == 'checkbox' &&
							value != null) {
						    $(control).prop("checked", value);
						}
					}
                }
            });
        },

        LimpiarControles: function (contenedor) {
            $(contenedor + ' input[type="text"]').val('');
            $(contenedor + ' textarea').val('');
            $(contenedor + ' select').val('');
            $(contenedor + ' select[class~="select2-offscreen"]').select2('val', '');
            $(contenedor + ' input[type="radio"][value="true"]').prop("checked", false);
            $(contenedor + ' input[type="radio"][value="false"]').prop("checked", false);
            $(contenedor + ' input[type="checkbox"]').prop("checked", false);
        },

        validarForm: function (form) {

            $.validator.addMethod("emailCustom", function (value, element, params) {
                var re = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                return re.test(value);
            }, "Por favor, escribe una dirección de correo válida.");


            $.validator.addClassRules("emailCustom", {
                emailCustom: true
            });

            $.validator.addMethod("password", function (value, element) {
                return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{0,20}$/.test(value);
            }, "digite mínimo una letra mayúscula, una minúscula y un numero.");

            $.validator.addClassRules("password", {
                required: true,
                password: true
            });

            $(form).validate({
                onsubmit: false,
                showErrors: function (map, list) {
                    $.each(this.validElements(), function (index, element) {
                        var element = $(element);
                        if (element.parent().hasClass('has-error')) {
                            element.tooltip("destroy");
                            element.removeClass('tooltip-error').attr("title", "").parent().removeClass('has-error');
                            if (!element.hasClass('date-picker') &&
                                !element.hasClass('date-picker-control')) {
                                element.parent().find("i").removeClass("ace-icon fa fa-times-circle red");
                            }
                        }

                        if (element.parent().hasClass('select-text')) {
                            element.parent().tooltip("destroy");
                        }
                    });

                    $.each(list, function (index, error) {
                        var element = $(error.element);
                        if (!element.parent().hasClass('has-error')) {
                            if (!element.hasClass('date-picker') &&
                                !element.is('select') &&
                                !element.hasClass('date-picker-control') &&
                                !element.hasClass('search')) {
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

                                element.attr("data-original-title", error.message);
                            } else {
                                if (!element.hasClass('select2-offscreen')) {
                                    element.parent().addClass('has-error');
                                }
                                else {
                                    if (!element.parent().hasClass('select-text')) {
                                        element.parent().append("<div class='select-text has-error tooltip-error'></div>");
                                        element.parent().find('.select2-offscreen, .select2-container')
                                            .appendTo(element.parent().find('.has-error'));
                                    }
                                    else {
                                        element.parent().removeAttr('class');
                                        element.parent().attr('class', 'select-text has-error tooltip-error');
                                    }
                                }
                            }
                            if (!element.is('select')) {
                                element.addClass('tooltip-error').attr("title", error.message).tooltip();
                            }
                            else {
                                if (!element.hasClass('select2-offscreen')) {
                                    element.attr("data-toggle", 'tooltip').attr('data-placement', 'top')
                                    .attr("data-original-title", error.message).addClass('tooltip-error')
                                    .tooltip({
                                        placement: $(this).data("placement") || 'top'
                                    });
                                }
                                else {
                                    element.parent().attr("data-toggle", 'tooltip').attr('data-placement', 'top')
                                   .attr("data-original-title", error.message)
                                   .tooltip({
                                       placement: $(this).data("placement") || 'top'
                                   });
                                }
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
        },

        validar: function (t) {
            var isValid = true;
            var grupo;
            
            if (t.is(":submit, :button, a")) {

                utilidades.RemoverValidador();

                grupo = t.attr("grupovalidacion");
                $("[grupovalidacion~=" + grupo + "]").not(":submit, :button, a").each(function (i, item) {
                    
                    if (!$(item).valid())
                        isValid = false;
                });
            }

            var attrType = t.attr('data-type');

            utilidades.SeleccionarControlValidacion(isValid, attrType, grupo);
                        
            if (typeof validacionesAdicionales == 'function' &&
                isValid == true &&
                attrType != undefined &&
                attrType == 'terminar') {
                isValid = validacionesAdicionales();
            }

            return isValid;
        },

        RemoverValidador: function () {
            var controles;

            controles = $('div, span').find('.has-error');

            if (controles.size() != 0) {

                for (var i = 0; i < controles.size() ; i++) {

                    var element = $(controles[i]);
                    var emailCustom = element.find('.emailCustom').size();

                    if (element.is('span')) {
                        if (emailCustom == 0) {
                            element.children('i').remove();
                            element.children('input, textarea').unwrap().removeClass('tooltip-error')
                                .removeAttr('aria-invalid').removeAttr('title').removeAttr('data-original-title');
                        }
                    }
                    else if (element.is('div')) {
                        element.removeClass('has-error');
                        element.children('select').removeClass('tooltip-error')
                            .removeAttr('aria-invalid').removeAttr('data-toggle').removeAttr('data-placement')
                            .removeAttr('data-original-title');
                    }
                }

            }         
        },

        iniciarValidacion: function () {
            $(':submit[grupovalidacion], a[grupovalidacion]').unbind("click");
            $(':submit[grupovalidacion], a[grupovalidacion]').click(function (e) {
                if (!utilidades.validar($(this))) {
                    e.preventDefault();
                    return false;
                }
            });
        },

        formatoFecha: function (jsonDate) {

            var shortDate = null;
            if (jsonDate) {
                var regex = /-?\d+/;
                var matches = regex.exec(jsonDate);
                var dt = new Date(parseInt(matches[0]));
                var month = dt.getMonth() + 1;
                var monthString = month > 9 ? month : '0' + month;
                var day = dt.getDate();
                var dayString = day > 9 ? day : '0' + day;
                var year = dt.getFullYear();
                shortDate = monthString + '/' + dayString + '/' + year;
            }
            return shortDate;
        },

        FormatoHora: function (jsonHour) {

            var shortDate = null;
            if (jsonHour) {
                var regex = /-?\d+/;
                var matches = regex.exec(jsonHour);
                var dt = new Date(parseInt(matches[0]));
                var hours = dt.getHours();
                var minutes = dt.getMinutes();
                var seconds = dt.getSeconds();

                var hoursString = hours > 9 ? hours : '0' + hours;
                var minutesString = minutes > 9 ? minutes : '0' + minutes;
                var secondsString = seconds > 9 ? seconds : '0' + seconds;


                shortDate = hoursString + ':' + minutesString;
            }
            return shortDate;
        },
		
		valorRadio: function (control) {

            if ($(control + '[value="true"]').is(':checked'))
            {
                return 1;
            } else  {
                return 0;
            }
		},

		ValorCheckbox: function (nombreControl) {

		    if ($(nombreControl).is(':checked')) {
		        return 1;
		    } else {
		        return 0;
		    }
		},

		PresentarMensajeGeneral: function (text) {
		    $('#mensajeModalGeneral').text(text);
		    $('#presentarMensajeGeneral').click();
		},

		Modales: function () {

		    var $body = $('body');
		    var OPEN_MODALS_COUNT = 'fv_open_modals';
		    var Z_ADJUSTED = 'fv-modal-stack';
		    var defaultBootstrapModalZindex = 1040;

		    if ($body.data(OPEN_MODALS_COUNT) === undefined) {
		        $body.data(OPEN_MODALS_COUNT, 0);
		    }

		    $body.on('show.bs.modal', '.modal', function (event) {
		        if (!$(this).hasClass(Z_ADJUSTED) &&
                    !$(this).hasClass('bootbox')) {
		            $body.data(OPEN_MODALS_COUNT, $body.data(OPEN_MODALS_COUNT) + 1);
		            $(this).addClass(Z_ADJUSTED);
		            $(this).css('z-index', defaultBootstrapModalZindex + (1 * $body.data(OPEN_MODALS_COUNT)));
		        }
		    });
		    $body.on('hidden.bs.modal', '.modal', function (event) {
		        $body.data(OPEN_MODALS_COUNT, $body.data(OPEN_MODALS_COUNT) - 1);
		        $(this).removeClass(Z_ADJUSTED);
		        if ($body.data(OPEN_MODALS_COUNT) > 0)
		            $body.addClass('modal-open');
		    });
		},

		ExtendjQuery: function () {
		    jQuery.fn.extend({
		        scrollToControl: function () {
		            var x = jQuery(this).offset().top - 100;
		            jQuery('html,body').scrollTop(x);
		        }
		    });

		    jQuery.fn.extend({
		        validarEmail: function () {
		            if ($(this).val() != '') {
		                $(this).addClass('emailCustom');
		            }
		            else {
		                $(this).removeClass('emailCustom');
		            }
		        }
		    });
		},

		SeleccionarElementoVisible: function (element, attrType) {

		    var parent;
		    var li;
		    var ul;
		    var active = 'active';
		    var tabPane = '.tab-pane';

		    if (element != undefined) {

		        parent = element.parentsUntil(tabPane).parent().first();

		        if (parent[0] != undefined &&
                    !parent.hasClass(active) &&
                    attrType != 'modal') {

		            $(tabPane).removeClass(active);
		            parent.addClass(active);

		            li = $('a[href$="' + parent.prop('id') + '"]').parents('li');
		            ul = li.parents('ul');

		            if (!li.hasClass(active)) {
		                ul.find('li').removeClass(active);
		                li.addClass(active);
		            }
		        }

		        if ($(element).is(':visible')) {
		            return true;
		        }
		        else {
		            return false;
		        }
		    }
		},

		SeleccionarControlValidacion: function (isValid, attrType, grupo) {

		    if (isValid == false) {
                		        
		        var element;
		        var elements;

		        if (grupo != undefined) {
		            elements = $(".has-error").find('input[grupovalidacion~=' + grupo + '], select[grupovalidacion~=' + grupo + '], textarea[grupovalidacion~=' + grupo + ']');
		        }
		        else {
		            elements = $(".has-error").find('input, select, textarea');
		        }

		        for (var i = 0; i < elements.size() ; i++) {
		            if (utilidades.SeleccionarElementoVisible($(elements[i]), attrType)) {
		                element = $(elements[i]);
		                break;
		            }
		        }

		        if (element != undefined) {
		            if (attrType != 'modal') {
		                element.focus().scrollToControl();
		            }
		            else {
		                element.focus();
		            }
		        }
		    }
		},

		ValidacionesAdicionales: function () {
		    $.validator.addMethod("emailCustom", function (value, element, params) {
		        var re = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		        return re.test(value);
		    }, "Por favor, escribe una dirección de correo válida.");


		    $.validator.addClassRules("emailCustom", {
		        emailCustom: true
		    });

		    $.validator.addMethod("password", function (value, element) {
		        return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{0,20}$/.test(value);
		    }, "digite mínimo una letra mayúscula, una minúscula y un numero.");

		    $.validator.addClassRules("password", {
		        required: true,
		        password: true
		    });
		},

		CargarComboAjax: function (action, select, data) {
		    $.ajax({
		        url: action,
		        data: data,
		        cache: false,
		        type: 'POST',
		        async: false,
		        success: function (data) {
		            var items = "";
		            $.each(data, function (i, item) {
		                items += "<option value=\"" + item.Value + "\">" + item.Text + "</option>";
		            });

		            $(select).html(items);

		            if ($(select).hasClass('select2-offscreen')) {
		                $(select).select2('val', '');
		            }
		        },
		        error: function (reponse) {
		            alert("error : " + reponse);
		        }
		    });
		},

		FuncionAjax: function (action, data) {
		    var actionUrl = baseURL + '/' + action
		    var datos;

		    $.ajax({
		        url: actionUrl,
		        data: data,
		        type: 'POST',
		        async: false,
		        cache: false
		    }).success(function (data) {
		        datos = data;
		    }).error(function (xhr, status) {
		        alert(xhr.responseText);
		    });

		    return datos;
		},

		FuncionAjaxAction: function (action, data) {
		    var actionUrl = action
		    var datos;

		    $.ajax({
		        url: actionUrl,
		        data: JSON.stringify(data),
		        type: 'POST',
		        contentType: 'application/json; charset=utf-8',
		        async: false,
		        cache: false
		    }).success(function (data) {
		        datos = data;
		    }).error(function (xhr, status) {
		        alert(xhr.responseText);
		    });

		    return datos;
		},

		CargarComboAjaxSeleccione: function (action, select, data) {
		    $.ajax({
		        url: action,
		        data: data,
		        cache: false,
		        type: 'POST',
		        async: false,
		        success: function (data) {
		            var items = "";
		            items += "<option value=\"" + "" + "\">" + "Seleccione" + "</option>";

		            $.each(data, function (i, item) {
		                items += "<option value=\"" + item.Value + "\">" + item.Text + "</option>";
		            });

		            $(select).html(items);

		            if ($(select).hasClass('select2-offscreen')) {
		                $(select).select2('val', '');
		            }
		        },
		        error: function (reponse) {
		            alert("error : " + reponse);
		        }
		    });
		},

		CargarGrilla: function (grilla) {
		    var grid = $('#' + grilla).data("kendoGrid");
		    grid.dataSource.page(1);
		},

		CargarGrillaFinal: function (grilla) {
		    var grid = $('#' + grilla).data("kendoGrid");
		    grid.dataSource.read();
		},

		CambiarIconosGrilla: function (arg) {
		    $(".k-grid-View").find("span").addClass("ui-icon ace-icon fa fa-search-plus grey")
               .attr('data-toggle', 'tooltip').attr('title', 'Seleccionar')
               .wrap('<div class="ui-pg-div text-center pull-left"></div>');
		    $(".k-grid-View").removeClass('k-button');

		    $(".k-grid-Edit").find("span").addClass("ui-icon ace-icon fa fa-pencil blue")
               .attr('data-toggle', 'tooltip').attr('title', 'Editar')
               .wrap('<div class="ui-pg-div text-center pull-left"></div>');
		    $(".k-grid-Edit").removeClass('k-button');

		    $(".k-grid-Destroy").find("span").addClass("ui-icon ace-icon fa fa-trash-o red")
               .attr('data-toggle', 'tooltip').attr('title', 'Eliminar')
               .wrap('<div class="ui-pg-div text-center pull-left"></div>');
		    $(".k-grid-Destroy").removeClass('k-button');

		    $('[data-toggle="tooltip"]').tooltip();
		},

		FuncionExiste: function (nombreFuncion) {
		    if (typeof window[nombreFuncion] == 'function') {
		        return true;
		    }
		    else {
		        return false;
		    }
		},

		Error_handler: function (e) {
		    if (e.errors) {
		        var message = "Errors:\n";
		        $.each(e.errors, function (key, value) {
		            if ('errors' in value) {
		                $.each(value.errors, function () {
		                    message += this + "\n";
		                });
		            }
		        });
		        alert(message);
		    }
		},

		CargueInicial: function (nombreFormulario) {
            		    
		    utilidades.Modales();
		    utilidades.ExtendjQuery();

		    $('.emailCustom').validarEmail();

		    $(".onlynumber").numericInput({ allowNegative: true, allowFloat: true });

		    $(".onlynumberPositive").numericInput({ allowNegative: false, allowFloat: true });

		    $(".onlynumberNotFloat").numericInput({ allowNegative: false, allowFloat: false });

		    $(".date-picker").datepicker({ autoclose: true }).next().click(function (e) {
		        $(this).prev().focus();
		    });		    

		    $(".date-picker, .timepicker").each(function () {
		        $(this).parent().find('span').addClass('cursor-pointer');
		    });

		    $('.date-picker').keydown(function (e) {
		        var keycode = (e.keyCode ? e.keyCode : e.which);
		        if (keycode == 8 || keycode == 9 || utilidades.KeyCodeNumber(keycode))
		            return true;
		        else
		            return false;
		    });

		    $('.timepicker').mask("99:99", { placeholder: "hh:mm" });		    

		    $('.timepicker').blur(function (e) {
		        var today = new Date();

		        if ($(this).val() == '' || $(this).val() == 'hh:mm') {
		            $(this).val(today.getHours() + ':' + today.getMinutes());
		            utilidades.CambiarHora($(this));
		        }
		    });
            
		    $('.timepicker').keydown(function (e) {
		        var keycode = (e.keyCode ? e.keyCode : e.which);
		        
		        if (keycode == 8 || keycode == 9 || utilidades.KeyCodeNumber(keycode)) {
		            if (keycode == 9) {
		                $('.bootstrap-timepicker-widget').removeClass('open');
		            }		        
		            return true;
		        }
		        else
		            return false;
		    }).timepicker({
		        minuteStep: 1,		        
		        showMeridian: false,
		        autoclose: true		        
		    }).next().click(function (e) {
		        $(this).prev().focus();
		    });

		    $('.timepicker').each(function () {
		        utilidades.CambiarHora($(this));
		    });

		    $('.timepicker').timepicker().on('changeTime.timepicker', function (e) {
		        utilidades.CambiarHora($(this));
		    });
		    
		    $("select:not(.select2)").select2({ allowClear: true })
               .on('change', function () {
                   $(this).closest('form').validate().element($(this));
               }).removeClass('form-control').addClass('width-100 input-sm no-padding');

		    $('.radio input[type="radio"]').addClass('ace');

		    $('.checkbox label').children().each(function () {
		        if ($(this).is("input") &&
                    $(this).attr('type') == 'hidden' &&
                    $(this).prev().attr('type') != 'hidden') {
		            $(this).val($(this).prev().is(':checked'));
		            $(this).appendTo($(this).parent());
		        }
		    });

		    $('.checkbox label input').change(function () {
		        $(this).nextAll('input[type=hidden]').val($(this).is(':checked'));
		    });

		    $('[data-toggle="tooltip"]').tooltip();

		    utilidades.validarForm('#' + nombreFormulario);
		    utilidades.iniciarValidacion();

		    $('#' + nombreFormulario).keypress(function (e) {
		        if (e.which == 13) {
		            e.preventDefault();
		        }
		    });

		    $(document).on('show.bs.modal', '.modal', function (event) {
		        var zIndex = 1040 + (10 * $('.modal:visible').length);
		        $(this).css('z-index', zIndex);
		        setTimeout(function () {
		            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
		        }, 0);
		    });

		    $(document).ajaxStart(function () {
		        $('#divProgress').show();
		    });

		    $(document).ajaxStop(function () {
		        $('#divProgress').hide();
		    });
		},

		KeyCodeNumber: function (keycode) {
		    if ((keycode >= 96 && keycode <= 105) || (keycode >= 48 && keycode <= 57)) {
		        return true;
		    }
		    else {
		        return false;
		    }
		},

		CambiarHora: function (control) {
		    var hora = parseInt($(control).val().substring(0, $(control).val().indexOf(':')));
		    if (hora <= 9) {
		        $(control).val('0' + $(control).val());
		    }
		},

		Mensaje: function (titulo, mensaje) {
		    bootbox.dialog({
		        title: titulo,
		        message: mensaje,
		        buttons: {
		            cerrar: {
		                icon: "ace-icon fa fa-times",
		                label: "Cerrar",
		                className: "btn-default"
		            }
		        }
		    });
		},

		ConfirmacionEliminar: function (titulo, mensaje, funcion, id) {
		    bootbox.dialog({
		        title: titulo,
		        message: mensaje,
		        buttons: {
		            cerrar: {
		                icon: "ace-icon fa fa-times",
		                label: "Cerrar",
		                className: "btn-default"
		            },
		            aceptar: {
		                icon: "ace-icon fa fa-trash-o",
		                label: "Aceptar",
		                className: "btn-primary",
		                callback: function () {
		                    var codeToExecute = funcion + '(' + id + ')' ;
		                    var tmpFunc = new Function(codeToExecute);
		                    tmpFunc();		                    
		                }
		            }
		        }
		    });
		},

		GetParameterByName: function (name) {
		    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
		    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
    };

    window.utilidades = namespace;

})(this.jQuery);