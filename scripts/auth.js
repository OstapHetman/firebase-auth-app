// add admin cloud function
const adminForm = document.querySelector(".admin-actions");

adminForm.addEventListener("submit", e => {
  e.preventDefault();
  const adminEmail = document.querySelector("#admin-email").value;
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminEmail }).then(res => {
    console.log(res);
  });
});

// listen for auth status changes
auth.onAuthStateChanged(user => {
  // console.log(user);
  if (user) {
    user.getIdTokenResult().then(idToken => {
      user.admin = idToken.claims.admin;
      setupUI(user);
    });
    // get data
    db.collection("guides").onSnapshot(
      snapshot => {
        setupGuides(snapshot.docs);
      },
      err => {
        console.log(err.message);
      }
    );
  } else {
    setupUI();
    setupGuides([]);
  }
});

// Create new Guide
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", e => {
  e.preventDefault;

  db.collection("guides")
    .add({
      title: createForm["title"].value,
      content: createForm["content"].value
    })
    .then(() => {
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch(err => {
      console.log(err.message);
    });
});

// signup
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", e => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const bio = signupForm["signup-bio"].value;

  // sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({
          bio: bio
        });
    })
    .then(() => {
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch(err => {
      signupForm.querySelector(".error").innerHTML = err.message;
    });
});

// logout method
const logout = document.querySelector("#logout");

logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("User signed out");
  });
});

// loging
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", e => {
  e.preventDefault();

  // get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // sign up the user
  auth
    .signInWithEmailAndPassword(email, password)
    .then(cred => {
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector(".error").innerHTML = "";
    })
    .catch(err => {
      loginForm.querySelector(".error").innerHTML = err.message;
    });
});
