import dotenv from "dotenv";
dotenv.config();

const botToken = process.env.TELEGRAM_TOKEN;

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

// export async function sendPublicMessage(message: string) {
//   const channel = process.env.TELEGRAM_PUBLIC_CHANNEL || '-1001803807666';
//   const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${channel}&text=${message}&parse_mode=HTML&disable_web_page_preview=true`;
//   const response = await fetch(url);

//   const result = await response.json();
//   return result;
// }
