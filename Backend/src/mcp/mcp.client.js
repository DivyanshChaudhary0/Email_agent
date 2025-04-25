import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.GOOGLE_GEMINI_KEY });

const transport = new StdioClientTransport({
  command: "node",
  args: ["./src/mcp/main.js"],
});

const client = new Client({
  name: "example-client",
  version: "1.0.0",
});

await client.connect(transport).then(() => {
  console.log("Connected to MCP server");
});

async function getResponse() {
  const tools = (await client.listTools()).tools;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents:
      "write an email to sambhav12wakhariya@gmail.com, on topic of future of AI agent , decide subject and message on your own, use userID:68088b462ea4ff454545a0d2",
    config: {
      tools: [
        {
          functionDeclarations: tools.map((tool) => {
            return {
              name: tool.name,
              description: tool.description,
              parameters: {
                type: tool.inputSchema.type,
                properties: tool.inputSchema.properties,
              },
            };
          }),
        },
      ],
    },
  });

  const functionCall = response.candidates[ 0 ].content.parts[ 0 ].functionCall || response.candidates[ 0 ].content.parts[ 1 ].functionCall
  
  console.log(functionCall);
  

  const toolResult = await client.callTool({
      name: functionCall.name,
      arguments: functionCall.args
  })
  
  console.log(toolResult);
  
}


getResponse();

export default client;
