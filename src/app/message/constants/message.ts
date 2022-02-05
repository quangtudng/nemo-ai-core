import { ProjectLogger } from "@core/utils/loggers/log-service";

const NLP_INTENT = Object.freeze({
  ASKING_INFO: "asking_ai_info",
});
const NLP_ENTITY = Object.freeze({
  LOCATION: "location",
  COVID: "covid_19",
  SERVICE: "service",
  WEATHER: "weather",
});
const SPECIAL_COMMAND = Object.freeze({
  NEW: "new",
  SKIP: "skip",
  HELP: "help",
});
const NEMO_ASK = Object.freeze({
  START_CONVERSATION: [
    "Xin chào bạn, mình là trợ lý ảo Nemo. Nemo có thể giúp bạn tìm kiếm địa điểm du lịch phù hợp",
    "Kính chào quý khách, mình là Nemo, trợ lý ảo thông minh. Nemo sẽ giúp bạn tìm kiếm địa danh du lịch",
    "Xin chào anh/chị, mình là Nemo, trợ lý ảo thông minh. Nemo có thể giúp bạn tìm kiếm các thông tin du lịch",
    "Chào bạn, có vẻ bạn đang có nhu cầu tìm kiếm địa điểm du lịch phù hợp. Nemo có thể giúp bạn, bạn cần gì ?",
    "Xin chào, trợ lý ảo thông minh Nemo có mặt. Nemo có thể giúp bạn tìm kiếm địa điểm du lịch phù hợp",
  ],
  EMAIL: [
    "Để thuận tiện cho việc hỗ trợ bạn tìm kiếm địa điểm phù hợp, Nemo sẽ cần lấy email của bạn (Bạn có thể gõ nhắn 'skip' để bỏ qua)",
    "Để nhân viên du lịch có thể hỗ trợ bạn tìm kiếm các deal du lịch, Nemo sẽ cần lấy email của bạn (Bạn có thể gõ nhắn 'skip' để bỏ qua)",
    "Nếu muốn nhận các deal giảm giá trong lương lai, Nemo sẽ cần lấy email của bạn (Bạn có thể gõ nhắn 'skip' để bỏ qua)",
    "Nếu bạn muốn nhân viên của chúng tôi hỗ trợ trực tiếp, Nemo sẽ cần lấy email của bạn (Bạn có thể gõ nhắn 'skip' để bỏ qua)",
    "Nếu bạn muốn hỗ trợ trực tiếp sau này, Nemo sẽ cần lấy email của bạn (Bạn có thể gõ nhắn 'skip' để bỏ qua)",
  ],
  END_CONVERSATION: [
    "Cảm ơn bạn đã quan tâm tới dịch vụ của Nemo, hẹn gặp lại bạn vào lần sau",
    "Hẹn gặp bạn vào lần sau, cảm ơn bạn đã sử dụng dịch vụ của Nemo",
    "Trân trọng cảm ơn quý khách đã sử dụng sản phẩm này, Nemo xin phép được đóng cuộc trò chuyện",
    "Cảm ơn quý khách đã sử dụng dịch vụ của Nemo, hẹn gặp lại bạn vào lần sau",
    "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi, Nemo mong bạn cảm thấy hài lòng với dịch vụ này",
  ],
  HELP: [
    "Bạn có thể hỏi Nemo các câu hỏi về: \n- Tình hình Covid của một tỉnh thành\n- Thông tin về một địa danh\n- Tìm kiếm địa điểm du lịch\n- Gõ từ khóa 'new' để bắt đầu lại cuộc trò chuyện",
    "Nemo sẵn sàng giúp đỡ bạn các chủ đề sau: \n- Tình hình Covid của một tỉnh thành\n- Thông tin về một địa danh\n- Tìm kiếm địa điểm du lịch\n- Gõ từ khóa 'new' để bắt đầu lại cuộc trò chuyện",
    "Tại thời điểm hiện tại, Nemo có thể giúp bạn tìm hiểu về: \n- Tình hình Covid của một tỉnh thành\n- Thông tin về một địa danh\n- Tìm kiếm địa điểm du lịch\n- Gõ từ khóa 'new' để bắt đầu lại cuộc trò chuyện",
    "Bạn có thể hỏi Nemo các câu hỏi như: \n- Tình hình Covid của một tỉnh thành\n- Thông tin về một địa danh\n- Tìm kiếm địa điểm du lịch\n- Gõ từ khóa 'new' để bắt đầu lại cuộc trò chuyện",
    "Nemo hiện tại có thể hỗ trợ bạn các câu hỏi về: \n- Tình hình Covid của một tỉnh thành\n- Thông tin về một địa danh\n- Tìm kiếm địa điểm du lịch\n- Gõ từ khóa 'new' để bắt đầu lại cuộc trò chuyện",
  ],
});
const NEMO_PROMPT = Object.freeze({
  EMAIL_FAILED: [
    "Xin lỗi, Nemo không hiểu câu trả lời của bạn. Bạn có thể cung cấp dịa chỉ email được không? (Bạn có thể nhắn 'skip')",
    "Nemo không hiểu câu trả lời của bạn. Bạn có thể cung cấp email của bạn được không? (Bạn có thể nhắn 'skip')",
    "Nemo xin lỗi bạn nhưng ở thời điểm tại mình không hiểu câu trả lời của bạn. Bạn có thể cung cấp email của bạn được không? (Bạn có thể nhắn 'skip')",
    "Xin lỗi, Nemo không hiểu. Bạn có thể cung cấp cho mình email của bạn được không? (Bạn có thể nhắn 'skip')",
    "Xin lỗi, Nemo không hiểu ý định của bạn. Bạn có thể cung cấp cho mình email của bạn được không ? (Bạn có thể nhắn 'skip')",
  ],
  NOT_UNDERSTAND: [
    "Xin lỗi, Nemo không hiểu câu hỏi của bạn. Bạn có thể nhắn lại được không? Hãy gõ 'help' nếu bạn cần giúp đỡ",
    "Nemo không hiểu câu hỏi của bạn. Bạn có thể nhắc lại câu hỏi được không? Hãy gõ 'help' nếu bạn cần giúp đỡ",
    "Nemo xin lỗi bạn nhưng ở thời điểm tại mình không hiểu câu hỏi của bạn. Hãy gõ 'help' nếu bạn cần giúp đỡ",
    "Xin lỗi, Nemo không hiểu. Bạn có thể hỏi lại câu hỏi một cách cụ thể hơn được không? Hãy gõ 'help' nếu bạn cần giúp đỡ",
    "Xin lỗi, Nemo không hiểu ý định của bạn. Bạn có thể nhắn lại câu hỏi được không ? Hãy gõ 'help' nếu bạn cần giúp đỡ",
  ],
  LOCATION_FAILED: [
    "Xin lỗi bạn, nhưng ở mình không tìm thấy địa điểm mà bạn muốn tìm kiếm",
    "Nemo không tìm thấy bất kỳ địa điểm mà bạn muốn tìm kiếm",
    "Xin lỗi quý khách, hiện tại địa điểm mà bạn tìm kiếm hiện chưa hỗ trợ",
    "Địa điểm mà bạn đang cần tìm kiếm thông tin chưa được hỗ trợ",
    "Rất xin lỗi nhưng Nemo không tìm ra được địa điểm mà bạn đã cung cấp",
  ],
  SERVICE_FAILED: [
    "Xin lỗi bạn, nhưng ở mình không tìm thấy dịch vụ mà bạn muốn tìm kiếm",
    "Nemo không tìm thấy bất kỳ dịch vụ mà bạn muốn tìm kiếm",
    "Xin lỗi quý khách, hiện tại dịch vụ mà bạn tìm kiếm hiện chưa hỗ trợ",
    "Dịch vụ mà bạn đang cần tìm kiếm thông tin chưa được hỗ trợ",
    "Rất xin lỗi nhưng Nemo không tìm ra được dịch vụ mà bạn đã cung cấp",
  ],
  COVID_FAILED: [
    "Xin lỗi bạn, nhưng ở mình không tìm thấy thông tin covid tại tỉnh thành mà bạn muốn tìm kiếm",
    "Nemo không tìm thấy bất kỳ thông tin covid tại tỉnh thành mà bạn muốn tìm kiếm",
    "Xin lỗi quý khách, hiện tại thông tin covid tại tỉnh thành mà bạn tìm kiếm hiện chưa hỗ trợ",
    "Thông tin covid tại tỉnh thành mà bạn đang cần tìm kiếm thông tin chưa được hỗ trợ",
    "Rất xin lỗi nhưng Nemo không tìm ra được thông tin covid tại tỉnh thành mà bạn đã cung cấp",
  ],
});

const getRandomMessage = (messages: string[]): string => {
  try {
    const randomIndex = Math.floor(Math.random() * messages.length) || 0;
    return messages[randomIndex];
  } catch (error) {
    // Fallback to first message in case of exception
    ProjectLogger.exception(error.stack);
    return messages[0];
  }
};

export {
  NEMO_ASK,
  NEMO_PROMPT,
  NLP_INTENT,
  NLP_ENTITY,
  SPECIAL_COMMAND,
  getRandomMessage,
};
