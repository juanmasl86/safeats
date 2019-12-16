$(function () {
    // <------------------------------------- Selec2 provincias y municipios -------------------------------------->
    $('select.country').on('change', function () {
        var parameters = {
            "country": $('select.country').val()
        };
        console.log(parameters);
        $.ajax({
            type: "POST",
            url: "/getDepartaments",
            data: parameters,
            dataType: 'json',
            success: function(response) {
                var contador = 0;
                var items = "<option value='0' selected disabled>Seleciona una provincia...</option>";
                console.log(response);
                $('select.departament').empty();
                response.forEach(function() {
                   items += "<option value='"+response[contador].id+"'>"+response[contador].provincia+"</option>"
                    contador++;
                });
                $('select.departament').append(items);
                $('select.departament').show();
                $('select.departament').select2();
            }
        });
    });

    $('body').on('change', 'select.departament', function () {
        var parameter = {
            "departamentId" : $(this).val(),
        };
        console.log(parameter);
        $.ajax({
            type: "POST",
            url: "/getCities",
            data: parameter,
            dataType: 'json',
            success: function (response) {
                var contador = 0;

                var items ="<option value='0' selected disabled>Seleciona una localidad...</option>";
                console.log(response);
                $('select.city').empty();
                response.forEach(function () {
                    items += "<option value='"+response[contador].id+"'>"+response[contador].municipio+"</option>"
                    contador++;
                });
                ;
                $('select.city').append(items);
                $('select.city').show();
                $('select.city').select2();
            }
        });
    });

    // <------------------------------------- Validacion y actualización de datos ------------------------------------->

    $('input.updateUser').click(function () {

        var correcto = true;
        var errores = []
        var error = ""
        $('div.errorReport').empty();
        if ($('input.name').val() == "" || $('input.name').val() == " ") {
            error = "No puede dejar el campo de nombre vacio.";
            errores.push(error);
            correcto = false;
        }
        if($('input.lastname').val() == "" || $('input.lastname').val() == " ") {
            error = "No puede dejar el campo de apellidos vacio.";
            errores.push(error);
            correcto = false;
        }
        if($('input.address').val() == "" || $('input.address').val() == " ") {
            error = "No puede dejar el campo de dirección vacio.";
            errores.push(error);
            correcto = false;
        }

        if($('input.postalCode').val() == "" || $('input.postalCode').val() == " " || !(/^(?:0?[1-9]|[1-4]\d|5[0-2])\d{3}$/.test($('input.postalCode').val()))) {
            error = "No puede dejar el campo código postal vacio o introducir letras max de cifras de 5 numeros y min de 3.";
            errores.push(error);
            correcto = false;
        }

        if($('select.country > option:selected').val() == "" || $('select.departament > option:selected').val() == "" || $('select.city > option:selected').val() == ""){
            error = "No se puede dejar pais, provincia o municipio sin seleccionar.";
            errores.push(error);
            correcto = false;
        }

        if(! $('input.privacy').prop('checked') ) {
            error = "Ha de acceptar la politica de privacidad.";
            errores.push(error);
            correcto = false;
        }

        if(!correcto) {
            var item = "";
            var contador = 0;

            errores.forEach(function () {
               item+="<a class='d-block alert alert-danger m-1'>"+errores[contador]+"</a>";
               contador++
            });

            $('div.errorReport').append(item);

        } else {
            $('div.errorReport').empty();

            var updateUserData = {
                "name" : $('input.name').val(),
                "lastname" : $('input.lastname').val(),
                "address" : $('input.address').val(),
                "postal_code" : parseInt($('input.postalCode').val()),
                "country" : $('select.country').val(),
                "departament" : $('span#select2-departament-container').text(),
                "city": $('span#select2-city-container').text(),
            }

            $.ajax({
                type: "POST",
                url: "/updateUser",
                data: updateUserData,
                dataType: 'json',
                success: function (response) {
                    $('body').append(response);

                }
            });
        }

    });

    // <<----------------------------------------- Efectos ------------------------------------------>

    // ------------------------------------ Toggle más icon change userprofile-----------------------------------------

    $('div.allergy-title').click(function () {
        $('div.allergy').slideToggle(200);
        if($(this).hasClass("up")) {
            $(this).removeClass("up");
            $('img.allergy').attr("src", "minus.png");
        } else {
            $(this).addClass("up");
            $('img.allergy').attr("src", "plus.png");
        }
    });

    $('div.favorites-title').click(function () {
        $('div.favorites').slideToggle(200);
        if($(this).hasClass("up")) {
            $(this).removeClass("up");
            $('img.favorites').attr("src", "minus.png");
        } else {
            $(this).addClass("up");
            $('img.favorites').attr("src", "plus.png");
        }
    });

    // ------------------------------------ Toggle Add allergy category-----------------------------------------

    $("body").on("click", "div.categoria", function () {
       $(this).next(".ingredients").slideToggle(200);
    });





    // <------------------------------------- Funciones Menu ADMIDNISTRACION -------------------------------------->

    // <---------------- INPRIMIR ELEMENTOS PARA AÑADIR ALERGIA COMUN ------------------->
    $('div.adminAddAllergy').click(function () {
        $('section').empty();

        var content = "<h3 class='text-center my-5'>Agregar alergia común</h3>" +
                      "<div class='error my-2 mx-1'></div>" +
                      "<input type='text' class='form-control nameAllergy col-lg-8 mx-auto' placeholder='Escribe nombre de la alergia..'/> " +
                      "<input type='hidden' class='typeAllergy' value='comun'/>";

        $.ajax({
            url: "/getIngredients",
            dataType: "JSON",
            success: function (response) {
                var contador = 0;
                var categorias = response[1];
                var ingredients = response[0];

                if(categorias.length != 0 && ingredients.length != 0) {
                    categorias.forEach(function () {
                        content += "<div class='categoria border-bottom border-dark my-2'><h5>" +categorias[contador]["category"]+"</h5></div>" +
                                    "<div class='ingredients col-lg-12'><div class='row row-cols-3'>";
                        var contador2 = 0;
                             ingredients.forEach(function () {
                                 if (ingredients[contador2]["category"] == categorias[contador]["category"]) {
                                 content += "<div class='Ingrecheck col'><input type='checkbox' value='"+ingredients[contador2]["id"]+"'/> "+ingredients[contador2]["name"] +"</div>";
                                 }
                                 contador2++;
                             });
                        content += "</div></div>";
                        contador++;
                    });

                    content += "<div class='col-lg-12 d-flex'><button class='col-lg-3 ml-auto my-3 btn btn-info addAllergyComun'>Añadir alergia</button></div>"
                }
                $('section').append(content);
            }
        });
    });

    //<----------------- AJAX ENVIO DATOS PARA ADD NEW ALLERGY COMÚN ----------------->

    $("body").on("click", "button.addAllergyComun", function () {
        $('div.error').empty();
        var checked = [];
        $("input[type='checkbox']:checked").each(function () {
            checked.push(parseInt($(this).val()));
        })
        console.log(checked);
        if(checked.length == 0) {
            var error = "Debe seleccionar al menos un ingrediente";
            $('div.error').append(error);
        } else {
            if ($("input.nameAllergy").val() == " " || $("input.nameAllergy").val() == "") {
                var error = "Debe ponerle un nombre a la alergia común";
                $('div.error').append(error);
            } else {
                var parameters = {
                    "allergyName": $("input.nameAllergy").val(),
                    "allergyType": "comun",
                    "allergyIngredients": checked,
                }

                $.ajax({
                    data: parameters,
                    url: "/addAllergy",
                    method: "POST",
                    dataType: "JSON",
                    success: function (response) {
                        if(response.correcto == true){
                            $('div.error').empty();
                            $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                        } else {
                            $('div.error').empty();
                            $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                        }
                    }
                });
            }
        }


    });
    // <---------------- buzon administracion ------------------->

    $("body").on("click", "div.adminSupport", function () {
        $('section').empty();
        $.ajax({
            url: "/getIssues",
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                var content = "<div class='container-issues p-4'>";
                var contador = 0;
                response.forEach(function () {
                    var d = new Date(response[contador]["timecreated"] * 1000);
                    var fCreated = d.toLocaleString();
                    response[contador]["timecreated"]
                    if (response[contador]["read"] == false) {
                    content += "<div class='issueTitle col-lg-12 alert alert-success p-2 mb-0'>" +
                        "<a class='title'><strong>Asunto:</strong> "+response[contador]["title"]+"</a> " +
                        "<a class='title mx-auto'><strong>Categoria:</strong> "+response[contador]["category"]+"</a> " +
                        "<a class='title ml-auto'><strong>Fecha:</strong> "+fCreated+"</a> " +
                        "</div><div class='issueBody border-top-0 border-success p-2 bg-orange rounded-bottom'>" +
                        "<a class='title mx-auto'><strong>Emisor:</strong> "+response[contador]["emailSender"]+"</a><br> " +
                        "<a class='title ml-auto p-2'><strong>Incidencia:</strong> "+response[contador]["body"]+"</a> " +
                        "</div>";
                    } else {
                        if(response[contador]["read"] == true && response[contador]["answered"] == false) {
                            content += "<div class='issueTitle col-lg-12 alert alert-danger p-2 mb-0'>" +
                                "<a class='title'><strong>Asunto:</strong> "+response[contador]["title"]+"</a> " +
                                "<a class='title mx-auto'><strong>Categoria:</strong> "+response[contador]["category"]+"</a> " +
                                "<a class='title ml-auto'><strong>Fecha:</strong> "+fCreated+"</a> " +
                                "</div><div class='issueBody border-top-0 border-danger p-2 bg-orange rounded-bottom'>" +
                                "<a class='title mx-auto'><strong>Emisor:</strong> "+response[contador]["emailSender"]+"</a> <br>" +
                                "<a class='title ml-auto '><strong>Incidencia:</strong> "+response[contador]["body"]+"</a> " +
                                "</div>";
                        } else {
                            if(response[contador]["read"] == true && response[contador]["answered"] == true) {
                                content += "<div class='issueTitle col-lg-12 alert alert-primary p-2 mb-0'>" +
                                              "<a class='title'><strong>Asunto:</strong> "+response[contador]["title"]+"</a> " +
                                              "<a class='title mx-auto'><strong>Categoria:</strong> "+response[contador]["category"]+"</a> " +
                                              "<a class='title ml-auto'><strong>Fecha:</strong> "+fCreated+"</a> " +
                                            "</div><div class='issueBody border-top-0 border-primary p-2 bg-orange rounded-bottom'>" +
                                              "<a class='title mx-auto'><strong>Emisor:</strong> "+response[contador]["emailSender"]+" </a> <br>" +
                                              "<a class='title ml-auto'><strong>Incidencia:</strong> "+response[contador]["body"]+" </a> " +
                                            "</div>";
                            }
                        }
                    }

                    contador++;
                });

                content += "</div>";
                $('section').append(content);
            }
        });
    });

    $("body").on("click", "div.issueTitle", function() {
        console.log("ENTREEEEEEEEEEEEEEEEEEEE");
        $(this).next().slideToggle(200);
    });

    // <---------------- agregar alimento ------------------->
    $('div.adminAddIngredient').click(function () {
        $('section').empty();
        var user = "{{ user.name }}";
        var content = "<h3 class='text-center mt-5 mb-4'>Agregar alimento</h3>" +
            "<div class='error my-2 mx-1'></div>" +
            "<div class='col-lg-7 mx-auto'> " +
                "<input type='text' class='form-control nameIngredient' placeholder='Escribe nombre del alimento..'/> " +
                "<select class='form-control my-3 catIngredient'>" +
                    "<option value='0' selected disabled>Seleccione una categoría</option>\n" +
                    "<option value='Leche y derivados'>Leche y derivados.</option>\n" +
                    "<option value='Carnes'>Carnes.</option>" +
                    "<option value='Pescados'>Pescados.</option>" +
                    "<option value='Mariscos'>Mariscos</option>" +
                    "<option value='Huevos'>Huevos.</option>" +
                    "<option value='Verduras y hortalizas'>Verduras y hortalizas.</option>" +
                    "<option value='Fruta'>Fruta.</option>" +
                    "<option value='Legumbres'>Legumbres</option>" +
                    "<option value='Frutos secos'>Frutos secos.</option>" +
                    "<option value='Cereales y derivados, azúcar y dulces'>Cereales y derivados, azúcar y dulces.</option>" +
                    "<option value='Grasas, aceites y mantequillas'>Grasas, aceites y mantequillas.</option>" +
                "</select>" +
                "<button class='btn btn-info addIngredient'>Añadir</button>" +
            "</div>";
        $('section').append(content);
    });

    //<----- llamada a la funcion para añadir el alimento----->

    $("body").on("click", "button.addIngredient", function () {
        addNewIngredient();
    });

    //<---------------------------------- Añadir una incidencia ------------------------------------->
    $("input.addIssue").click(function () {
        $(this).attr('disabled', true);
        if ($('input.emailIssue').val() == " " || $('input.emailIssue').val() == "" || $('input.titleIssue').val() == "" || $('input.titleIssue').val() == " " || $('textarea.issueReport').val() == "" || $('textarea.issueReport').val() == " ") {
            $('div.errorReport').empty();
            $('div.errorReport').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'> No se pueden mandar los campos de texto vacios </div>");
            $(this).attr('disabled', false);
        } else {
            if($('input.emailIssue').val().indexOf('@', 0) == -1 || $('input.emailIssue').val().indexOf('.', 0) == -1) {
                $('div.errorReport').empty();
                $('div.errorReport').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'> Debe introducir un email valido </div>");
                $(this).attr('disabled', false);
            } else {
                if ($('select.issueCategory > option:selected').val() == 0 ) {
                    $('div.errorReport').empty();
                    $('div.errorReport').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'> Debe seleccionar una categoria </div>");
                    $(this).attr('disabled', false);
                } else {
                    var parameter = {
                        "email": $('input.emailIssue').val(),
                        "title": $('input.titleIssue').val(),
                        "category": $('select.issueCategory > option:selected').val(),
                        "issueReport": $('textarea.issueReport').val(),
                    }

                    $.ajax({
                        data: parameter,
                        url: "/addIssue",
                        method: "POST",
                        dataType: "JSON",
                        success: function (response) {
                            if(response.correcto == true){
                                $('div.errorReport').empty();
                                $('div.errorReport').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                            } else {
                                $('div.errorReport').empty();
                                $('div.errorReport').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                            }
                            console.log(response);
                            $(this).attr('disabled', false);
                        }
                    }) ;


                }
            }

        }
    });


//<---------------------------------------------  Editar usuario por campos -------------------------------------------------->
    $("button.editProfile").click(function () {
        $('div.errorEdit').empty();
    });

    $("button.editPersonalData").click(function () {
        $(this).attr('disabled', true);
        $('div.errorEdit').empty();
        console.log($("input.role").val());

        var parameters = {
            "permisos": "",
            "name": "",
            "lastName": "",
            "address": "",
            "postalCode": "",
            "country": "",
            "departament":"",
            "city": ""
        };
        console.log("test");

       if($('input.permisos').val() == "ACTIVAR") {
           parameters["permisos"] = "ACTIVAR";
           console.log(parameters["permisos"]);
       }

       if($('input.name').val() != "" && $('input.name').val() != " ") {
           parameters["name"] = $('input.name').val();
       }

        if($('input.lastname').val() != "" && $('input.lastname').val() != " ") {
            parameters["lastName"] = $('input.lastname').val();
        }

        if($('input.address').val() != "" && $('input.address').val() != " ") {
            parameters["address"] = $('input.address').val();
        }

        if($('input.postalCode').val() != "" && $('input.postalCode').val() != " ") {
            parameters["postalCode"] = $('input.postalCode').val();
        }

        if($('select.country > option:selected').val() != 0 && $('select.departament > option:selected').val() != 0 && $('select.city > option:selected').val() != 0){

            parameters["country"] = $('select.country').val();
            parameters["departament"] = $('span#select2-departament-container').text();
            parameters["city"] = $('span#select2-city-container').text();
        }

       if($('select.country > option:selected').val() == 0 && ($('input.postalCode').val() == "" || $('input.postalCode').val() == " ") && ($('input.address').val() == "" || $('input.address').val() == " ") && ($('input.lastname').val() == "" || $('input.lastname').val() == " ") && ($('input.name').val() == "" || $('input.name').val() == " ") && $('input.permisos').val() != "ACTIVAR") {
           $('div.errorEdit').append("<div class='col-lg-12 my-3 alert alert-danger'>No puede dejar el formulario sin rellenar.</div>")
       } else {
            if($("input.role").val() == "ROLE_SUPER_USER" || $("input.role").val() == "ROLE_ADMIN") {
                if($('select.country > option:selected').val() == 0 && ($('input.postalCode').val() == "" || $('input.postalCode').val() == " ") && ($('input.address').val() == "" || $('input.address').val() == " ") && ($('input.lastname').val() == "" || $('input.lastname').val() == " ") && ($('input.name').val() == "" || $('input.name').val() == " ")) {
                    $('div.errorEdit').append("<div class='col-lg-12 my-3 alert alert-danger'>No puede dejar el formulario sin rellenar.</div>")

                } else {
                    $.ajax({
                        data: parameters,
                        url: "/editUser",
                        method: "POST",
                        dataType: "JSON",
                        success: function (response) {
                            if(response.correcto == true){
                                $('div.errorEdit').empty();
                                $('div.errorEdit').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                            } else {
                                $('div.errorEdit').empty();
                                $('div.errorEdit').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                            }
                            console.log(response);
                            $(this).attr('disabled', false);
                        }
                    }) ;
                }
            } else {
            $.ajax({
                data: parameters,
                url: "/editUser",
                method: "POST",
                dataType: "JSON",
                success: function (response) {
                    if(response.correcto == true){
                        $('div.errorEdit').empty();
                        $('div.errorEdit').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                    } else {
                        $('div.errorEdit').empty();
                        $('div.errorEdit').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                    }
                    console.log(response);
                    $(this).attr('disabled', false);
                }
            }) ;
            }
       }

    });
//<---------------------------------------------  Añadir alergia personal -------------------------------------------------->

    $("button.addAllergyPersonal").click(function () {
        $('div.error').empty();
        var checked = [];
        $("input[type='checkbox']:checked").each(function () {
            checked.push(parseInt($(this).val()));
        })
        console.log(checked);
        if(checked.length == 0) {
            $('div.error').empty();
            var error = "Debe seleccionar al menos un ingrediente";
            $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>" + error + "</div>");
        } else {
            if ($("input.nameAllergy").val() == " " || $("input.nameAllergy").val() == "") {
                $('div.error').empty();
                var error = "Debe ponerle un nombre a la alergia común";
                $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>" + error + "</div>");
            } else {
                var parameters = {
                    "allergyName": $("input.nameAllergy").val(),
                    "allergyType": "personal",
                    "allergyIngredients": checked,
                }

                $.ajax({
                    data: parameters,
                    url: "/addAllergyPersonal",
                    method: "POST",
                    dataType: "JSON",
                    success: function (response) {
                        if(response.correcto == true){
                            $('div.error').empty();
                            $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                            $('div.error').append("<script> setTimeout(function(){location.href = './list_allergys';}, 3000);</script>");

                        } else {
                            $('div.error').empty();
                            $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                        }
                    }
                });
            }
        }
    });

    //<---------------------------------------------  Añadir alergia comun -------------------------------------------------->

    $("button.addAllergyGlobal").click(function () {
        $('div.error').empty();
        var checked = [];
        $("input.allergyVal[type='checkbox']:checked").each(function () {
            checked.push(parseInt($(this).val()));
        });
        console.log(checked);
        if(checked.length == 0) {
            var error = "Debe seleccionar al menos un ingrediente";
            $('div.error').append(error);
        } else {
            var parameters = {
                "allergyArray" : checked,
            };

            $.ajax({
                data: parameters,
                url: "/addAllergyComun",
                method: "POST",
                dataType: "JSON",
                success: function (response) {
                    if(response.correcto == true){
                        $('div.error').empty();
                        $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                        $('div.error').append("<script> setTimeout(function(){location.href = './list_allergys';}, 3000);</script>");

                    } else {
                        $('div.error').empty();
                        $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                    }
                }
            });
        }
    });

    //<---------------------------------------------  Registrar Negocio -------------------------------------------------->

    $("button.registerM").click(function () {
        $('div.errorReport').empty();
    });

    $("button.registerCompany").click(function () {
        $('div.errorReport').empty();

        console.log($("input.imgCompany"));

        if($('input.reservationCompany').prop('checked') ) {
            var reservation = true;
        } else {
            var reservation = false;
        }
        if($('input.orderCompany').prop('checked') ) {
            var order = true;
        } else {
            var order = false;
        }

        var correcto = true;
        var errores = [];
        var error = "";
        $('div.errorReport').empty();
        if ($('input.nameCompany').val() == "" || $('input.nameCompany').val() == " ") {
            error = "No puede dejar el campo de nombre de empresa vacio.";
            errores.push(error);
            correcto = false;
        }
        if($('input.phone').val() == "" || $('input.phone').val() == " " || !(/^(\+34|0034|34)?[6|7|8|9][0-9]{8}$/.test($('input.phone').val()))) {
       // ^(\+34|0034|34)?[\s|\-|\.]?[6|7|8|9][\s|\-|\.]?([0-9][\s|\-|\.]?){8}$
            error = "No puede dejar el campo de teléfono vacio y no puede contener letras, prefijo seguido del número de teléfono sin espacios ni guiones.";
            errores.push(error);
            correcto = false;
        }
        if($('input.addressCompany').val() == "" || $('input.addressCompany').val() == " ") {
            error = "No puede dejar el campo de dirección vacio.";
            errores.push(error);
            correcto = false;
        }

        if($('select.country > option:selected').val() == "" || $('select.departament > option:selected').val() == "" || $('select.city > option:selected').val() == ""){
            error = "No se puede dejar pais, provincia o municipio sin seleccionar";
            errores.push(error);
            correcto = false;
        }

        if(! $('input.privacyCompany').prop('checked') ) {
            error = "Ha de acceptar la politica de privacidad para empresas.";
            errores.push(error);
            correcto = false;
        }

        if(!correcto) {
            var item = "";
            var contador = 0;

            errores.forEach(function () {
                item+="<a class='d-block m-1 alert alert-danger '>"+errores[contador]+"</a>";
                contador++
            });

            $('div.errorReport').append(item);

        } else {
            $('div.errorReport').empty();

            var parameters = {
                "nameCompany" : $('input.nameCompany').val(),
                "phone" : $('input.phone').val(),
                "addressCompany" : $('input.addressCompany').val(),
                "departamentCompany" : $("select.departamentCompany > option:selected").text(),
                "cityCompany": $("select.cityCompany > option:selected").text(),
                "privacyCompany" : true,
                "imgCompany": $("input.imgCompany").val(),
                "reservationCompany" : reservation,
                "orderCompany" : order,
            };

            console.log(parameters);
            $.ajax({
                data: parameters,
                url: "/registrationCompany",
                method: "POST",
                dataType: "JSON",
                success: function (response) {
                    if(response.correcto == true){
                        $('div.errorReport').empty();
                        $('div.errorReport').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                        $('div.errorReport').append("<script> setTimeout(function(){location.href = './empresas';}, 3000);</script>");

                    } else {
                        $('div.errorReport').empty();
                        $('div.errorReport').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                    }
                }
            });
        }
    });

    var idCompany = -1;

     $("button.goAddMenu").click(function () {
         $("div.errorReport").empty();
         idCompany = $(this).closest("div.padre").find("input.idCompany").val();
         console.log(idCompany);
            var company = parseInt(idCompany);
            console.log(company)
         var parametro = {
             "company": company
         };

         $.ajax({
             data: parametro,
             url: "/getPlatesCategories",
             method: "POST",
             dataType: "JSON",
             success: function (response) {
                 var contador = 0;
                 var contador2 = 0;
                 var content1 = "<option value='0' selected disabled> Seleccione una opcion.. </option>";

                    response["categories"].forEach(function () {
                        content1 += "<option value='" + response["categories"][contador].id + "'> " + response["categories"][contador].name + " </option>";
                        contador++
                    });

                    if(response["plates"].length != 0) {

                        var content2 = "<div class='row row-cols-3'>";
                        response["plates"].forEach(function () {

                            content2 += "<div class='platecheck col'><input type='checkbox' class='plates' value='" + response["plates"][contador2].id + "'/> " + response["plates"][contador2].name + "</div>";

                            contador2++;
                        });
                        content2 += "</div>";
                    } else {
                        var content2 = "Actualmente no tiene platos agregados que no esten asignados a una categoría";
                    }

                 $("select.categoryCompany").empty();
                 $("select.categoryCompany").append(content1);
                 $("div.plates").empty();
                 $("div.plates").append(content2);

                console.log(response);
             }
         });

     });

     $('button.registerMenu').click(function () {
         console.log("hola");
         $('div.errorMenu').empty();
         var checked = [];
         $("input.plates[type='checkbox']:checked").each(function () {
             checked.push(parseInt($(this).val()));
         });
         console.log(checked);
         if(checked.length == 0) {
             $("div.errorMenu").empty();
             var error = "Debe seleccionar al menos un plato";
             $('div.errorMenu').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>" + error + "</div>");
         } else {
             if($("select.categoryCompany > option:selected").val() == 0){
                 $("div.errorMenu").empty();
                 var error = "Debe seleccionar una categoría";
                 $('div.errorMenu').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>" + error + "</div>");
             } else {
                 var parameters = {
                     "categoryid": $("select.categoryCompany > option:selected").val(),
                     "plates": checked,
                 };

                 $.ajax({
                     data: parameters,
                     url: "/registrationMenu",
                     method: "POST",
                     dataType: "JSON",
                     success: function (response) {
                         if(response.correcto == true){
                             $('div.errorMenu').empty();
                             $('div.errorMenu').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                             $('div.errorMenu').append("<script> setTimeout(function(){location.href = './empresas';}, 3000);</script>");

                         } else {
                             $('div.errorMenu').empty();
                             $('div.errorMenu').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                         }
                     }
                 });
             }
         }
     });

    $("button.addCategoryCompany").click(function () {
        $("div.error").empty();
        if($("input.nameCategoryCompany").val() == "" || $("input.nameCategoryCompany").val() == " ") {
            var error = "No puede dejar el nombre de la categoria vacia";
            $("div.error").append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+error+"</div>");
        } else {
            var parameters = {
                "companyId": idCompany,
                "nameCategoryMenu" : $("input.nameCategoryCompany").val(),
            };

            $.ajax({
                data: parameters,
                url: "/registrationCategoryMenu",
                method: "POST",
                dataType: "JSON",
                success: function (response) {
                        if(response.correcto == true){
                            $('div.error').empty();
                            $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                            $('div.error').append("<script> setTimeout(function(){location.href = './empresas';}, 3000);</script>");

                        } else {
                            $('div.error').empty();
                            $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                        }
                }
            });
        }
    });

    $("button.addPlate").click(function () {
        $("div.error").empty();
        var checked = [];
        $("input[type='checkbox']:checked").each(function () {
            checked.push(parseInt($(this).val()));
        })
        console.log(checked);
        if(checked.length == 0) {
            $("div.error").empty();
            var error = "Debe seleccionar al menos un ingrediente";
            $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>" + error + "</div>");
        } else {
            if ($("input.namePlate").val() == "" || $("input.namePlate").val() == " ") {
                $("div.error").empty();
                var error = "No puede dejar el nombre del plato vacia";
                $("div.error").empty();
                $("div.error").append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>" + error + "</div>");
            } else {
                if ($("input.price").val() == "" || $("input.price").val() == " " || !(/^\d*\.?\d*$/.test($("input.price").val()))) {
                    $("div.error").empty();
                    var error = "Ha de meter un número decimal o entero";
                    $("div.error").empty();
                    $("div.error").append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>" + error + "</div>");
                } else {
                        var parameters = {
                            "namePlate": $("input.namePlate").val(),
                            "price": parseFloat($("input.price").val()),
                            "idCompany": idCompany,
                            "plateIngredients": checked,
                        };

                        $.ajax({
                            data: parameters,
                            url: "/addPlate",
                            method: "POST",
                            dataType: "JSON",
                            success: function (response) {
                                if(response.correcto == true){
                                    $('div.error').empty();
                                    $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                                    $('div.error').append("<script> setTimeout(function(){location.href = './empresas';}, 3000);</script>");

                                } else {
                                    $('div.error').empty();
                                    $('div.error').append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                                }
                            }
                        });
                    }
            }
        }
    });

    var indice = [];

    var searchParameter = {
      "city": $("input.usercity").val(),
      "departament": $("input.userdepartament").val(),
    };

    $.ajax({
        data: searchParameter,
        url: "/getCompanies",
        method: "POST",
        dataType: "JSON",
        success: function (response) {
            console.log(response);
           indice = getIndiceCompany(response , 3);
            drawCompanies(indice[0], $("div.container-restaurants"));
           console.log(indice);
            actionButtonsPagination(indice, 0);
        }
    });

    $("body").on("click", "button.menuView", function () {
        var parameterMenu = {
            "id": $(this).parent().parent().find("input.idCompany").val(),
        };
        $.ajax({
            data: parameterMenu,
            url: "/getMenu",
            method: "POST",
            dataType: "JSON",
                success: function (response) {
                    console.log(response);
                    var contador = 0;
                    var contador2 = 0;
                    var contador3 = 0;
                    var content = "";
                    response.forEach(function () {
                       content += "<div class='col-lg-12 d-flex'>" +
                                  "<div class='category'>" +
                                    "<h5>"+response[contador].nameCategory+"</h5>";
                                 contador2 = 0;
                        console.log(Object.keys(response[contador].plates[contador2]).length);
                                if(Object.keys(response[contador].plates[contador2]).length == 3) {

                                    response[contador].plates.forEach(function() {

                                        content +=  "<p class='text-danger mb-1'>"+response[contador].plates[contador2].namePlate+"................"+response[contador].plates[contador2].pricePlate+"€ </p>";
                                            if(Object.keys(response[contador].plates[contador2].found[contador3]).length != 0) {
                                                content += "<label class='text-danger'> contiene: ";
                                            contador3 = 0;
                                                response[contador].plates[contador2].found.forEach(function() {
                                                    content += response[contador].plates[contador2].found[contador3]+", ";
                                                    contador3++;
                                                });
                                            content += "</label>";
                                            }
                                    });
                                } else {
                                    content +=  "<p>"+response[contador].plates[contador2].namePlate+"................"+response[contador].plates[contador2].pricePlate+"€ </p>"
                                }

                        content += "</div></div>";
                        contador2++;
                    });
                    $("div.menu-container").empty();
                    $("div.menu-container").append(content);
            }

        });

    });

});

