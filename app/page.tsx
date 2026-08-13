"use client";

import { FormEvent, useEffect, useState } from "react";

type ContactMode = "hero" | "floating" | "section";

const areas = [
  {
    code: "01",
    title: "Revisão fiscal",
    text: "Leitura técnica das apurações, obrigações acessórias e pagamentos para localizar inconsistências e oportunidades legítimas.",
  },
  {
    code: "02",
    title: "Créditos tributários",
    text: "Mapeamento, validação documental e memória de cálculo para créditos federais, previdenciários e teses aplicáveis.",
  },
  {
    code: "03",
    title: "Restituição e compensação",
    text: "Estratégia administrativa para pedidos de restituição, ressarcimento ou compensação, conforme a natureza do crédito.",
  },
  {
    code: "04",
    title: "Passivo e PGFN",
    text: "Análise de débitos inscritos, capacidade de pagamento e modalidades de transação compatíveis com o perfil da empresa.",
  },
];

const steps = [
  ["01", "Triagem", "Entendemos o regime, o setor e o histórico fiscal da empresa."],
  ["02", "Diagnóstico", "Cruzamos documentos, apurações e oportunidades aderentes ao negócio."],
  ["03", "Parecer", "Apresentamos memória de cálculo, fundamentos e cenários possíveis."],
  ["04", "Execução", "Após aprovação, conduzimos o caminho definido e acompanhamos cada etapa."],
];

