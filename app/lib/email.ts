import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendPurchaseEmailParams {
  to: string;
  name: string;
  productName: string;
  plan: string;
}

export async function sendPurchaseEmail(params: SendPurchaseEmailParams) {
  const { to, name, productName, plan } = params;
  const firstName = name.split(' ')[0];
  const memberUrl = 'https://papercraft-br.shop/membros';
  const password = process.env.MEMBER_PASSWORD || 'paper123';

  const { data, error } = await resend.emails.send({
    from: 'Papercraft Brasil <noreply@papercraft-br.shop>',
    to,
    subject: '🎉 Sua compra foi confirmada! Acesse seus moldes agora',
    html: buildEmailHtml({ firstName, productName, plan, email: to, password, memberUrl }),
  });

  if (error) {
    console.error('[Resend] Erro ao enviar email:', error);
    throw error;
  }

  console.log('[Resend] Email enviado:', data?.id);
  return data;
}

function buildEmailHtml(opts: {
  firstName: string;
  productName: string;
  plan: string;
  email: string;
  password: string;
  memberUrl: string;
}): string {
  const { firstName, productName, plan, email, password, memberUrl } = opts;
  const planLabel = plan === 'mestre' ? 'Kit Mestre' : 'Kit Iniciante';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Compra confirmada - Papercraft Brasil</title>
</head>
<body style="margin:0;padding:0;background-color:#FFF8F0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8F0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header laranja -->
          <tr>
            <td style="background:linear-gradient(135deg,#C1440E 0%,#E85D04 100%);padding:40px 32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:36px;">🎨</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">Papercraft Brasil</h1>
              <p style="margin:8px 0 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Sua compra foi confirmada!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">

              <h2 style="margin:0 0 8px 0;color:#1a1a1a;font-size:22px;">Olá, ${firstName}! 🎉</h2>
              <p style="margin:0 0 24px 0;color:#555;font-size:15px;line-height:1.6;">
                Sua compra do <strong>${productName}</strong> foi confirmada com sucesso!
                Seus moldes já estão disponíveis para acesso.
              </p>

              <!-- Card de acesso -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3E0;border:2px solid #E85D04;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px 0;color:#C1440E;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">🔑 Seus dados de acesso</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #FDDCBC;">
                          <p style="margin:0;color:#555;font-size:13px;">📧 Login (email)</p>
                          <p style="margin:4px 0 0 0;color:#1a1a1a;font-size:15px;font-weight:700;">${email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #FDDCBC;">
                          <p style="margin:0;color:#555;font-size:13px;">🔒 Senha</p>
                          <p style="margin:4px 0 0 0;color:#1a1a1a;font-size:15px;font-weight:700;font-family:monospace;background:#fff;display:inline-block;padding:4px 10px;border-radius:6px;border:1px solid #E85D04;">${password}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;">
                          <p style="margin:0;color:#555;font-size:13px;">🎯 Seu plano</p>
                          <p style="margin:4px 0 0 0;color:#C1440E;font-size:15px;font-weight:700;">${planLabel}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botão CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${memberUrl}" style="display:inline-block;background:linear-gradient(135deg,#C1440E,#E85D04);color:#ffffff;font-size:16px;font-weight:800;text-decoration:none;padding:16px 40px;border-radius:10px;">
                      Acessar Meus Moldes →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#888;font-size:13px;text-align:center;line-height:1.5;">
                Guarde este email! Você pode acessar seus moldes a qualquer momento<br/>
                em <a href="${memberUrl}" style="color:#E85D04;font-weight:700;">${memberUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f5;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                © ${new Date().getFullYear()} Papercraft Brasil · Você recebeu este email porque realizou uma compra em nosso site.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
