import Hero from '../Hero'

type PolicyKind = 'privacy' | 'terms'

const privacySections = [
  ['Information you provide', 'We may receive details you submit when you create an account, book a session, join a waitlist, contact the studio, or complete a health and safety form.'],
  ['How we use information', 'We use information to manage memberships and bookings, communicate about your sessions, support studio safety, process payments through our payment partners, and improve the studio experience.'],
  ['Sharing and service providers', 'We share information only with service providers needed to operate the studio, such as booking, payment, hosting, analytics, or communication providers, and where required by law.'],
  ['Your choices', 'You can contact the studio to ask about the personal information associated with your account, request corrections, or ask questions about this notice.'],
]

const termsSections = [
  ['Bookings', 'Bookings are subject to availability and are confirmed when payment or membership validation is complete. Please select the correct class level and keep your contact details current.'],
  ['Memberships', 'Memberships and packages are personal and non-transferable. Review the plan billing period, renewal terms, and included sessions before payment.'],
  ['Safety', 'Tell your instructor about injuries, health conditions, pregnancy, or limitations before participating. Follow reasonable instructor guidance and stop if an exercise causes pain or unusual discomfort.'],
  ['Studio conduct', 'Clients are expected to arrive prepared, care for equipment, respect other clients, and follow the Studio Guidelines.'],
]

export default function PolicyPages({ kind }: { kind: PolicyKind }) {
  const privacy = kind === 'privacy'
  const sections = privacy ? privacySections : termsSections
  const title = privacy ? 'Privacy Policy' : 'Terms of Service'
  const subtitle = privacy ? 'A clear overview of how Sculpt LAB handles information.' : 'The shared terms for a considered studio experience.'
  return <div className="w-full"><Hero title={title} subtitle={subtitle} imageSrc="/images/membership-monthly-unlimited.png" imageAlt="Sculpt LAB Pilates studio" /><main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24"><p className="mb-4 text-sm uppercase tracking-[0.24em] text-accent">Sculpt LAB</p><h1 className="section-title mb-5 text-primary">{privacy ? 'Your information, handled with care.' : 'A clear foundation for every session.'}</h1><p className="body-text mb-12 max-w-2xl text-lg text-foreground/70">{privacy ? 'This general information is intended to explain our studio practices. Contact us if you have a question about a specific situation.' : 'Please read these terms alongside our Studio Guidelines and the details shown for your selected membership or booking.'}</p><div className="grid gap-8 md:grid-cols-2">{sections.map(([heading, text]) => <section key={heading} className="border-t border-primary/20 pt-5"><h2 className="mb-3 font-serif text-2xl text-primary">{heading}</h2><p className="body-text text-sm text-foreground/70">{text}</p></section>)}</div><p className="mt-14 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">Last updated: September 2026. These pages are informational and may be updated as the studio evolves.</p></main></div>
}
