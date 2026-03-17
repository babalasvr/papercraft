import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventName, eventId, fullName,
      email, phone, cpf,
      fbc, fbp,
      customData, sourceUrl,
    } = body;

    if (!eventName || !eventId) {
      return NextResponse.json({ error: 'eventName e eventId são obrigatórios' }, { status: 400 });
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || null;
    const clientUserAgent = request.headers.get('user-agent') || null;

    await sendMetaEventWithName(fullName || '', {
      eventName,
      eventId,
      sourceUrl: sourceUrl || '',
      userData: {
        email: email || undefined,
        phone: phone || undefined,
        cpf: cpf || undefined,
        fbc: fbc || null,
        fbp: fbp || null,
        clientIpAddress: clientIp,
        clientUserAgent: clientUserAgent,
      },
      customData: customData || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Meta Event API] Error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
