/*
 *
 * login-register modal
 * Author: Creative Tim
 * Web-author: creative.tim
 * Web script: http://creative-tim.com
 * 
 */

// Ensure FB is initialized before calling FB related functions
function checkFBInit() {
    if (typeof FB !== 'undefined') {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    } else {
        setTimeout(checkFBInit, 100); // Check every 100 milliseconds
    }
}


function showRegisterForm() {
    $('.loginBox').fadeOut('fast', function() {
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast', function() {
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    });
    $('.error').removeClass('alert alert-danger').html('');
}

function showLoginForm() {
    $('#loginModal .registerBox').fadeOut('fast', function() {
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast', function() {
            $('.login-footer').fadeIn('fast');
        });
        $('.modal-title').html('Login with');
    });
    $('.error').removeClass('alert alert-danger').html('');
}

function openLoginModal() {
    showLoginForm();
    setTimeout(function() {
        $('#loginModal').modal('show');
    }, 230);
}

function openRegisterModal() {
    showRegisterForm();
    setTimeout(function() {
        $('#loginModal').modal('show');
    }, 230);
}

function facebookLogin() {
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Welcome! Fetching your information.... ');
            // Access token retrieved here
            const accessToken = response.authResponse.accessToken;
            console.log('Access Token:', accessToken);
            
            // Now send the accessToken to your server
            sendTokenToServer(accessToken);
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'email,public_profile', return_scopes: true});
}

async function sendTokenToServer(facebookToken) {
    try {
        const response = await fetch('https://shop.cyberlearn.vn/api/Users/facebooklogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ facebookToken })
        });

        if (response.ok) {
            console.log('Token successfully sent to the server, handling user session...');
            // Handle successful authentication here, e.g., redirect or load user data
        } else {
            console.log('Failed to authenticate with our server using the Facebook token.');
        }
    } catch (error) {
        console.error('An error occurred while sending the Facebook token to the server:', error);
    }
}


async function loginAjax() {
    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://shop.cyberlearn.vn/api/Users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            window.location.replace("/home");
        } else {
            shakeModal();
        }
    } catch (error) {
        showError('An error occurred. Please try again.');
    }
}

async function registerAjax() {
    const username = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('https://shop.cyberlearn.vn/api/Users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            openLoginModal();
        } else {
            showError('Registration failed. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again.');
    }
}

function shakeModal() {
    $('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
    $('input[type="password"]').val('');
    setTimeout(function() {
        $('#loginModal .modal-dialog').removeClass('shake');
    }, 1000);
}

function showError(message) {
    $('.error').addClass('alert alert-danger').html(message);
}
