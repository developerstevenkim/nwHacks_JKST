// This javascript file should be referenced by all the html files except for launch and login
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("User is signed in.");
        document.getElementById("loginbtn").style.display = "none";
    } else {
        // No user is signed in.
        console.log("User is not signed in.");
        location.href = '../index.html';
    }
});

function showName() {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user.displayName);
        document.getElementById("welcome").innerHTML = "Welcome back," + user.displayName + "!";
    })
}

showName();