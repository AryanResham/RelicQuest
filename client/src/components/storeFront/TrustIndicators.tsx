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
    description: "Secure delivery to 100+ countries.",
  },
];
function TrustIndicators() {
  return (
    <section className="px-4 lg:px-10 py-4">
      <div className="flex gap-6 py-6 border-b border-[#292e38] justify-around">
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
