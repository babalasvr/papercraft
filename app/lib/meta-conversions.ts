import { sha256 } from './hash';

const PIXEL_ID = process.env.META_PIXEL_ID!;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN!;
const GRAPH_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

export type MetaEventParams = {
  eventName: string;
  eventId: string;
  sourceUrl: string;
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    cpf?: string;
    fbc?: string | null;
    fbp?: string | null;
    clientIpAddress?: string | null;
    clientUserAgent?: string | null;
  };
  customData?: {
    value?: number;
    currency?: string;
    contentIds?: string[];
    contentType?: string;
    contents?: { id: string; quantity: number }[];
    orderId?: string;
  };
};

function hashIfPresent(value: string | undefined | null): string[] | undefined {
  if (!value) return undefined;
  return [sha256(value.toLowerCase().trim())];
}

function formatPhoneForMeta(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

export async function sendMetaEvent(params: MetaEventParams): Promise<void> {
  const { userData, customData } = params;

  let firstName = userData.firstName;
  let lastName = userData.lastName;
  if (!firstName && !lastName && userData.email) {
    // If we only have a full name passed as firstName
  }

  const eventData: Record<string, unknown> = {
    event_name: params.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: 'website',
    event_source_url: params.sourceUrl,
    user_data: {
      em: hashIfPresent(userData.email),
      ph: userData.phone ? [sha256(formatPhoneForMeta(userData.phone))] : undefined,
      fn: hashIfPresent(firstName),
      ln: hashIfPresent(lastName),
      external_id: userData.cpf ? [sha256(userData.cpf.replace(/\D/g, ''))] : undefined,
      fbc: userData.fbc || undefined,
      fbp: userData.fbp || undefined,
      client_ip_address: userData.clientIpAddress || undefined,
      client_user_agent: userData.clientUserAgent || undefined,
      country: [sha256('br')],
    },
  };

  if (customData) {
    eventData.custom_data = {
      value: customData.value,
      currency: customData.currency || 'BRL',
      content_ids: customData.contentIds,
      content_type: customData.contentType || 'product',
      contents: customData.contents,
      order_id: customData.orderId,
    };
  }

  // Remove undefined values from user_data
  const ud = eventData.user_data as Record<string, unknown>;
  for (const key of Object.keys(ud)) {
    if (ud[key] === undefined) delete ud[key];
  }

  try {
    const res = await fetch(`${GRAPH_URL}?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [eventData] }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Meta CAPI] Error:', res.status, err);
    }
  } catch (error) {
    console.error('[Meta CAPI] Failed to send event:', error);
  }
}

export function sendMetaEventWithName(
  fullName: string,
  params: Omit<MetaEventParams, 'userData'> & {
    userData: Omit<MetaEventParams['userData'], 'firstName' | 'lastName'>;
  }
): Promise<void> {
  const { firstName, lastName } = splitName(fullName);
  return sendMetaEvent({
    ...params,
    userData: {
      ...params.userData,
      firstName,
      lastName,
    },
  });
}
