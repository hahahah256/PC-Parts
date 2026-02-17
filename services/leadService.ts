
import { LeadPayload, Language } from "../types";

export const sendLeadToWebhook = async (url: string, payload: LeadPayload): Promise<boolean> => {
  if (!url) return false;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: "🚀 **New PC Build Request!**",
        embeds: [{
          title: `Build Configuration for ${payload.customer.name}`,
          color: 0x06b6d4,
          fields: [
            { name: "👤 Customer Name", value: payload.customer.name, inline: true },
            { name: "📞 Phone Number", value: `**${payload.customer.phone}**`, inline: true },
            { name: "📍 Location", value: `Wilaya ${payload.customer.willaya}`, inline: true },
            { name: "🎮 Target Game", value: payload.game, inline: true },
            { name: "💰 Target Budget", value: `${payload.budget.toLocaleString()} DZD`, inline: true },
            { name: "🖥️ Configuration Details", value: payload.recommendation.parts.map(p => `**${p.category}**: ${p.name}`).join('\n') }
          ],
          footer: { text: `Pc-Club Parts • Received at ${payload.timestamp}` }
        }]
      })
    });
    return response.ok;
  } catch (error) {
    console.error("Webhook error:", error);
    return false;
  }
};

export const formatWhatsAppLink = (number: string, payload: LeadPayload, lang: Language): string => {
  const partsList = payload.recommendation.parts.map(p => `• ${p.category}: ${p.name}`).join('\n');
  
  let text = "";
  if (lang === 'ar') {
    text = `مرحباً، أود طلب هذه التجميعة:\n\n` +
           `👤 الاسم: ${payload.customer.name}\n` +
           `📞 الهاتف: ${payload.customer.phone}\n` +
           `📍 الولاية: ${payload.customer.willaya}\n\n` +
           `🎮 اللعبة: ${payload.game}\n` +
           `💰 الميزانية: ${payload.budget.toLocaleString()} د.ج\n\n` +
           `🖥️ القطع المقترحة:\n${partsList}\n\n` +
           `الإجمالي: ${payload.recommendation.totalEstimatedCost.toLocaleString()} د.ج`;
  } else {
    text = `Hello, I'd like to order this PC build:\n\n` +
           `👤 Name: ${payload.customer.name}\n` +
           `📞 Phone: ${payload.customer.phone}\n` +
           `📍 Willaya: ${payload.customer.willaya}\n\n` +
           `🎮 Game: ${payload.game}\n` +
           `💰 Budget: ${payload.budget.toLocaleString()} DZD\n\n` +
           `🖥️ Parts:\n${partsList}\n\n` +
           `Total: ${payload.recommendation.totalEstimatedCost.toLocaleString()} DZD`;
  }

  return `https://wa.me/${number.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
};
