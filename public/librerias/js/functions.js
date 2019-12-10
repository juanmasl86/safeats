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
           $('div.errorEdit').append("<div class='col-lg-12 my-3 alert alert-danger'>Pero que haces GILIPOLLAS!!!</div>")
           console.log("Pero que haces GILIPOLLAS!!!");
       } else {
            if($("input.role").val() == "ROLE_SUPER_USER" || $("input.role").val() == "ROLE_ADMIN") {
                if($('select.country > option:selected').val() == 0 && ($('input.postalCode').val() == "" || $('input.postalCode').val() == " ") && ($('input.address').val() == "" || $('input.address').val() == " ") && ($('input.lastname').val() == "" || $('input.lastname').val() == " ") && ($('input.name').val() == "" || $('input.name').val() == " ")) {
                    $('div.errorEdit').append("<div class='col-lg-12 my-3 alert alert-danger'>Pero que haces GILIPOLLAS!!!</div>")
                    console.log("Pero que haces GILIPOLLAS!!!");
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
            var error = "Debe seleccionar al menos un ingrediente";
            $('div.error').append(error);
        } else {
            if ($("input.nameAllergy").val() == " " || $("input.nameAllergy").val() == "") {
                var error = "Debe ponerle un nombre a la alergia común";
                $('div.error').append(error);
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
         idCompany = $(this).closest("div.padre").find("input.idCompany").val();
         console.log(idCompany);
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