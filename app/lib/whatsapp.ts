// Evolution API — envia mensagem WhatsApp automática após compra
// Docs: https://doc.evolution-api.com/

export interface SendWhatsAppParams {
  phone: string;   // formato: 5511999999999 (sem + e sem espaços)
  name: string;
  productName: string;
  plan: string;
  email: string;
}

export async function sendPurchaseWhatsApp(params: SendWhatsAppParams) {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;

  if (!apiUrl || !apiKey || !instance) {
    console.warn('[WhatsApp] Evolution API não configurada — pulando envio');
    return;
  }

  const { phone, name, productName, plan, email } = params;
  const firstName = name.split(' ')[0];
  const planLabel = plan === 'mestre' ? 'Kit Mestre' : 'Kit Iniciante';
  const password = process.env.MEMBER_PASSWORD || 'paper123';

  // Normaliza o telefone: remove +, espaços, traços e parênteses
  const cleanPhone = phone.replace(/\D/g, '');
  // Garante que começa com 55 (Brasil)
  const brazilPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const message = `🎨 *Papercraft Brasil*

Olá, ${firstName}! 🎉

Sua compra do *${productName}* foi confirmada!

🔑 *Seus dados de acesso:*
📧 Email: ${email}
🔒 Senha: \`${password}\`
🎯 Plano: ${planLabel}

👉 Acesse agora seus moldes:
https://papercraft-br.shop/membros

Guarde essas informações. Qualquer dúvida, é só responder aqui! 😊`;

  try {
    const response = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        number: brazilPhone,
        text: message,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[WhatsApp] Erro Evolution API:', err);
      return;
    }

    const data = await response.json();
    console.log('[WhatsApp] Mensagem enviada:', data?.key?.id);
    return data;
  } catch (error) {
    console.error('[WhatsApp] Falha ao enviar:', error);
  }
}
