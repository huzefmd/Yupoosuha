import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/disclaimer')({
  component: DisclaimerPage,
})

function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-border py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Investment Disclaimer
          </h1>
          <p className="text-muted-foreground text-lg">
            Important information regarding the content provided on Yupoosuha.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="space-y-8">

          {/* Main Alert Box */}
          <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg mb-10">
            <p className="text-foreground font-semibold text-lg leading-relaxed">
              Yupoosuha provides educational content only.
            </p>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-12">
            <section className="flex gap-6">
              <div className="hidden sm:flex shrink-0 h-12 w-12 rounded-full bg-primary/10 items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Educational Purpose</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The information available on this website, including videos, articles, examples, charts and social-media content, is intended solely for general education and financial literacy.
                </p>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="hidden sm:flex shrink-0 h-12 w-12 rounded-full bg-primary/10 items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Not Professional Advice</h2>
                <p className="text-muted-foreground leading-relaxed">
                  It is not investment, financial, trading, tax or legal advice and should not be treated as a recommendation to buy, sell or hold any security or financial product.
                </p>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="hidden sm:flex shrink-0 h-12 w-12 rounded-full bg-primary/10 items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Market Risk Warning</h2>
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                  <p className="text-foreground font-semibold mb-2">⚠️ Investments are subject to market risks.</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Past performance is not indicative of future results. Please conduct your own research and consult a qualified financial professional where appropriate before making investment decisions.
                  </p>
                </div>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="hidden sm:flex shrink-0 h-12 w-12 rounded-full bg-primary/10 items-center justify-center text-primary font-bold">
                4
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">No Guarantees</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Yupoosuha does not guarantee any particular return, profit or financial outcome.
                </p>
              </div>
            </section>
          </div>

          {/* Affiliate Disclosure Card */}
          <div className="mt-16 p-8 rounded-2xl bg-secondary/50 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-primary">📢</span> Affiliate Disclosure
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Some links on this website may be referral or affiliate links. Yupoosuha may receive a commission or referral benefit when users complete qualifying actions through such links, at no additional cost to the user.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
