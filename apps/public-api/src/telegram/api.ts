import dotenv from "dotenv";
dotenv.config();

const botToken = process.env.TELEGRAM_TOKEN;

export async function getChat(userId: bigint) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`
  );

  const result = await response.json();
  return result;
}

export async function sendMessage(userId: bigint, message: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${userId}&text=${message}&parse_mode=HTML&disable_web_page_preview=true`
  );

  const result = await response.json();
  return result;
}

export async function sendMessageReply(userId: bigint, message: string) {
  const markup = JSON.stringify({
    force_reply: true,
  });

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${userId}&text=${message}&parse_mode=HTML&reply_markup=${markup}&disable_web_page_preview=true`
  );

  const result = await response.json();
  return result;
}

export async function sendMessageOptions(
  userId: bigint,
  message: string,
  options: any[]
) {
  const markup = JSON.stringify({
    inline_keyboard: options,
  });

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${userId}&text=${message}&parse_mode=HTML&reply_markup=${markup}&disable_web_page_preview=true`
  );

  const result = await response.json();
  return result;
}

export async function deleteMessage(userId: bigint, messageId: bigint) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/deleteMessage?chat_id=${userId}&message_id=${messageId}`
  );

  const result = await response.json();
  return result;
}
