// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      // Other config options...
  });


var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {

            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            var user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) {
                db.collection("users").doc(user.uid).set({
                        name: user.displayName,
                        email: user.email,
                        points: 0
                    }).then(function () {
                        console.log("New user added to firestore");
                        window.location.assign("index.html");
                    })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {
                return true;
            }
            return false;
        },
        uiShown: function () {

            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },

    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],

    // Terms of service url.
    tosUrl: 'index.html', // temporary

    // Privacy policy url.
    privacyPolicyUrl: 'index.html',  // temporary
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);