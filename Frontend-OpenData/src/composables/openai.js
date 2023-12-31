import { onMounted, ref } from "vue";
import OpenAI from "openai";
import config from "../../config.json";

export const useOpenAI = () => {
  const loading = ref(false);

  let openAiInstance;

  onMounted(() => {
    openAiInstance = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  });

  const send = async (message, conversation_id = undefined) => {
    loading.value = true;

    const result = await openAiInstance.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-4",
      conversation_id,
    });

    loading.value = false;

    return result;
  };

  const sendMultiple = async (messages, conversation_id = undefined) => {
    loading.value = true;

    const result = await openAiInstance.chat.completions.create({
      messages,
      model: "gpt-4",
      conversation_id,
    });

    loading.value = false;

    return result;
  };

  const openAIFunctions = {
    send,
    sendMultiple,
  };

  return {
    loading,
    openAIFunctions,
  };
};
