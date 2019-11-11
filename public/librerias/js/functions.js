$(function () {
    $('select.country').on('change', function () {
        var parameters = {
            "country": $('select.country').val()
        };
        console.log(parameters)
        $.ajax({
            data: parameters,
            method: "POST",
            url: "/getDepartaments",
            dataType: "JSON",
            successs: function (response) {
                console.log(response);
            }
        });
    });
});