import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-border py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-lg">
            Please read these terms carefully before using our services.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Last Updated: 1 October 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Contents
              </h3>
              <nav className="flex flex-col gap-2 text-sm">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Text */}
          <div className="lg:col-span-3">
            <div className="space-y-12 text-foreground leading-relaxed">
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg italic text-muted-foreground">
                Welcome to Yupoosuha (“we”, “us”, “our”, or “Yupoosuha”). By accessing or using our website, including our Free Learning pages, you agree to comply with and be bound by these Terms & Conditions.
                <br />
                <span className="font-semibold text-foreground not-italic block mt-2">
                  If you do not agree with these Terms, please do not use our website or services.
                </span>
              </div>

              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {s.number}
                    </span>
                    {s.title}
                  </h2>
                  <div className="pl-11 space-y-4 text-muted-foreground">
                    {s.content}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer Callout */}
            <div className="mt-20 p-8 rounded-2xl bg-secondary/50 border border-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions regarding these Terms & Conditions, we're here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
              >
                Contact Our Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const sections = [
  {
    number: 1,
    id: 'about',
    title: 'About Yupoosuha',
    content: (
      <>
        <p>Yupoosuha provides educational and informational content related to:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0">
          {['Stock market and investing fundamentals', 'Personal finance and money management', 'Insurance awareness', 'Financial literacy', 'General learning resources', 'Product and service information', 'Selected third-party offers, referral links or affiliate links'].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span> {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-medium text-foreground">Our objective is to make financial and general learning concepts easier to understand.</p>
      </>
    )
  },
  {
    number: 2,
    id: 'educational',
    title: 'Educational Purpose Only',
    content: (
      <>
        <p>All information, articles, videos, examples, charts, illustrations and other content published on Yupoosuha are provided for educational and informational purposes only.</p>
        <p className="font-semibold text-foreground mt-4">Nothing on this website should be considered:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0 mt-2">
          {['Investment advice', 'Financial advice', 'Stock or security recommendations', 'Trading advice', 'Tax advice', 'Legal advice', 'Insurance advice', 'A guarantee of profit or financial return'].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-destructive mt-1">•</span> {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 p-3 bg-muted rounded-lg text-sm italic">
          You are responsible for conducting your own research and taking appropriate professional advice before making financial decisions.
        </p>
      </>
    )
  },
  {
    number: 3,
    id: 'risk',
    title: 'Investment Risk Disclaimer',
    content: (
      <>
        <p className="font-bold text-foreground">Investments in securities and financial products are subject to market risks.</p>
        <p>Past performance does not guarantee future results. Prices of stocks, mutual funds, ETFs, cryptocurrencies or other financial products may rise or fall, and you may lose some or all of your invested capital.</p>
        <p>Any examples of returns, profits, SIP calculations or investment scenarios shown on Yupoosuha are illustrative only and should not be interpreted as guaranteed returns.</p>
      </>
    )
  },
  {
    number: 4,
    id: 'guarantee',
    title: 'No Guarantee of Results',
    content: (
      <>
        <p>Yupoosuha does not guarantee:</p>
        <ul className="space-y-2 mt-2">
          {['Any specific investment return', 'Profit from trading or investing', 'Successful loan or insurance applications', 'Approval of financial products', 'Employment or business income', 'Any particular financial outcome'].map(item => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" /> {item}
            </li>
          ))}
        </ul>
        <p className="mt-4">Individual results may vary depending on several factors.</p>
      </>
    )
  },
  {
    number: 5,
    id: 'affiliate',
    title: 'Third-Party Links and Affiliate Disclosure',
    content: (
      <>
        <p>Our website may contain links to third-party websites, applications, products or services.</p>
        <p>Some links may be referral or affiliate links. If you use such a link and complete a qualifying transaction or action, Yupoosuha may receive a commission or referral benefit at no additional cost to you.</p>
        <p>The presence of an affiliate or referral link does not mean that Yupoosuha guarantees, endorses or accepts responsibility for the third-party product or service.</p>
        <p className="mt-2 text-sm p-3 border border-dashed border-border rounded-lg">
          Before using any third-party service, users should independently review its terms, fees, risks, privacy policy and other applicable conditions.
        </p>
      </>
    )
  },
  {
    number: 6,
    id: 'third-party',
    title: 'Third-Party Services',
    content: (
      <>
        <p>Yupoosuha may provide links to brokers, financial platforms, insurance providers, shopping websites, educational platforms or other third-party services.</p>
        <p>Once you leave the Yupoosuha website, you are subject to the terms and policies of the third-party website.</p>
        <p className="font-semibold text-foreground mt-4">Yupoosuha is not responsible for:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {['Third-party website content', 'Service interruptions', 'Transactions made with third parties', 'Third-party fees or charges', 'Changes in third-party products or services', 'Losses resulting from use of third-party services'].map(item => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" /> {item}
            </li>
          ))}
        </ul>
      </>
    )
  },
  {
    number: 7,
    id: 'accuracy',
    title: 'Accuracy of Information',
    content: (
      <>
        <p>We make reasonable efforts to provide useful and accurate information. However, financial markets, prices, regulations, products, offers and other information can change frequently.</p>
        <p>Therefore, we do not guarantee that all information on the website will always be complete, accurate, current or error-free.</p>
        <p className="mt-2 font-medium text-foreground">Users should verify important information with the relevant official source before making decisions.</p>
      </>
    )
  },
  {
    number: 8,
    id: 'property',
    title: 'Intellectual Property',
    content: (
      <>
        <p>Unless otherwise stated, the content published by Yupoosuha, including its logo, brand name, original articles, videos, graphics, website design, educational materials, original charts and illustrations, is owned by or licensed to Yupoosuha and may be protected by applicable intellectual-property laws.</p>
        <p>You may not reproduce, copy, modify, sell, redistribute or commercially exploit our original content without prior written permission.</p>
        <p className="mt-2 text-sm italic">Third-party trademarks, logos, brand names and materials remain the property of their respective owners.</p>
      </>
    )
  },
  {
    number: 9,
    id: 'conduct',
    title: 'User Conduct',
    content: (
      <>
        <p>You agree not to use the website for any unlawful or prohibited purpose.</p>
        <p className="font-semibold text-foreground mt-4">You must not:</p>
        <ul className="space-y-2 mt-2">
          {['Attempt to gain unauthorized access to the website', 'Disrupt or damage the website', 'Copy or reproduce protected content without permission', 'Upload malicious software', 'Misrepresent your identity', 'Use our content for fraudulent or misleading activities', 'Use our website in violation of applicable laws'].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <span className="text-destructive mt-1">×</span> {item}
            </li>
          ))}
        </ul>
      </>
    )
  },
  {
    number: 10,
    id: 'personal',
    title: 'Personal Information',
    content: (
      <>
        <p>If you voluntarily provide information through our website, contact forms, registration forms or other features, such information may be processed for the purposes explained in our Privacy Policy.</p>
        <p className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-500">
          ⚠️ Please do not submit sensitive personal, banking, password or financial-account information through unsecured communication channels.
        </p>
      </>
    )
  },
  {
    number: 11,
    id: 'availability',
    title: 'Website Availability',
    content: (
      <>
        <p>We aim to keep the website available and functional, but we do not guarantee uninterrupted or error-free access.</p>
        <p>We may modify, suspend, remove or update any website feature, content or service at any time.</p>
      </>
    )
  },
  {
    number: 12,
    id: 'liability',
    title: 'Limitation of Liability',
    content: (
      <>
        <p className="font-bold text-foreground">To the maximum extent permitted by applicable law, Yupoosuha and its owners, contributors and associated parties shall not be responsible for losses or damages arising from reliance on information published on the website or from the use of third-party websites, products or services.</p>
        <p className="mt-2">Users access and use the information provided by Yupoosuha at their own discretion and risk.</p>
      </>
    )
  },
  {
    number: 13,
    id: 'changes',
    title: 'Changes to These Terms',
    content: (
      <>
        <p>We may update these Terms & Conditions from time to time.</p>
        <p>Any updated version will be published on this page with the revised “Last Updated” date.</p>
        <p className="mt-2 font-medium text-foreground">Your continued use of the website after changes are published constitutes acceptance of the updated Terms.</p>
      </>
    )
  },
  {
    number: 14,
    id: 'law',
    title: 'Governing Law',
    content: (
      <>
        <p>These Terms & Conditions shall be governed by the applicable laws of India.</p>
        <p className="mt-2">Any disputes shall be subject to the jurisdiction of the appropriate courts in India.</p>
      </>
    )
  },
  {
    number: 15,
    id: 'contact',
    title: 'Contact Us',
    content: (
      <p>If you have questions regarding these Terms & Conditions, please contact us through the Contact section of the Yupoosuha website.</p>
    )
  },
]
