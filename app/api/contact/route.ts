const allowedOrigins = new Set(["hero", "floating", "section"]);

export async function GET(request: Request) {
  const number = process.env.WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (!number) return Response.json({ error: "Atendimento indisponível." }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const origem = searchParams.get("origem") || "site";
  const source = allowedOrigins.has(origem) ? origem : "site";
  const text = `Olá! Vim pela landing page do Grupo De Paula (${source}) e quero entender se minha empresa possui alguma oportunidade tributária.`;

  return Response.json(
    { whatsappUrl: `https://wa.me/${number}?text=${encodeURIComponent(text)}` },
    { headers: { "Cache-Control": "no-store" } },
  );
}