function addNewIngredient(){
        $("div.error").empty();
        console.log($("input.nameIngredient").text());
    if($("input.nameIngredient").val() === "" || $("input.nameIngredient").val() === " ") {
        $("div.error").append("<div class='col-lg-12 mt-0 text-center alert alert-danger'> No se puede dejar el nombre vacio o con espacios en blanco.</div>");
        return;
    } else {
        if($("select.catIngredient > option:selected").val() === 0) {
            $("div.error").append("<div class='col-lg-12 mt-0 text-center alert alert-danger'> Ha de seleccionar una categoria. </div>");
        return;
        } else {
            var parameters = {
                "nameIngredient" : $("input.nameIngredient").val(),
                "categoryIngredient" : $("select.catIngredient").val()
            };

            $.ajax({
                data:parameters,
                url: "/addIngredient",
                method: "POST",
                dataType:"JSON",
                success: function (response) {
                    console.log(response);
                    if(response.correcto == true){
                        $("div.error").append("<div class='col-lg-12 mt-0 text-center alert alert-info'>"+ response.info +"</div>");
                    } else {
                        $("div.error").append("<div class='col-lg-12 mt-0 text-center alert alert-danger'>"+ response.info +"</div>");
                    }
                }
            });
            console.log(parameters);
        }
    }
}


