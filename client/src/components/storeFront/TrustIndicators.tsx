import { ShieldCheck, LockKeyhole, Globe } from "lucide-react";
import { TrustIndicator } from "../ui";

// Trust indicators data
const trustIndicators = [
  {
    icon: <ShieldCheck />,
    title: "Verified Authenticity",
    description: "Every item is vetted by experts.",
  },
  {
    icon: <LockKeyhole />,
    title: "Secure Payments",
    description: "Transactions are protected end-to-end.",
  },
  {
    icon: <Globe />,
    title: "Global Shipping",
    description: "We deliver securely to over 100 countries.",
  },
];
function TrustIndicators() {
  return (
    <section className="px-4 lg:px-10 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[#292e38]">
        {trustIndicators.map((indicator) => (
          <TrustIndicator
            key={indicator.title}
            icon={indicator.icon}
            title={indicator.title}
            description={indicator.description}
          />
        ))}
      </div>
    </section>
  );
}

export default TrustIndicators;
