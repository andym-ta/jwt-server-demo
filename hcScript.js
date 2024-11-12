//-------------------------------------------
//  HC Token Messaging JWT
//-------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const variables = {
        //Update this to your jwt server url
        backendURL: 'https://c40e-13-55-49-175.ngrok-free.app/jwt',
    }

    //Returns true only if the users role is not anonymous
    const signedIn = HelpCenter.user.role !== 'anonymous'

    //*************************
    // Step 1: HelpCentre Token Retrieval & Refresh
    //*************************
    const getHcToken = async () => {
        //Check if token is expired, if so retrieve a new one, otherwise get form local storage
        return isTokenExpired(localStorage.jwt)
            ? await fetchHcToken()
            : JSON.parse(localStorage.jwt).value
    }
    const isTokenExpired = (token) => {
        //Return true if no token exists, or the current token is expired
        return !token || Date.now() > JSON.parse(token).expiresAt
    }
    const fetchHcToken = async () => {
        //Fetches the token from the HC New Token endpoint
        const { token } = await fetch("/api/v2/help_center/integration/token").then(
            response => response.json()
        )
        setToken("jwt", token, 1)
        return token
    }
    const setToken = (key, value, ttl) => {
        //Set the token and time-to-live (1 second from now) in localStorage
        const data = { value, expiresAt: Date.now() + ttl * 1000 }
        localStorage.setItem(key, JSON.stringify(data))
    }

    //*************************
    // Step 2: Backend JWT Request
    //*************************
    const getBackendJWT = async () => {
        const hcToken = await getHcToken();
        console.log('hcToken: ', await hcToken);

        const response = await fetch(variables.backendURL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${hcToken}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": true //Only required for ngrok tunnelling
            },
            body: JSON.stringify({"name": HelpCenter.user.name})
        });

        console.log('Response Status: ', response.status);
        return await response.json();
    }

    //*************************
    // Step 3: Widget Login
    //*************************
    const widgetLogin = async () => {
        //Pass the HC token to be verified with response including new Messaging JWT
        const signedJWT = await getBackendJWT()

        //Use the new JWT to login to Zendesk Messaging
        zE("messenger", "loginUser", function (callback) {
            callback(signedJWT)
        })
    }

    if (signedIn) {
        widgetLogin()
    }
})