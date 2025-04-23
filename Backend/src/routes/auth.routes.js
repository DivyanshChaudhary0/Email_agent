
import { Router } from "express";
import axios from 'axios';
import config from '../config/config.js';
import querystring from 'querystring';
const router = Router();

router.get('/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is missing' });
    }

    try {
        const tokenEndpoint = 'https://oauth2.googleapis.com/token';
        const tokenRequestData = {
            code,
            client_id: config.GOOGLE_CLIENT_ID,
            client_secret: config.GOOGLE_CLIENT_SECRET,
            redirect_uri: "postmessage",
            grant_type: 'authorization_code'
        };

        console.log('Making token request to Google with redirect_uri:', config.GOOGLE_REDIRECT_URI);

        const tokenResponse = await axios.post(
            tokenEndpoint,
            querystring.stringify(tokenRequestData),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, refresh_token, id_token } = tokenResponse.data;

        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userProfile = profileResponse.data;

        res.status(200).json({
            message: 'Authentication successful',
            tokens: { access_token, refresh_token },
            profile: userProfile
        });

    } catch (error) {
        console.error('OAuth error details:', error.response?.data || error.message);
        if (error.response?.config) {
            console.error('Request URL:', error.response.config.url);
            console.error('Request method:', error.response.config.method);
        }
        res.status(500).json({ error: 'Authentication failed' });
    }
});

export default router;