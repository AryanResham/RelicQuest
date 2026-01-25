import { Button } from "@/components/ui";

function Newsletter() {
  return (
    <>
      <section className="px-4 lg:px-10 pb-16">
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#292e38] to-[#1c1f26] p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex flex-col gap-4 max-w-lg z-10">
            <h2 className="text-white text-3xl font-bold">
              Never miss a rare drop.
            </h2>
            <p className="text-text-secondary text-lg">
              Join our exclusive newsletter to get notified about upcoming
              high-value auctions and daily trends.
            </p>
            <div className="flex gap-2 mt-2 flex-col sm:flex-row">
              <input
                className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none min-w-[280px]"
                placeholder="Enter your email"
                type="email"
              />
              <Button variant="primary" className="px-6 py-3">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="hidden md:block z-10">
            <span
              className="material-symbols-outlined text-primary/30"
              style={{ fontSize: 180 }}
            >
              mark_email_unread
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

export default Newsletter;
