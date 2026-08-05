import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Reveal, RevealLines, fadeUp, motion } from './motion';

// Small monoline icon set, matching the 24px/stroke-1.8 style already used
// elsewhere on the page (HowItWorks' CheckIcon, Audiences' checkmark) —
// no icon library, just the same hand-drawn convention reused.
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M7 17l-1.6 3.6a.4.4 0 00.53.53L9.5 19.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 12a8 8 0 10-14.6 4.6L4 20l3.6-1.1A8 8 0 0020 12z" strokeLinejoin="round" />
    <path d="M9 9.7c0 3 2.5 5.4 5.4 5.4.5 0 1-.5.9-1l-.2-1-1.9-.5-.8 1c-1.1-.5-2-1.4-2.5-2.5l1-.8-.5-1.9-1-.2c-.5 0-.9.5-.4 1.5z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TelegramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M21 4L3 11.5l6 2M21 4l-3 16-6-4.5M21 4L9 13.5m0 0v5l3-3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PhoneIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 006 6l1.5-2L21 14.5v3a1.5 1.5 0 01-1.6 1.5A16 16 0 015 6.6 1.5 1.5 0 016.5 3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ClockIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GlobeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z" />
  </svg>
);
const ShieldIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M12 3.5l7 2.5v5.2c0 4.4-2.9 7.6-7 9.3-4.1-1.7-7-4.9-7-9.3V6l7-2.5z" strokeLinejoin="round" />
    <path d="M9.3 12l1.8 1.8 3.6-3.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CONTACTS = [
  { icon: WhatsAppIcon, l: 'WhatsApp', v: '+90 000 000 00 00' },
  { icon: TelegramIcon, l: 'Telegram', v: '@baden_premium' },
  { icon: PhoneIcon, l: { ru: 'Телефон', en: 'Phone' }, v: '+90 000 000 00 00' },
];

const REASSURANCE = [
  { icon: ClockIcon, ru: 'Ответ в течение дня', en: 'Reply within a day' },
  { icon: GlobeIcon, ru: 'Консультация на русском', en: 'Consultation in Russian' },
  { icon: ShieldIcon, ru: 'Без каких-либо обязательств', en: 'No obligation' },
];

