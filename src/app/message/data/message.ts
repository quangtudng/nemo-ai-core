import { ProjectLogger } from "@core/utils/loggers/log-service";

const NEMO_ASK = Object.freeze({
  START_CONVERSATION: [
    "Xin chào bạn, mình là trợ lý ảo Nemo. Nemo có thể giúp bạn tìm kiếm địa điểm du lịch phù hợp. Bạn có nhu cầu gì ?",
    "Kính chào quý khách, mình là Nemo, trợ lý ảo thông minh. Nemo sẽ giúp bạn tìm kiếm địa danh du lịch. Bạn cần giúp gì ?",
    "Xin chào anh/chị, mình là Nemo, trợ lý ảo thông minh. Nemo có thể giúp bạn tìm kiếm các thông tin du lịch, bạn cần giúp gì ?",
    "Chào bạn, có vẻ bạn đang có nhu cầu tìm kiếm địa điểm du lịch phù hợp. Nemo có thể giúp bạn, bạn cần gì ?",
    "Xin chào, trợ lý ảo thông minh Nemo có mặt. Nemo có thể giúp bạn tìm kiếm địa điểm du lịch phù hợp. Nemo có thể giúp gì cho bạn?",
  ],
  LOCATION: [
    "Hãy cho Nemo biết tên tỉnh thành bạn cần kiếm thông tin.",
    "Bạn có thể cho mình biết tỉnh thành cần tra cứu không ạ ?",
    "Tất nhiên là Nemo có thể giúp bạn tìm kiếm thông tin này, nhưng trước tiên bạn hãy cho Nemo biết tên tỉnh thành bạn cần tra cứu",
    "Xin lỗi, nhưng Nemo cần tên của tỉnh thành mà bạn đang muốn tìm kiếm thông tin.",
    "Cảm ơn bạn, bạn hãy cho Nemo biết thông tin về địa điểm bạn muốn biết.",
  ],
  COVID_RESULT: [
    "Cảm ơn bạn, thông tin Covid tại #location là #covid-result",
    "Hiện tại #location đang có số các ca bệnh như sau #covid-result",
    "Tính tới ngày hôm nay, thông tin Covid tại #location là #covid-result",
    "Thông tin Covid mới nhất tại #location là #covid-result",
    "Nemo đã nhận được thông tin từ bạn, thông tin Covid tại #location là #covid-result",
  ],
  EMAIL: [
    "Để giúp bạn thuận tiện hơn trong quá trình tìm kiếm các gói du lịch thích hợp từ đại lý, bạn có thể cung cấp email cho Nemo được không? (Bạn có thể nhắn 'bỏ qua' nếu không muốn)",
  ],
  SERVICE: [
    "Mình có thể giúp bạn, nhưng bạn cần cho Nemo biết dịch vụ mà bạn cần tìm kiếm",
    "Bạn có thể cho Nemo biết dịch vụ mà bạn đang quan tâm tới được không ?",
    "Cảm ơn, bạn hãy cho Nemo biết thông tin về dịch vụ bạn muốn tìm kiếm.",
    "Hãy cho Nemo biết tên dịch vụ bạn cần kiếm thông tin.",
    "Tất nhiên là Nemo có thể giúp bạn tìm kiếm thông tin này, nhưng trước tiên bạn hãy cho mình biết tên dịch vụ bạn cần tra cứu",
  ],
  SERVICE_RESULT: [
    "Đây là #service-count #service-name ở #location mà Nemo tìm thấy",
    "Cảm ơn bạn, đây là #service-count #service-name ở #location mà Nemo tìm thấy",
    "Dựa trên thông tin bạn cung cấp Nemo đã tìm ra #service-count #service-name ở #location",
    "Nemo đã nhận được thông tin của bạn và đã tìm ra #service-count #service-name ở #location",
    "Tuyệt vời, mình đã tìm ra #service-count #service-name ở #location",
  ],
  SERVICE_DETAIL_RESULT: [
    "Đây là thông tin về #service-name ở #location mà Nemo tìm thấy",
    "Cảm ơn bạn, đây là thông tin của #service-name ở #location",
    "Dựa trên thông tin bạn cung cấp Nemo đã tìm ra thông tin của #service-name ở #location",
    "Nemo đã nhận được thông tin của bạn và đã tìm ra #service-name ở #location",
    "Tuyệt vời, Nemo đã tìm ra #service-name ở #location",
  ],
  ANYTHING_ELSE: [
    "Bạn có cần giúp đỡ gì nữa không ?",
    "Cảm ơn bạn, bạn có cần Nemo trợ giúp gì nữa không ?",
    "Nemo cảm ơn quý khách đã sử dụng dịch vụ, quý khách có cần trợ giúp gì nữa không ?",
    "Cảm ơn bạn, bạn cần Nemo trợ giúp gì nữa không ?",
    "Cảm ơn quý khách, quý khách còn cần sự trợ giúp từ Nemo nữa không ?",
  ],
  END_CONVERSATION: [
    "Cảm ơn bạn đã quan tâm tới dịch vụ của Nemo, hẹn gặp lại bạn vào lần sau",
    "Hẹn gặp bạn vào lần sau, cảm ơn bạn đã sử dụng dịch vụ của Nemo",
    "Trân trọng cảm ơn quý khách đã sử dụng sản phẩm này, Nemo xin phép được đóng cuộc trò chuyện",
    "Cảm ơn quý khách đã sử dụng dịch vụ của Nemo, hẹn gặp lại bạn vào lần sau",
    "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi, Nemo mong bạn cảm thấy hài lòng với dịch vụ này",
  ],
  HELP: [
    "Bạn có thể hỏi Nemo các câu hỏi về: \n1. Tình hình Covid của một tỉnh thành\n2. Thông tin về một địa danh\n3. Tìm kiếm địa điểm du lịch",
    "Nemo sẵn sàng giúp đỡ bạn các chủ đề sau: \n1. Tình hình Covid của một tỉnh thành\n2. Thông tin về một địa danh\n3. Tìm kiếm địa điểm du lịch",
    "Tại thời điểm hiện tại, Nemo có thể giúp bạn tìm hiểu về: \n1. Tình hình Covid của một tỉnh thành\n2. Thông tin về một địa danh\n3. Tìm kiếm địa điểm du lịch",
    "Bạn có thể hỏi Nemo các câu hỏi như: \n1. Tình hình Covid của một tỉnh thành\n2. Thông tin về một địa danh\n3. Tìm kiếm địa điểm du lịch",
    "Nemo hiện tại có thể hỗ trợ bạn các câu hỏi về: \n1. Tình hình Covid của một tỉnh thành\n2. Thông tin về một địa danh\n3. Tìm kiếm địa điểm du lịch",
  ],
});
const NEMO_PROMPT = Object.freeze({
  NOT_UNDERSTAND: [
    "Xin lỗi, Nemo không hiểu câu hỏi của bạn. Bạn có thể nhắn lại được không?",
    "Nemo không hiểu câu hỏi của bạn. Bạn có thể nhắc lại câu hỏi được không?",
    "Nemo xin lỗi bạn nhưng ở thời điểm tại mình không hiểu câu hỏi của bạn",
    "Xin lỗi, Nemo không hiểu. Bạn có thể hỏi lại câu hỏi một cách cụ thể hơn được không?",
    "Xin lỗi, Nemo không hiểu ý định của bạn. Bạn có thể nhắn lại câu hỏi được không ?",
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
  EMAIL_FAILED: [
    "Xin lỗi bạn, nhưng email bạn cung cấp cho Nemo không đúng định dạng (bạn có thể nhắn 'bỏ qua' nếu không muốn cung cấp email)",
    "Nemo không tìm thấy email trong tin nhắn bạn đã cung cấp (bạn có thể nhắn 'bỏ qua' nếu không muốn cung cấp email)",
    "Xin lỗi quý khách, nhưng Nemo không tìm thấy email trong tin nhắn của bạn (bạn có thể nhắn 'bỏ qua' nếu không muốn cung cấp email)",
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

export { NEMO_ASK, NEMO_PROMPT, getRandomMessage };