//paginacion

/// Este metodo crea un array apartir del original para dividirlo por el numero de elementos que deseas mostrar//
function getIndiceCompany(companys , nItems) {
    var contador = 0;
    var nCompanies = companys.length;//logitud de cursos en el array
    var nCompaniesPage = nItems; //numero de cursos que quiero paginar


    if(nCompanies%nCompaniesPage == 0) { //si el resto es 0
        var nPages = nCompanies/nCompaniesPage;
        var isInt = true;
    } else {
        var nPages = parseInt(nCompanies/nCompaniesPage);
        var rest = nCompanies%nCompaniesPage;
        var isInt = false;
    }

    var indice = [];
    var inicio = 0;
    var final = nItems;

    while(contador != nPages) {
        var page = [];
        var i = inicio;
        for(i ; i < final; i++) {
            page.push(companys[i]);
        }
        indice.push(page);
        inicio=inicio + nItems;
        final=final + nItems;
        contador++
    }

    if(!isInt) {

        var y = (companys.length - rest)
        var page = [];
        for( y; y < companys.length; y++){
            page.push(companys[y]);
        }
        indice.push(page);
    }

    return indice;

}

// Este metodo dibuja los elementos del array que contiene el indice seleccionado
// (( modificar este metodo para cambiar el diseño de los elementos generados))//
function drawCompanies(arrayItems, container) {
    var contador = 0;
    var contenido = "<div class='row'><div class='d-flex flex-wrap containerFlex col-lg-12'>";

    container.empty();

        arrayItems.forEach(function () {
            if (arrayItems[contador].image == "" || arrayItems[contador].image == null || arrayItems[contador].image == " ") {
                var imagen = "ensalada.jpg";
            } else {
                var imagen = arrayItems[contador].image;
            }

            var company = {
                'id': arrayItems[contador].id,
                'name': arrayItems[contador].name,
                'imagen': imagen,
                'address': arrayItems[contador].address,
                'city': arrayItems[contador].company_city,
                'provincia': arrayItems[contador].company_departament
            }

            console.log(company);

            contenido += "<div class='col-lg-4 col-md-6 col-sm-12 col-12'>" +
                                "<div class='item1 col-lg-10 col-md-10 col-sm-9 col-9 mx-auto my-1 border border-secondary rounded p-0 shadow-lg' style='cursor: pointer;'> " +
                                     "<div class='m-0'><h6 class='p-1 text-white bg-personal font-weight-bold'>" + company['name'] + "</h6></div>" +
                                      "<div class='col-lg-10 mx-auto px-0 my-4'>" +
                                         "<img class='rounded img-shadow mx-0 col-lg-12' src='" + imagen + "'/>" +
                                     "</div>" +
                                     "<div class='my-1 ml-2'>" +
                                         "<a class='font-weight-bold mr-1'>Direccion:</a>" + company.address +
                                    "</div>" +
                                    "<div class='my-1 ml-2'>" +
                                         "<a class='font-weight-bold mr-1'>Ciudad:</a>" + company.city +
                                    "</div>" +
                                    "<div class='my-1 ml-2'>" +
                                       "<a class='font-weight-bold mr-1'>provincia:</a>" + company.provincia +
                                    "</div>" +
                                     "<div class='col-lg-12 d-flex my-3'> " +
                                     "<input type='hidden' class='idCompany' value='"+ company.id +"'>" +
                                    "<div class='col-lg-6 col-md-6 col-sm-6 col-6'>" +
                                         "<button type='button' class='btn bg-blue-buttons text-white mx-auto menuView' data-toggle='modal' data-target='#menu'>Ver carta</button>" +
                                    "</div>" +
                                    "<div class='col-lg-6 col-md-6 col-sm-6 col-6'>" +
                                         "<button type='button' class='btn bg-blue-buttons text-white mx-auto'>Comentar</butto>" +
                                    "</div></div>" +
                "</div></div>";

            contador++;
        });
        contenido += "</div></div>"
        container.append(contenido);



}

