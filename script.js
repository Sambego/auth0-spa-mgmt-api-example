import createAuth0Client from "./node_modules/@auth0/auth0-spa-js/dist/auth0-spa-js.production.esm.js";

(async() => {
  const button = document.querySelector("button");
  const auth0 = await createAuth0Client({
    domain: "sambego.eu.auth0.com",
    client_id: "gkWZCFjychRhfsVTXvY8dCF6uQkkNx9y",
    redirect_uri: "http://localhost:8080",
    audience: "https://sambego.eu.auth0.com/api/v2/",
    scope: "profile email update:users update:users_app_metadata update:current_user_metadata read:current_user create:current_user_metadata"
  });
  
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    
    try {
      await auth0.loginWithPopup();
      const user = await auth0.getUser();
      const token = await auth0.getTokenSilently();
      console.log("User:", user);
      console.log("Success, heres your token:", token);
      
      try {
        const response = fetch(`https://sambego.eu.auth0.com/api/v2/users/${user.sub}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorize': `Bearer ${token}`
          },
          body: JSON.stringify({
            user_metadata: {
              foo: 'bar'
            }
          }) 
        });

        console.log(response);
      } catch(error) {
        console.error(error);
      }

    } catch (error) {
      console.error(error);
    }
  });  
})();