// A single field with a floating label (guide §7): the label sits as a
// placeholder at rest and floats up + shrinks on focus or once the field has
// a value, and a brass underline draws in from the left on focus. Kept as
// its own component so the interaction is defined once and reused per field.
export function FloatField({ id, label, type, value, onChange, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative pt-4">
      <label
        htmlFor={`lead-${id}`}
        className={`absolute left-0 pointer-events-none origin-left transition-all duration-200 ease-out ${
          floated
            ? 'top-0 text-[10px] tracking-widest2 uppercase text-baden-on-dark/55'
            : 'top-5 text-sm text-baden-on-dark/50'
        }`}
      >
        {label}
      </label>
      <input
        id={`lead-${id}`}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent outline-none py-2 text-sm text-baden-on-dark"
      />
      {/* Static hairline + bronze underline that scales in from the left on
          focus. */}
      <span className="absolute bottom-0 left-0 h-px w-full bg-baden-line" aria-hidden />
      <span
        className={`absolute bottom-0 left-0 h-px w-full bg-baden-brand origin-left transition-transform duration-300 ease-out ${
          focused ? 'scale-x-100' : 'scale-x-0'
        }`}
        aria-hidden
      />
    </div>
  );
}

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
    // The concierge moment, still the dark register — but the form itself
    // is no longer a boxed panel sitting ON the section (see the form
    // markup below): it reads as fields built directly into the ground,
    // the same way the FloatField underline already worked on any
    // background. Text across the section is a size down from the previous
    // pass, and the plain contact list became small icon cards plus a row
    // of reassurance chips, so the section reads as more than a headline
    // and a lonely floating card.
    <section id="contact" className="relative bg-baden-dark py-24 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start relative">
        {/* Left — persuasion + contact cards + reassurance */}
        <div>
          <h2 className="font-display font-light text-3xl md:text-5xl text-baden-on-dark leading-[1.05] tracking-[-0.02em] mb-4">
            <RevealLines lines={isRu ? ['Подберём резиденцию', <>под вашу <span className="font-medium">цель</span></>] : ['Find the residence', <>for your <span className="font-medium">goal</span></>]} />
          </h2>
          <Reveal className="text-sm text-baden-on-dark/70 max-w-md leading-relaxed mb-8">
            {isRu
              ? 'Оставьте контакт. Расскажем про форматы, цены по сезонам и оформление ТАПУ в коротком разговоре, на русском.'
              : "Leave your contact. We'll walk you through formats, seasonal pricing, and the TAPU process in a short call."}
          </Reveal>

          {/* Contact methods, as small icon cards rather than a plain list. */}
          <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {CONTACTS.map((c) => {
              const Icon = c.icon;
              const label = typeof c.l === 'string' ? c.l : isRu ? c.l.ru : c.l.en;
              return (
                <div
                  key={label}
                  className="flex flex-col gap-2.5 rounded-panel border border-baden-line bg-baden-dark-4/30 px-4 py-3.5"
                >
                  <Icon className="h-4 w-4 text-baden-brand-bright" />
                  <div>
                    <p className="text-[10px] tracking-widest2 uppercase text-baden-on-dark/45">{label}</p>
                    <p className="text-xs text-baden-on-dark/85 mt-0.5">{c.v}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>

          {/* Reassurance chips — small icon+text row, no card chrome, sits
              lighter than the contact cards above it. */}
          <Reveal className="flex flex-col gap-2.5">
            {REASSURANCE.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.en} className="flex items-center gap-2.5 text-xs text-baden-on-dark/60">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-baden-on-dark/40" />
                  {isRu ? r.ru : r.en}
                </div>
              );
            })}
          </Reveal>
        </div>

        {/* Right — the form, deliberately unboxed: no border, no fill, no
            shadow. Fields sit straight on the section's own ground, the
            same treatment the underline inputs already used inside their
            old card, just without the card. */}
        <Reveal variants={fadeUp} className="relative">
          {/* Faint ambient glow — no hard edge, just enough to draw the eye
              here without implying a container boundary. */}
          <div
            className="pointer-events-none absolute -inset-16 -z-10 opacity-60 blur-3xl"
            style={{ background: 'radial-gradient(50% 50% at 50% 35%, rgba(212,175,55,0.14) 0%, transparent 70%)' }}
            aria-hidden
          />
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center lg:text-left"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-baden-brand text-baden-brand-bright mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
              <p className="font-display text-xl md:text-2xl text-baden-on-dark mb-2">{isRu ? 'Спасибо!' : 'Thank you!'}</p>
              <p className="text-sm text-baden-on-dark/60">
                {isRu ? 'Мы получили запрос и свяжемся с вами в ближайшее время.' : "We've received your request and will be in touch shortly."}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit}>
              <h3 className="font-display text-lg md:text-xl text-baden-on-dark mb-6">
                {isRu ? 'Получить консультацию' : 'Request a consultation'}
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { id: 'name', label: isRu ? 'Имя' : 'Name', type: 'text', ac: 'name' },
                  { id: 'phone', label: isRu ? 'Телефон / WhatsApp' : 'Phone / WhatsApp', type: 'tel', ac: 'tel' },
                  { id: 'time', label: isRu ? 'Удобное время (необязательно)' : 'Preferred time (optional)', type: 'text', ac: 'off' },
                ].map((f) => (
                  <FloatField
                    key={f.id}
                    id={f.id}
                    label={f.label}
                    type={f.type}
                    value={form[f.id]}
                    onChange={change(f.id)}
                    autoComplete={f.ac}
                  />
                ))}
                {error && (
                  <p role="alert" className="text-xs text-baden-danger">
                    {error}
                  </p>
                )}
                {/* Button depth-shift on hover (guide §7): instead of a flat
                    fill swap, the fill deepens one shade AND an inset shadow
                    appears, so the pill reads as pressed-in rather than just
                    recolored. */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-2 inline-flex items-center justify-center gap-2 text-xs tracking-widest2 uppercase text-baden-brand-bright border border-baden-brand px-6 py-3.5 rounded-full hover:bg-baden-brand/10 transition-colors duration-300 self-start"
                >
                  {isRu ? 'Отправить запрос' : 'Send request'}
                  <span aria-hidden>→</span>
                </motion.button>
                <p className="text-[11px] text-baden-on-dark/55 leading-relaxed">
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
