import "@azure/openai/types";
import { getAssistantResponseFromIPGEData } from "./botLogic/getAssistantResponseFromIPGEData";
  //import getStudentData from "./botLogic/getStudentsData.js";
import openaiclient from "./helper/openAIClient.js";

const client = openaiclient();
const deploymentName = "gpt-4o";

// Simplified Student data
const student_admit_data = {
  ayush: "Yes",
  nilay: "Yes",
  hemant: "No",
};

function getAdmitData(name) {
  const nameLower = name.toLowerCase();
  for (const key in student_admit_data) {
    if (nameLower.includes(key)) {
      return (
        JSON.stringify({
          nameLower,
          "Admission Decision": student_admit_data[nameLower],
        }) || "Not Found"
      );
    }
  }
}

export async function conditionalCall(history) {


  // Define functions for the model
  const tools = [
    {
      type: "function",
      function: {
        name: "getAdmitData",
        description:
          "Get the admission/admit data for students, if no name is provided ask for a name first",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Student Name Eg. Alex, ask for name if not given by user",
            },
          },
          required: ["name"],
        },
      },
    },
  ];
console.log(client)
  // First API call: Ask the model to use the functions
  const response = await client.chat.completions.create({
    model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID,
    messages: history,
    tools,
    tool_choice: "auto",
  });

  console.log(response)
  // Process the model's response
  const responseMessage = response.choices[0].message;
  history.push(responseMessage);

  // Handle function calls
  if (responseMessage.tool_calls) {
    for (const toolCall of responseMessage.tool_calls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      let functionResponse;
      if (functionName === "getAdmitData") {
        functionResponse = getAdmitData(functionArgs.name);
        history.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: functionResponse || "Not Found",
        });
      }
    }
  } else {
    history = history.map(({ role, content }) => ({ role, content }));
    console.log(history)
    let functionResponse = await getAssistantResponseFromIPGEData(history);
    history.push({
      role: "assistant",
      content: functionResponse || "Not Found",
    });
  }
  // Second API call: Get the final response from the model
  const finalResponse = await client.chat.completions.create({
    model: deploymentName,
    messages: history,
  });
  return finalResponse.choices[0].message.content;
}
