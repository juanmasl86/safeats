$(function() {
    $('select.country').on('change',function() {

        var parameters = $('select.country').val();
        console.log(parameters)
        $.ajax({
            data: parameters,
            type: "POST",
            url: "/getProvincias",
            dataType: "JSON",
            successs: function(result){
                var item = "<select class='form-control departament'></select>"
                $("div.addSelects").append(item);
            }
        });
    });
});