const faqs = [
  {
    q: "Toda empresa tem crédito tributário a recuperar?",
    a: "Não. A existência, a origem e a possibilidade de uso de um crédito dependem do regime, do setor, das operações e dos documentos da empresa. Por isso, o primeiro passo é sempre um diagnóstico individual.",
  },
  {
    q: "É possível analisar períodos anteriores?",
    a: "Em muitas hipóteses, a análise pode alcançar os cinco anos anteriores. O prazo e a forma de recuperação variam conforme a natureza do crédito, o fato gerador e a legislação aplicável.",
  },
  {
    q: "Quais tributos podem entrar na análise?",
    a: "A depender do caso, PIS, Cofins, IRPJ, CSLL, IPI, contribuições previdenciárias e tributos estaduais podem ser revisados. A equipe delimita o escopo após a triagem.",
  },
  {
    q: "A recuperação acontece automaticamente?",
    a: "Não. Todo aproveitamento exige lastro documental, memória de cálculo e escolha do procedimento adequado. Não trabalhamos com promessas prontas ou valores estimados sem análise.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const onScroll = () => {
      document.documentElement.style.setProperty(
        "--scroll-y",
        `${Math.min(window.scrollY, 900)}px`,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function openContact(mode: ContactMode) {
    try {
      const response = await fetch(`/api/contact?origem=${mode}`, {
        method: "GET",
        cache: "no-store",
      });
      const result = (await response.json()) as { whatsappUrl?: string };
      if (!response.ok || !result.whatsappUrl) throw new Error("Contato indisponível");
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch {
      document.querySelector("#diagnostico")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setFeedback("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { whatsappUrl?: string; error?: string };

      if (!response.ok || !result.whatsappUrl) {
        throw new Error(result.error || "Não foi possível concluir agora.");
      }

      setFeedback("Tudo certo. Vamos continuar seu atendimento no WhatsApp.");
      form.reset();
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir agora. Tente novamente.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Grupo De Paula — início">
          <span className="brand-mark">DP</span>
          <span className="brand-copy">
            <strong>Grupo De Paula</strong>
            <small>Estratégia tributária</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label="Abrir menu"
        >
          <span />
          <span />
        </button>

        <nav id="main-navigation" className={menuOpen ? "nav-open" : ""}>
          <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
          <a href="#metodo" onClick={() => setMenuOpen(false)}>Método</a>
          <a href="#perguntas" onClick={() => setMenuOpen(false)}>Dúvidas</a>
          <button className="nav-cta" onClick={() => openContact("hero")}>
            Falar com especialista <span>↗</span>
          </button>
        </nav>
      </header>

      <section id="inicio" className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow"><i /> Inteligência fiscal para empresas</div>
          <h1>Oportunidades fiscais não deveriam ficar <em>escondidas</em> na operação.</h1>
          <p className="hero-description">
            Identificamos valores pagos indevidamente, créditos possíveis e caminhos de regularização com análise técnica, lastro documental e visão de negócio.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#diagnostico">Solicitar diagnóstico <span>↗</span></a>
            <a className="text-link" href="#metodo">Conheça o nosso método <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <div><b>01</b><span>Análise individual</span></div>
            <div><b>02</b><span>Memória de cálculo</span></div>
            <div><b>03</b><span>Condução estratégica</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Mapa visual das etapas da recuperação tributária">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="radar-grid" />
          <div className="core-card">
            <span className="core-kicker">Diagnóstico</span>
            <strong>Visão fiscal<br />360°</strong>
            <small>Dados + documentos + estratégia</small>
          </div>
          <div className="float-card card-federal"><i /> Tributos federais</div>
          <div className="float-card card-inss"><i /> Previdenciário</div>
          <div className="float-card card-pgfn"><i /> PGFN</div>
          <div className="float-card card-credit"><i /> Créditos</div>
          <div className="visual-caption"><span>MAPA DE OPORTUNIDADES</span><b>Uma leitura conectada da sua operação</b></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Compromissos do trabalho">
        <div className="section-shell trust-inner">
          <span>Rigor técnico</span><i /><span>Confidencialidade</span><i /><span>Clareza na decisão</span><i /><span>Atuação multidisciplinar</span>
        </div>
      </section>

      <section className="manifesto section-shell">
        <div className="section-number">01 — CONTEXTO</div>
        <div className="manifesto-copy">
          <p className="large-copy">A rotina fiscal é complexa. Regras mudam, operações crescem e oportunidades podem passar despercebidas entre apurações, declarações e pagamentos.</p>
          <div className="manifesto-note">
            <span>Nosso papel</span>
            <p>Transformar dados fiscais em uma decisão clara: o que existe, qual é o fundamento e qual caminho faz sentido para a sua empresa.</p>
          </div>
        </div>
      </section>

      <section id="solucoes" className="solutions">
        <div className="section-shell">
          <div className="section-heading">
            <div><div className="section-number">02 — SOLUÇÕES</div><h2>Do diagnóstico à decisão.</h2></div>
            <p>Uma atuação coordenada para recuperar eficiência, reduzir incertezas e organizar o próximo passo tributário.</p>
          </div>

          <div className="solutions-grid">
            {areas.map((area) => (
              <article className="solution-card" key={area.code}>
                <div className="solution-top"><span>{area.code}</span><i>↗</i></div>
                <h3>{area.title}</h3>
                <p>{area.text}</p>
                <div className="card-line" />
              </article>
            ))}
          </div>

          <div className="tax-cloud" aria-label="Tributos que podem entrar na análise">
            <span>Escopo conforme o perfil da empresa</span>
            <div>{["PIS", "COFINS", "IRPJ", "CSLL", "IPI", "INSS", "ICMS"].map((tax) => <b key={tax}>{tax}</b>)}</div>
          </div>
        </div>
      </section>

      <section id="metodo" className="method section-shell">
        <div className="method-intro">
          <div className="section-number">03 — MÉTODO</div>
          <h2>Critério antes de qualquer promessa.</h2>
          <p>Cada oportunidade precisa de origem comprovada, documentação coerente e um procedimento compatível com a legislação.</p>
          <div className="method-quote"><span>“</span><p>Recuperar com segurança começa por saber exatamente o que sustenta cada número.</p></div>
        </div>

        <div className="steps">
          {steps.map(([number, title, text]) => (
            <article className="step" key={number}>
              <span className="step-number">{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="eligibility section-shell">
        <div className="eligibility-panel">
          <div><div className="eyebrow eyebrow-dark"><i /> Atendimento exclusivo</div><h2>Estratégia tributária para Lucro Real e Presumido.</h2></div>
          <div className="profile-list">
            <div><span>01</span><p><b>Lucro Real</b>Operações com maior volume e complexidade fiscal.</p></div>
            <div><span>02</span><p><b>Lucro Presumido</b>Análises aderentes ao setor e à natureza das receitas.</p></div>
          </div>
          <a href="#diagnostico" className="button button-light">Avaliar o perfil da empresa <span>↗</span></a>
        </div>
      </section>

      <section id="perguntas" className="faq section-shell">
        <div className="faq-heading">
          <div className="section-number">04 — PERGUNTAS</div>
          <h2>Antes de começar,<br />vale entender.</h2>
          <p>Respostas objetivas para as dúvidas mais comuns sobre o diagnóstico tributário.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <article className={openFaq === index ? "faq-item faq-open" : "faq-item"} key={faq.q}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                <span>{String(index + 1).padStart(2, "0")}</span><b>{faq.q}</b><i>{openFaq === index ? "−" : "+"}</i>
              </button>
              <div className="faq-answer"><p>{faq.a}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="diagnostico" className="contact-section">
        <div className="section-shell contact-grid">
          <div className="contact-copy">
            <div className="section-number light-number">05 — DIAGNÓSTICO</div>
            <h2>Vamos olhar para os números certos.</h2>
            <p>Conte um pouco sobre a sua empresa. A partir dessas informações, nosso time inicia a triagem e continua o atendimento pelo WhatsApp.</p>
            <div className="contact-seal"><span>DP</span><p><b>Atendimento consultivo</b>Sem promessas genéricas.<br />Com análise e clareza.</p></div>
          </div>

          <form className="lead-form" onSubmit={submitLead}>
            <div className="form-top"><span>Solicite uma avaliação inicial</span><b>↘</b></div>
            <div className="field-row">
              <label>Seu nome<input name="nome" type="text" minLength={2} maxLength={120} placeholder="Como podemos chamar você?" required /></label>
              <label>Empresa<input name="empresa" type="text" minLength={2} maxLength={160} placeholder="Nome da empresa" required /></label>
            </div>
            <label>WhatsApp<input name="whatsapp" type="tel" inputMode="tel" minLength={10} maxLength={20} placeholder="DDD + número" required /></label>
            <div className="field-row">
              <label>Regime tributário
                <select name="regime_tributario" defaultValue="" required>
                  <option value="" disabled>Selecione</option><option>Lucro Real</option><option>Lucro Presumido</option>
                </select>
              </label>
              <label>Faturamento aproximado
                <select name="faixa_faturamento" defaultValue="" required>
                  <option value="" disabled>Selecione</option><option>Até R$ 500 mil/mês</option><option>R$ 500 mil a R$ 1 milhão/mês</option><option>R$ 1 milhão a R$ 5 milhões/mês</option><option>Acima de R$ 5 milhões/mês</option><option>Prefiro informar na conversa</option>
                </select>
              </label>
            </div>
            <label className="honeypot" aria-hidden="true">Não preencha<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
            <label className="consent"><input name="consentimento" value="true" type="checkbox" required /><span>Autorizo o uso dos dados para retorno sobre este atendimento, conforme a política de privacidade.</span></label>
            <button className="button submit-button" type="submit" disabled={sending}>{sending ? "Preparando atendimento..." : "Continuar pelo WhatsApp"} <span>↗</span></button>
            <p className="form-feedback" role="status" aria-live="polite">{feedback}</p>
          </form>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-main">
          <a href="#inicio" className="brand footer-brand"><span className="brand-mark">DP</span><span className="brand-copy"><strong>Grupo De Paula</strong><small>Estratégia tributária</small></span></a>
          <p>Informação, análise e estratégia para decisões tributárias mais seguras.</p>
          <button onClick={() => openContact("section")}>Iniciar conversa <span>↗</span></button>
        </div>
        <div className="section-shell footer-legal">
          <span>© 2026 Grupo De Paula. Todos os direitos reservados.</span>
          <span>Conteúdo informativo. Resultados dependem da análise de cada caso.</span>
        </div>
      </footer>

      <button className="floating-contact" onClick={() => openContact("floating")} aria-label="Falar com especialista pelo WhatsApp">
        <span className="chat-icon">◔</span><b>Falar agora</b>
      </button>
    </main>
  );
}
