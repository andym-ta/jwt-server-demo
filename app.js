const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const jwt = require('jsonwebtoken');
const jwksClient = require("jwks-rsa")
require('dotenv').config()

const cors = require('cors');

app.use(cors()); //Allowing CORS for demo purposes, implement proper whitelisting
app.use(express.json());

app.post('/jwt', async (req, res) => { // Make this function async
    console.log('Received JWT request');
    console.log('req.body: ', req.body);

    const hcToken = req.headers.authorization.split(' ')[1]; // Extract the HC JWT from the request

    // Initialise the jwks client and get the public keys
    const jwksClientInstance = jwksClient({
        jwksUri: `https://${process.env.ZENDESK_DOMAIN}.zendesk.com/api/v2/help_center/integration/keys.json`
        /* Returns a set of help center JSON web keys (JWKs) for the Zendesk account
         * Each JWK contains the components needed to construct the public signing key for the matching help center JWT's
         * signature. Use the kid in the JWT's header to find the matching JWK
         */
    });

    const verifyToken = async (token) => {
        /*
        * Using the public key verify the token
        */
        const publicKey = await getPublicKeyFromJwks(jwt.decode(token, { complete: true }));
        return jwt.verify(token, publicKey);
    };

    const getPublicKeyFromJwks = async (decodedToken) => {
        /*
         * Extracts the KID from the HC JWT and finds matching public key
         */
        const kid = decodedToken.header.kid;
        const signingKey = await jwksClientInstance.getSigningKey(kid);
        console.log('Public Key: ', signingKey.rsaPublicKey);
        return signingKey.rsaPublicKey;
    };

    try {
        /************************************************************
         *  Step 1: Validate JWT received from Help Center
         * **********************************************************/

        const verifiedToken = await verifyToken(hcToken); // Wait for the token verification to complete

        console.log('verified token: ', verifiedToken);

        const messagingJWT = {
            name: req.body.name,
            //If no external ID is present, use the users email address as external ID
            external_id: verifiedToken.externalId ? verifiedToken.externalId : verifiedToken.email,
            email: verifiedToken.email,
            email_verified: true,
            scope: 'user'
        };

        console.log('New messaging JWT: ', messagingJWT);

        /************************************************************
         *  Step 2: Sign new Messaging JWT and return to Help Center
         * **********************************************************/
        const signedMessagingToken = jwt.sign(
            messagingJWT,
            process.env.MESSAGING_AUTH_KEY,
            {
                header: { kid: process.env.MESSAGING_AUTH_ID }
            }
        );

        // Return the signed JWT to the Help Center for Messaging Authentication
        console.log('signedMessagingToken', signedMessagingToken);

        res.json(signedMessagingToken);

    } catch (error) {
        console.error('Error verifying token:', error);

        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.listen(port, () => {
    console.log(`jwt server listening on port ${port}`)
})