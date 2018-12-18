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

    function saveAlgorithm(algorithm) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + "/save-algorithm",
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                algorithm: algorithm
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error saving algorithm: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when adding new algorithm:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        console.log('Response received from API: ', result);
        window.location.href = 'workspace.html';
    }

    function handleSaveClick(event) {
        var elm = [];
        var elms = document.getElementById("right-copy-1tomany").getElementsByTagName("*");
        for (var i = 0; i < elms.length; ++i) {
            elm = elm + ' ' + elms[i].id;
        }
        event.preventDefault();
        saveAlgorithm(elm);
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#save-alg-btn').click(handleSaveClick);
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
