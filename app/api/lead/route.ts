type LeadPayload = {
  nome?: unknown;
  empresa?: unknown;
  whatsapp?: unknown;
  regime_tributario?: unknown;
  faixa_faturamento?: unknown;
  consentimento?: unknown;
  website?: unknown;
};

const regimes = new Set(["Lucro Real", "Lucro Presumido"]);
const faixas = new Set([
  "Até R$ 500 mil/mês",
  "R$ 500 mil a R$ 1 milhão/mês",
  "R$ 1 milhão a R$ 5 milhões/mês",
  "Acima de R$ 5 milhões/mês",
  "Prefiro informar na conversa",
]);

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;
    if (cleanText(payload.website, 100)) {
      return Response.json({ error: "Não foi possível concluir o envio." }, { status: 400 });
    }

    const nome = cleanText(payload.nome, 120);
    const empresa = cleanText(payload.empresa, 160);
    const whatsapp = cleanText(payload.whatsapp, 20);
    const whatsappDigits = whatsapp.replace(/\D/g, "");
    const regime = cleanText(payload.regime_tributario, 40);
    const faixa = cleanText(payload.faixa_faturamento, 60);
    const consentimento = payload.consentimento === "true" || payload.consentimento === true;

    if (
      nome.length < 2 || empresa.length < 2 || whatsappDigits.length < 10 ||
      whatsappDigits.length > 13 || !regimes.has(regime) || !faixas.has(faixa) || !consentimento
    ) {
      return Response.json({ error: "Revise os campos obrigatórios e tente novamente." }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    const contactNumber = process.env.WHATSAPP_NUMBER?.replace(/\D/g, "");

    if (!contactNumber) {
      return Response.json({ error: "Atendimento temporariamente indisponível." }, { status: 503 });
    }

    if (supabaseUrl && publishableKey) {
      const saveResponse = await fetch(`${supabaseUrl}/rest/v1/recuperacao_depaula_leads`, {
        method: "POST",
        headers: {
          apikey: publishableKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          nome,
          empresa,
          whatsapp,
          regime_tributario: regime,
          faixa_faturamento: faixa,
          consentimento: true,
          origem: "landing_grupo_de_paula",
          status: "novo",
        }),
      });

      if (!saveResponse.ok) console.error("lead_persistence_failed", saveResponse.status);
    }

    const message = [
      "Olá! Vim pela landing page do Grupo De Paula e gostaria de solicitar um diagnóstico tributário.",
      "",
      `Nome: ${nome}`,
      `Empresa: ${empresa}`,
      `Regime: ${regime}`,
      `Faturamento: ${faixa}`,
    ].join("\n");

    return Response.json({
      whatsappUrl: `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`,
    });
  } catch {
    return Response.json({ error: "Não foi possível concluir agora. Tente novamente." }, { status: 500 });
  }
}
