
import { LeadPayload, Language } from "../types";

export const sendLeadToWebhook = async (url: string, payload: LeadPayload): Promise<boolean> => {
  if (!url) return false;
  
  const mainContent = `🚀 **New PC Build Request!**\n👤 **Customer:** ${payload.customer.name}\n📞 **Phone:** ${payload.customer.phone || 'Not Provided'}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: mainContent,
        embeds: [{
          title: `Build Configuration for ${payload.customer.name}`,
          description: `**Final Selling Price (with 22% profit): ${payload.recommendation.totalEstimatedCost.toLocaleString()} DZD**`,
          color: 0x06b6d4,
          fields: [
            { name: "👤 Customer", value: payload.customer.name, inline: true },
            { name: "📞 Phone", value: payload.customer.phone, inline: true },
            { name: "📍 Location", value: payload.customer.willaya, inline: true },
            { name: "🛠️ Built Before?", value: payload.customer.hasBuiltBefore.toUpperCase(), inline: true },
            { name: "🎮 Target", value: payload.game, inline: true },
            { name: "💰 Client Budget", value: `${payload.budget.toLocaleString()} DZD`, inline: true },
            { name: "🖥️ Hardware List", value: payload.recommendation.parts.map(p => `• **${p.category}**: ${p.name}`).join('\n') }
          ],
          footer: { text: `Pc-Club Parts System • ${payload.timestamp}` }
        }]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook failed with status ${response.status}: ${errorText}`);
    }
    
    return response.ok;
  } catch (error) {
    console.error("Webhook network error:", error);
    return false;
  }
};

export const formatWhatsAppLink = (number: string, payload: LeadPayload, lang: Language): string => {
  const partsList = payload.recommendation.parts.map(p => `• ${p.category}: ${p.name}`).join('\n');
  const finalPrice = payload.recommendation.totalEstimatedCost.toLocaleString();
  
  let text = "";
  if (lang === 'ar') {
    text = `مرحباً، أود طلب هذه التجميعة من Pc-Club Parts:\n\n` +
           `👤 الاسم: ${payload.customer.name}\n` +
           `📞 الهاتف: ${payload.customer.phone}\n` +
           `📍 الولاية: ${payload.customer.willaya}\n` +
           `🛠️ هل ركب جهازاً من قبل؟: ${payload.customer.hasBuiltBefore === 'yes' ? 'نعم' : 'لا'}\n\n` +
           `🎮 اللعبة: ${payload.game}\n` +
           `🖥️ المكونات المقترحة:\n${partsList}\n\n` +
           `💰 السعر النهائي: ${finalPrice} د.ج`;
  } else {
    text = `Hello, I'd like to order this PC build from Pc-Club Parts:\n\n` +
           `👤 Name: ${payload.customer.name}\n` +
           `📞 Phone: ${payload.customer.phone}\n` +
           `📍 Willaya: ${payload.customer.willaya}\n` +
           `🛠️ Built Before: ${payload.customer.hasBuiltBefore.toUpperCase()}\n\n` +
           `🎮 Game: ${payload.game}\n\n` +
           `🖥️ Parts:\n${partsList}\n\n` +
           `Total Price: ${finalPrice} DZD`;
  }

  return `https://wa.me/${number.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
};
