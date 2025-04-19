import { AzureOpenAI } from "openai";
import "@azure/openai/types";
const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const apiVersion = import.meta.env.VITE_OPENAI_API_VERSION;
const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID;
const searchEndpoint = import.meta.env.VITE_AZURE_AI_SEARCH_ENDPOINT;
const searchKey = import.meta.env.VITE_AZURE_AI_SEARCH_API_KEY;
const searchIndex = import.meta.env.VITE_AZURE_AI_SEARCH_INDEX;

export default function openaiclient() {

    try {
      if (!searchEndpoint || !searchKey || !searchIndex) {
        reject(
          "Please set the required Azure AI Search environment variables."
        );
      } else {
        const client = new AzureOpenAI({
          endpoint,
          apiKey,
          apiVersion,
          deployment,
          dangerouslyAllowBrowser: true,
        });
        return(client);
      }
    } catch (error) {
      return(error);
    }
}