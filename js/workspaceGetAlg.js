/*global CVLore _config*/

var CVLore = window.CVLore || {};

(function cvloreWrapper($) {
    var authToken;
    CVLore.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = 'authorization.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = 'authorization.html';
    });

    function getAlgorithms() {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/get-algorithms',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error getting algorithms: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when getting algorithms:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        var text = "";
        var i = 0;
        result.forEach(function(element) {
            text += "<div id='id" + i + "'>" + element.Algorithm + "</div>";
            i += 1;
        });
        text += "";
        document.getElementById("algorithmsBox").innerHTML = text;
    }

    $(function onDocReady() {
        getAlgorithms();
        $('#logout-btn').click(function() {
            CVLore.signOut();
            alert("You have been signed out.");
            window.location = "authorization.html";
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });
}(jQuery));