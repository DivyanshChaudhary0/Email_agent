
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import googleService from "../services/google.service.js";
import mongoose from "mongoose";
import config from "../config/config.js";

mongoose.connect(config.MONGO_URI).then(() => console.log("db connected"));

const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

server.tool("sendemail", "send a mail to a email address", {
    userid: z.string(),
    message: z.string(),
    to: z.string(),
    subject: z.string()
}, async({ userid, to, subject, message }) => {         // mendetory to write async here and return a string
    try{
        await googleService.sendEmail(userid, to, subject, message);
        return "Email send successfully"
    }
    catch(err){
        return "Error in sending email"
    }
})

server.tool('fetchmails', "fetch latest emails", {
    userid: z.string(),
    maxCount: z.number().default(10)
}, async ({ userid, maxCount }) => {
    try {
        const emails = await googleService.fetchEmails(userid, maxCount)
        return emails
    } catch (err) {
        console.log(err)
        return "Error fetching emails"
    }
});


const transport = new StdioServerTransport();
await server.connect(transport);
