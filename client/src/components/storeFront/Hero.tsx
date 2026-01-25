import { Button } from "../ui";

function Hero() {
  return (
    <section className="@container w-full px-4 lg:px-10 py-6 lg:py-8">
      <div
        className="flex min-h-[480px] lg:min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-2xl items-start justify-end px-6 pb-10 lg:px-16 lg:pb-16 relative overflow-hidden"
        data-alt="Abstract dark gradient mesh representing premium digital atmosphere"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnaHYBo3TesQEJIfxb2CoLAi-7o6Rl4h-PlMDt9EwDQUm3D0n3htaXIKkNDfMeFo7k7ND6snNGzWZvn3KahdKm9vyR5s-pIMHRhl05giJL3_nwJIcASwEDRHUNHG4NcNuskZe9HYBES2Z8AzjEtqTwskDFzyovKPPI-mBjlzidw6plW7tErgI5JhmiUcVmdX-uGTGkmEpZyv2hVGb9_kreGg0H9_sG3danrUJTd9ZIEVeTwTRqIWyw03K2MkxA1V3UjbEKOfDU7bo")`,
        }}
      >
        {/* Optional overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent opacity-60"></div>
        <div className="flex flex-col gap-3 text-left relative z-10 max-w-2xl">
          <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl drop-shadow-lg">
            Discover the Extraordinary.
          </h1>
          <h2 className="text-gray-200 text-lg font-normal leading-relaxed md:text-xl drop-shadow-md max-w-xl">
            Buy and sell the world's most sought-after collectibles in a secure,
            premium marketplace.
          </h2>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10 mt-2">
          <Button
            variant="primary"
            size="lg"
            glow
            className="shadow-[0_4px_20px_rgba(25,93,230,0.4)]"
          >
            Start Selling
          </Button>
          <Button variant="ghost" size="lg">
            Browse Auctions
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
