export async function processPayment({ orderId, amount, currency, idempotencyKey }: any) {
  if (process.env.ENABLE_MOLAM_GATEWAY === "true") {
    const resp = await callMolamPay({ orderId, amount, currency, idempotencyKey });
    if (resp && resp.status === "OK") return { provider: "MOLAM", reference: resp.reference };
  }

  if (process.env.ENABLE_STRIPE === "true") {
    const resp = await callStripe({ orderId, amount, currency, idempotencyKey });
    if (resp && resp.status === "OK") return { provider: "STRIPE", reference: resp.reference };
  }

  if (process.env.ENABLE_WAVE === "true") {
    const resp = await callWave({ orderId, amount, currency, idempotencyKey });
    if (resp && resp.status === "OK") return { provider: "WAVE", reference: resp.reference };
  }

  throw new Error("All payment providers unavailable");
}

async function callMolamPay(payload: any) {
  return { status: "OK", reference: `MOLAM-${Date.now()}` };
}

async function callStripe(payload: any) {
  return { status: "OK", reference: `STRIPE-${Date.now()}` };
}

async function callWave(payload: any) {
  return { status: "OK", reference: `WAVE-${Date.now()}` };
}
