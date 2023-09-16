import { onMounted, ref } from "vue";
import OpenAI from "openai";

const API_KEY = "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";

export const useOpenAI = () => {
  const loading = ref(false);

  let openAiInstance;

  onMounted(() => {
    openAiInstance = new OpenAI({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true,
    });
  });

  const send = async (message, conversation_id = undefined) => {
    loading.value = true;

    const result = await openAiInstance.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
      conversation_id,
    });

    loading.value = false;

    return result;
  };

  const sendMultiple = async (messages, conversation_id = undefined) => {
    loading.value = true;

    const result = await openAiInstance.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
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
