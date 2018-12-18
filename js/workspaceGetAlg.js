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

    export function createListOfAlgorithm(data) {
        var text = "";
        var i = 0;
        data.forEach(function(element) {
            if(element.Algorithm){
                let strElement = element.Algorithm.replace(/ {2}/g, ' ');
                text += "<div id='id" + i + "'>" + strElement + "</div>";
                i += 1;
            }
        });
        text += "";
        return text;
    }


    function completeRequest(result) {
        document.getElementById("algorithmsBox").innerHTML = createListOfAlgorithm(result);
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

    module.exports = {
        createListOfAlgorithm: createListOfAlgorithm,
    };
}(jQuery));