// Este metodo da funcionalidades a los botonnes boostrap de paginacion insertando el array  a mostrar //
function actionButtonsPagination(indice, valorInicial) {

    var contenido = "<ul class='pagination'>"+
        "<li class='page-item'><a class='page-link firstPage' href='#'>1ª. página</a></li>"+
        "<li class='page-item'>"+
        "<a class='page-link previus' href='#' aria-label='Previous'>"+
        "<span aria-hidden='true'>&laquo;</span>"+
        "<span class='sr-only'>Previous</span>"+
        "</a>"+
        "</li>"+
        "<li class='page-item'><a class='page-link first' href='#'>1</a></li>"+
        "<li class='page-item'><a class='page-link second' href='#'>2</a></li>"+
        "<li class='page-item'><a class='page-link third' href='#'>3</a></li>"+
        "<li class='page-item'>"+
        "<a class='page-link next' href='#' aria-label='Next'>"+
        "<span aria-hidden='true'>&raquo;</span>"+
        "<span class='sr-only'>Next</span>"+
        "</a>"+
        "</li>"+
        "<li class='page-item'><a class='page-link lastPage' href=''#'>Últ. página</a></li>"+
        "</ul>";

    $('nav.pagination').empty();
    $('nav.pagination').append(contenido);

    var value = valorInicial;

    if(value == 1){
        $('a.previus').closest('li').hide(15);
    }

    if( indice.length < 3) {
        $('a.third').closest('li').hide(15);
        $('a.firstPage').closest('li').hide(15);
        $('a.lastPage').closest('li').hide(15);
        if(indice.length < 2) {
            $('a.next').closest('li').hide(15);
            $('a.second').closest('li').hide(15);
            $('a.first').addClass('selected');
        } else {
            $('li > a.first').on("click", function (e) {
                $('a').removeClass('selected');
                e.preventDefault();
                value = 1;
                $('a.previus').closest('li').hide(15);
                $('a.next').closest('li').show(15);
                $('a.first').addClass('selected');
                drawCompanies(indice[value-1], $('div.container-Companies'));
            });

            $('li > a.second').on("click", function (e) {
                $('a').removeClass('selected');
                e.preventDefault();
                value = 2;
                $('a.previus').closest('li').show(15);
                $('a.next').closest('li').hide(15);
                $('a.second').addClass('selected');
                drawCompanies(indice[value-1], $('div.container-Companies'));
            });

            $('li > a.previus').on("click", function (e) {
                $('a').removeClass('selected');
                e.preventDefault();
                value = 1;
                $('a.previus').closest('li').hide(15);
                $('a.next').closest('li').show(15);
                $('a.first').addClass('selected');
                drawCompanies(indice[value-1], $('div.container-Companies'));

            });

            $('li > a.next').on("click", function (e) {
                $('a').removeClass('selected');
                e.preventDefault();
                value = 2;
                $('a.previus').closest('li').show(15);
                $('a.next').closest('li').hide(15);
                $('a.second').addClass('selected');
                drawCompanies(indice[value-1], $('div.container-Companies'));

            });

        }
    } else {

        // Con estos click le damos la funcionalidad a los botones de paginación de boostrap //
        $('li > a.first').on("click", function (e) {
            console.log(value);
            $('a').removeClass('selected');
            e.preventDefault();
            $('a.next').closest('li').show(15);
            value = parseInt($(this).text());
            if(value == 1) {
                $('a.previous').closest('li').hide(15);
            }
            $('a.first').addClass('selected');
            drawCompanies(indice[value-1], $('div.container-Companies'));
        });

        $('li > a.second').on("click", function (e) {
            console.log(value);
            e.preventDefault();
            $('a.previus').closest('li').show(15);
            $('a.next').closest('li').show(15);
            if(!$('a.second').hasClass('selected')) {
                $('a').removeClass('selected');
                var valor = parseInt($(this).text());
                if(value!=valor) {
                    value = valor;
                    $('a.second').addClass('selected');
                    drawCompanies(indice[value-1], $('div.container-Companies'));
                }
            }
        });

        $('li > a.third').on("click", function (e) {
            console.log(value);
            $('a').removeClass('selected');
            e.preventDefault();
            $('a.previus').closest('li').show(15);
            value = parseInt($(this).text());
            if(value == indice.length) {
                $('a.next').closest('li').hide(15);
            }
            $('a.third').addClass('selected');
            drawCompanies(indice[value-1], $('div.container-Companies'));
        })

        $('li > a.firstPage').on("click", function (e) {
            console.log(value);
            $('a').removeClass('selected');
            e.preventDefault();
            if (value == indice.length){
                $('a.next').closest('li').show(15);
            }
            value = 1;
            $('a.previus').closest('li').hide(15);

            $('a.second').empty();
            $('a.second').append(2);
            $('a.first').empty();
            $('a.first').append(value);
            $('a.third').empty();
            $('a.third').append(3);
            $('a.first').addClass('selected');
            $('a.firstPage').addClass('selected');
            drawCompanies(indice[value-1], $('div.container-Companies'));
        });

        $('li > a.lastPage').on("click", function (e) {
            console.log(value);
            $('a').removeClass('selected');
            e.preventDefault();

            if (value == 1) {
                $('a.previus').closest('li').show(15);
            }
            value = indice.length;
            $('a.next').closest('li').hide(15);
            var valueprev = value-1;
            var valueprevprev = value -2;
            $('a.second').empty();
            $('a.second').append(valueprev);
            $('a.first').empty();
            $('a.first').append(valueprevprev);
            $('a.third').empty();
            $('a.third').append(value);
            $('a.third').addClass('selected');
            $('a.lastPage').addClass('selected');
            drawCompanies(indice[value-1], $('div.container-Companies'));
        });

        $('li > a.previus').on("click", function (e) {
            console.log(value);
            $('a').removeClass('selected');
            e.preventDefault();
            if (value == indice.length && indice.length >= 1) {
                $('a.next').closest('li').show(15);
            }
            if(value == 2) {
                $('a.first').addClass('selected');
                value = value - 1;
                $('a.previus').closest('li').hide(15);
                drawCompanies(indice[value-1], $('div.container-Companies'));
            } else {
                if(indice.length > 3) {
                    value = value -1;
                    var valorPrev = value - 1;
                    var valorNext = value + 1;
                    $('a.second').empty();
                    $('a.second').append(value);
                    $('a.second').addClass('selected');
                    $('a.first').empty();
                    $('a.first').append(valorPrev);
                    $('a.third').empty();
                    $('a.third').append(valorNext);
                    drawCompanies(indice[value-1], $('div.container-Companies'));
                }
            }

        });

        $('li > a.next').on("click", function (e) {
            console.log(value);
            $('a').removeClass('selected');
            e.preventDefault();
            if(value == 1 && indice.length > 1) {
                value = value+1
                $('a.previus').closest('li').show(15);
                $('a.second').addClass('selected');
                drawCompanies(indice[value-1], $('div.container-Companies'));
            } else {
                if(value === (indice.length-1)) {
                    console.log(indice.length);
                    console.log(value);
                    $('a.next').closest('li').hide(15);
                    value = indice.length;
                    $('a.third').addClass('selected');
                    drawCompanies(indice[value-1], $('div.container-Companies'));
                }else{
                    value = value + 1;
                    var valorPrev = value - 1;
                    var valorNext = value + 1;
                    $('a.second').empty();
                    $('a.second').append(value);
                    $('a.second').addClass('selected');
                    $('a.first').empty();
                    $('a.first').append(valorPrev);
                    $('a.third').empty();
                    $('a.third').append(valorNext);
                    drawCompanies(indice[value-1], $('div.container-Companies'));
                }
            }

        });

    }
}