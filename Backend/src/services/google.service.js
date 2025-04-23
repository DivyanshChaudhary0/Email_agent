import { google } from "googleapis";
import userModel from "../models/user.model.js";
import config from "../config/config.js";

const CLIENT_ID = config.GOOGLE_CLIENT_ID
const CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = config.GOOGLE_REDIRECT_URI;

/**
 * Create OAuth2 client for a user using their refresh token.
 */
async function getAuthenticatedClient(userId) {
  const user = await userModel.findById(userId);
  if (!user || !user.refresh_token)
    throw new Error("User not found or not authenticated.");

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: user.refresh_token });

  return oAuth2Client;
}

/**
 * Send an email on behalf of a user.
 */
async function sendEmail(userId, to, subject, message) {
  const auth = await getAuthenticatedClient(userId);
  const gmail = google.gmail({ version: "v1", auth });

  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    message,
  ];
  const email = emailLines.join("\n");
  const encodedMessage = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
}

/**
 * Fetch latest emails (maxCount controls how many)
 */
async function fetchEmails(userId, maxCount) {
  const auth = await getAuthenticatedClient(userId);
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: maxCount,
  });

  return res.data.messages || [];
}

/**
 * Create a calendar event for a user.
 */
async function createEvent(userId, eventDetails) {
  const auth = await getAuthenticatedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: eventDetails,
  });

  return event.data;
}

/**
 * Fetch upcoming events (maxCount controls how many)
 */
async function fetchEvents(userId, maxCount) {
  const auth = await getAuthenticatedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.list({
    calendarId: "primary",
    maxResults: maxCount,
    orderBy: "startTime",
    singleEvents: true,
    timeMin: new Date().toISOString(),
  });

  return res.data.items || [];
}

export default {
  sendEmail,
  fetchEmails,
  createEvent,
  fetchEvents,
};
