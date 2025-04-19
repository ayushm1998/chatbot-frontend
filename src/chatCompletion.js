import { AzureOpenAI } from "openai";  
import "@azure/openai/types";


export async function getResponse(messages) {  
    // You will need to set these environment variables or edit the following values
    const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || "https://ipge-cb-oai.openai.azure.com/";  
    const apiKey = process.env.AZURE_OPENAI_API_KEY || "5YZMdgUG6U6v77ptE7Z61R16iBNIw2JkWRDuXweueDC3e4lPBoUMJQQJ99BCACYeBjFXJ3w3AAABACOG1KcQ";  
   const apiVersion = "2024-05-01-preview";  
   const deployment = "gpt-4o"; // This must match your deployment name
   const searchEndpoint = import.meta.env.VITE_AZURE_AI_SEARCH_ENDPOINT || "https://ipge-oi-cb.search.windows.net";  
   const searchKey = import.meta.env.VITE_AZURE_AI_SEARCH_API_KEY || "enqXmGfa3RFjGCEO3nSXNYJm9iShBAcdy5A9EOOoZyAzSeCO7cu6" ;  
   const searchIndex = import.meta.env.VITE_AZURE_AI_SEARCH_INDEX || "index-documents";  
    

    if (!searchEndpoint || !searchKey || !searchIndex) {  
        console.error("Please set the required Azure AI Search environment variables.");  
        return;  
    }  
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });  

    const result = await client.chat.completions.create({  
        model:'',
        messages,
        data_sources: [{
            type: "azure_search",
            parameters: {
              endpoint: searchEndpoint,
              index_name: searchIndex,
              authentication: {
                type: "system_assigned_managed_identity",
              }
            }
          }]
    });  
   // let response= JSON.stringify(result, null, 2);
    return (JSON.stringify(result, null, 2));   ////////////////////Original

    //const data = await JSON.parse(response)
  //if (!data.id) throw new Error(data?.error.message || "Something went wrong!");
      // Clean and update chat history with bot's response
  //const apiResponseText = data.choices[0]['message'].content.replace(/\*\*(.*?)\*\*/g, "$1").trim();
     
    //  return response;
}  


