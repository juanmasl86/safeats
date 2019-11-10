$(function () {
    $('select.country').on('change', function () {

        var parameters = {
            "country": $('select.country').val()
        };
        console.log(parameters)
        $.ajax()({
            data: parameters,
            method: "POST",
            url: "/getDepartament",
            dataType: "JSON",
            successs: function (response) {
                console.log(response);
            }
        });
    });
});