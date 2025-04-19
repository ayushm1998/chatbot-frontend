import "@azure/openai/types";
import openaiclient from "../helper/openAIClient.js";

export async function getAssistantResponseFromIPGEData(messages) {
  console.log(messages)
  return new Promise(async (resolve, reject) => {
    try {
      const client = openaiclient();
      const result = await client.chat.completions.create({
        model: "",
        messages,
        data_sources: [
          {
            type: "azure_search",
            parameters: {
              endpoint: import.meta.env.VITE_AZURE_AI_SEARCH_ENDPOINT,
              index_name: import.meta.env.VITE_AZURE_AI_SEARCH_INDEX,
              authentication: {
                type: "system_assigned_managed_identity",
              },
            },
          },
        ],
      });
      resolve(JSON.stringify(result, null, 2));
    } catch (err) {
      reject(err.message);
    }
  });
}
