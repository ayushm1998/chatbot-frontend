import { AzureOpenAI } from "openai";  
import "@azure/openai/types";


export async function getResponse(messages) {  
    // You will need to set these environment variables or edit the following values
   

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


