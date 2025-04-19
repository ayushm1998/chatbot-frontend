import { AzureOpenAI } from "openai";
import "@azure/openai/types";




const client = new AzureOpenAI({
  endpoint,
  apiKey,
  apiVersion,
  deployment,
  dangerouslyAllowBrowser: true,
});

const deploymentName = "gpt-4o";

// Simplified timezone data
const student_admit_data = {
    ayush: "Yes",
    nilay: "Yes",
    hemant: "No"
  };

async function getResponse(messages) {
   
    
  /*let messages = [
    {
      role: "system",
      content:
        "You are a chat assistant, which answer basic IPGE data questions. But don't include references in the response.",
    },
    { role: "user", content: "hi" },
    { role: "system", content: "Hello! How can I assist you today?" },
    { role: "user", content: "hi" },
    { role: "system", content: "Hello! How can I assist you today?" },
    {
      role: "user",
      content:
        "Using the details provided in data, please address this query: give me ipge email",
    },
  ];*/
  // You will need to set these environment variables or edit the following values
  

  if (!searchEndpoint || !searchKey || !searchIndex) {
    console.error(
      "Please set the required Azure AI Search environment variables."
    );
    return;
  }
  const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment,
    dangerouslyAllowBrowser: true,
  });

  const result = await client.chat.completions.create({
    model: "",
    messages,
    data_sources: [
      {
        type: "azure_search",
        parameters: {
          endpoint: searchEndpoint,
          index_name: searchIndex,
          authentication: {
            type: "system_assigned_managed_identity",
          },
        },
      },
    ],
  });
  return JSON.stringify(result, null, 2);
}

function getAdmitData(name) {
  
    const nameLower = name.toLowerCase();
    console.log(nameLower)
   
    for (const key in student_admit_data) {
        console.log(key)
        console.log(nameLower.includes(key))
      if (nameLower.includes(key)) {
        console.log(`Admit Decision to CSUS found for ${key}`);
        
        console.log(JSON.stringify({ nameLower, "Admission Decision": student_admit_data[nameLower] }))
        return JSON.stringify({ nameLower, "Admission Decision": student_admit_data[nameLower] });
      }
    }
    }


export async function runConversation(history) {

console.log("Inside Run")
  // Define functions for the model
  const tools = [
    {
      type: "function",
      function: {
        name: "getAdmitData",
        description: "Get the admission data for studentsn",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Student Namw Eg. Alex",
            },
          },
          required: ["name"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getResponse",
        description: "Answers to any question regarding IPGE or CSUS from the data provided",
        parameters:{
            type:"object",
            properties:{
                messages:{
                    "role":{
                        type:"string",
                        description:"The sender of the message either its the system or the user"
                    },
                    "content":{
                         type:"string",
                        description:"Message/Query by user or response from the model"

                    } 
            }
        },
            required: ["messages"],
        },
      },
    }]

  // First API call: Ask the model to use the functions
  const response = await client.chat.completions.create({
    model: deploymentName,
    messages: history,
    tools,
    tool_choice: "auto"
  });
  console.log("Response",response)
  // Process the model's response
  //delete response.choices[0].message?.refusal;
 // console.log(response.choices[0].message);
  const responseMessage = response.choices[0].message;

  history.push(responseMessage);
  console.log("History",history);
  console.log("Model's response:", responseMessage);
  //console.log(history)
  // Handle function calls
  if (responseMessage.tool_calls) {
    for (const toolCall of responseMessage.tool_calls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      console.log(`Function call: ${functionName}`);
      console.log(`Function arguments: ${JSON.stringify(functionArgs)}`);

      let functionResponse;
      if (functionName === "getAdmitData") {
        functionResponse = getAdmitData(functionArgs.name); 
        history.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: functionResponse,
          });
      } else if (functionName === "getResponse") {
       let historyCall = history.map(({ role, content }) => ({ role,content }));
          functionResponse = await getResponse(historyCall);
          historyCall.push({
            role: "assistant",
            content: functionResponse,
          });
      } else {
        functionResponse = JSON.stringify({ error: "Unknown function" });
      }
    
    }
  } else {
    console.log("No tool calls were made by the model.");
  }

  // Second API call: Get the final response from the model
  const finalResponse = await client.chat.completions.create({
    model: deploymentName,
    messages:history,
  });
 
  return finalResponse.choices[0].message.content;
}

// Run the conversation and print the result
//runConversation().then(console.log).catch(console.error);
