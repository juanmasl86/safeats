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

    // <-------------------------------------  Perfil en modal -------------------------------------->

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
    })

    $('div.favorites-title').click(function () {
        $('div.favorites').slideToggle(200);
        if($(this).hasClass("up")) {
            $(this).removeClass("up");
            $('img.favorites').attr("src", "minus.png");
        } else {
            $(this).addClass("up");
            $('img.favorites').attr("src", "plus.png");
        }
    })
});