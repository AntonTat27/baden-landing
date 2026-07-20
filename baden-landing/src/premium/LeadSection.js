import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines, fadeUp, motion } from './motion';

export default function LeadSection() {
  const { isRu } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', time: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const change = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError(isRu ? 'Укажите имя и телефон.' : 'Please provide your name and phone.');
      return;
    }
    setError('');
    setSubmitted(true); // stub — wire to CRM/webhook before launch
  };

  return (
    <section id="contact" className="relative bg-baden-base py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[22rem] w-[50rem] rounded-full bg-baden-teal/[0.06] blur-[130px] pointer-events-none" aria-hidden />
      <div className="max-w-8xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
        {/* Left — persuasion + contacts */}
        <div>
          <Reveal as="p" className="flex items-center gap-3 text-xs tracking-widest2 uppercase text-baden-gold mb-6">
            <span className="h-px w-8 bg-baden-gold" />
            {isRu ? 'Консультация' : 'Consultation'}
          </Reveal>
          <h2 className="font-display font-light text-4xl md:text-6xl text-baden-cream leading-[1.02] tracking-[-0.02em] mb-6">
            <RevealLines lines={isRu ? ['Подберём резиденцию', <>под вашу <span className="italic text-baden-gold-bright">цель</span></>] : ['Find the residence', <>for your <span className="italic text-baden-gold-bright">goal</span></>]} />
          </h2>
          <Reveal className="text-sm md:text-base text-baden-muted max-w-md leading-relaxed mb-10">
            {isRu
              ? 'Оставьте контакт — расскажем про форматы, цены по сезонам и оформление ТАПУ в коротком разговоре, на русском.'
              : "Leave your contact — we'll walk you through formats, seasonal pricing, and the TAPU process in a short call."}
          </Reveal>

          <Reveal className="space-y-3 text-sm">
            {[
              { l: 'WhatsApp', v: '+90 000 000 00 00' },
              { l: 'Telegram', v: '@baden_premium' },
              { l: isRu ? 'Телефон' : 'Phone', v: '+90 000 000 00 00' },
            ].map((c) => (
              <div key={c.l} className="flex items-center gap-4">
                <span className="text-xs tracking-widest2 uppercase text-baden-muted w-24">{c.l}</span>
                <span className="text-baden-cream/90">{c.v}</span>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Right — form on a raised light card */}
        <Reveal variants={fadeUp} className="relative">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-baden-cream p-10 md:p-12 text-center"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-baden-gold-bright text-baden-base mb-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
              <p className="font-display text-2xl md:text-3xl text-baden-base mb-2">{isRu ? 'Спасибо!' : 'Thank you!'}</p>
              <p className="text-baden-base/60">
                {isRu ? 'Мы получили запрос и свяжемся с вами в ближайшее время.' : "We've received your request and will be in touch shortly."}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="rounded-3xl bg-baden-cream p-8 md:p-10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]">
              <h3 className="font-display text-xl md:text-2xl text-baden-base mb-8">
                {isRu ? 'Получить консультацию' : 'Request a consultation'}
              </h3>
              <div className="flex flex-col gap-6">
                {[
                  { id: 'name', label: isRu ? 'Имя' : 'Name', ph: isRu ? 'Ваше имя' : 'Your name', type: 'text' },
                  { id: 'phone', label: isRu ? 'Телефон / WhatsApp' : 'Phone / WhatsApp', ph: '+7 900 000 00 00', type: 'tel' },
                  { id: 'time', label: isRu ? 'Удобное время (необязательно)' : 'Preferred time (optional)', ph: isRu ? 'Например, вечером по будням' : 'e.g. weekday evenings', type: 'text' },
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={`lead-${f.id}`} className="block text-xs tracking-widest2 uppercase text-baden-base/50 mb-2">
                      {f.label}
                    </label>
                    <input
                      id={`lead-${f.id}`}
                      type={f.type}
                      value={form[f.id]}
                      onChange={change(f.id)}
                      placeholder={f.ph}
                      className="w-full bg-transparent border-b border-baden-base/20 focus:border-baden-gold outline-none py-2.5 text-baden-base placeholder:text-baden-base/35 transition-colors duration-200"
                    />
                  </div>
                ))}
                {error && <p className="text-sm text-baden-gold">{error}</p>}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="mt-2 inline-flex items-center justify-center gap-2 text-sm tracking-widest uppercase text-baden-base bg-baden-gold-bright px-7 py-4 rounded-full hover:bg-baden-gold transition-colors duration-300"
                >
                  {isRu ? 'Отправить запрос' : 'Send request'}
                  <span aria-hidden>→</span>
                </motion.button>
                <p className="text-xs text-baden-base/40 leading-relaxed">
                  {isRu
                    ? 'Нажимая кнопку, вы соглашаетесь на обработку контактных данных для обратной связи.'
                    : 'By submitting, you agree to let us use your contact details to reach out.'}
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
