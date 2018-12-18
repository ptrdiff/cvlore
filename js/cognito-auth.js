/*global CVLore _config AmazonCognitoIdentity AWSCognito*/

var CVLore = window.CVLore || {};

(function scopeWrapper($) {
    var authorizationUrl = '/authorization.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
        _config.cognito.userPoolClientId &&
        _config.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    CVLore.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    CVLore.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });


    /*
     * Cognito User Pool functions
     */

    function registration(email, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(email, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    function authorization(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function verification(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#authorizationForm').submit(handleAuthorization);
        $('#registrationForm').submit(handleregistration);
        $('#verificationForm').submit(handleVerification);
    });

    function handleAuthorization(event) {
        var email = $('#emailInputAuthorization').val();
        var password = $('#passwordInputAuthorization').val();
        event.preventDefault();
        authorization(email, password,
            function authorizationSuccess() {
                console.log('Successfully Logged In');
                window.location.href = 'workspace.html';
            },
            function authorizationError(err) {
                alert(err);
            }
        );
    }

    function handleregistration(event) {
        var email = $('#emailInputRegistration').val();
        var password = $('#passwordInputRegistration').val();
        var password2 = $('#password2InputRegistration').val();

        var onSuccess = function registrationSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'verification.html';
            }
        };
        var onFailure = function registrationFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            registration(email, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }

    function handleVerification(event) {
        var email = $('#emailInputVerification').val();
        var code = $('#codeInputVerification').val();
        event.preventDefault();
        verification(email, code,
            function verificationSuccess(result) {
                console.log('call result: ' + result);
                console.log('Successfully verified');
                alert('Verification successful. You will now be redirected to the login page.');
                window.location.href = authorizationUrl;
            },
            function verificationError(err) {
                alert(err);
            }
        );
    }
}(jQuery));

/*global CVLore _config*/
