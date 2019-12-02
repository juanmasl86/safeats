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
                var items = "<option value='' selected disabled>Seleciona una provincia...</option>";
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

                var items ="<option value='' selected disabled>Seleciona una localidad...</option>";
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

        if($('select.country').val() == "" || $('select.departament').val() == "" || $('select.city').val() == ""){
            error = "No se puede dejar pais, provincia o municipio sin seleccionar";
            errores.push(error);
            correcto = false;
        }

        if(!correcto) {
            var item = "";
            var contador = 0;

            errores.forEach(function () {
               item+="<a class='d-block m-1'>"+errores[contador]+"</a>";
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

    // <------------------------------------- Funciones Menu ADMIDNISTRACION -------------------------------------->

    // <---------------- agregar alergia ------------------->
    $('div.adminAddAllergy').click(function () {
        $('section').empty();

        var content = "<h3 class='text-center my-5'>Agregar alergia común</h3>" +
                      "<div class='error my-2 mx-1'></div>" +
                      "<input type='text' class='form-control nameAllergy' placeholder='Escribe nombre de la alergia..'/> " +
                      "<input type='hidden' class='typeAllergy' value='comun'/>";
        $('section').append(content);
    });

    // <---------------- agregar alimento ------------------->
    $('div.adminAddIngredient').click(function () {
        $('section').empty();
        var user = "{{ user.name }}";
        var content = "<h3 class='text-center my-5'>Agregar alimento</h3>" +
            "<div class='error my-2 mx-1'></div>" +
            "<div class='col-lg-7 mx-auto'> " +
                "<input type='text' class='form-control nameIngredient' placeholder='Escribe nombre del alimento..'/> " +
                "<select class='form-control my-3'>" +
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

});