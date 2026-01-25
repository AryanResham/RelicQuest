import AuctionCard from "../ui/AuctionCard";
const liveAuctions = [
  {
    id: 1,
    title: "1999 Charizard Holo",
    currentBid: "$12,500",
    timeLeft: "02h 14m",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDN0U80Dlpvkiez2Mtir7GHFrc7Nxndasq6xOmvw_QO1CID9NViNxhViYsFGx8Lu85xqr0GJvqBuehV79jQOIIAXxCxz4hZ3ky77BK_JsocBAwKA3jBBvRMsr89ncQS0jmleeALCzOmg8YwNufKXh1qjZz2EtjcRO6XMfrl2MhZ3EGp6YR2EpaBHkQWP9bhAEfvrSgP-o3BMeWOEitBfvLPB_xU9bDPX5lxc2OFemEqumAnfDthEy0bzqAjkqN1bvfbDZNHFyYACpI",
    imageAlt: "Rare Pokemon card in protective case",
    isUrgent: true,
  },
  {
    id: 2,
    title: "Rolex Submariner",
    currentBid: "$8,200",
    timeLeft: "05h 32m",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_45p-GFZSkWQVkIhVsTMHK7-uSTZiyQxWcbuNf8hidxKNo80G6B2Euk3nyoqrLk5XX0y91Ml32opL8aO88WibsNiY-bjX7Qly8Z0-Q88-5w4p2SE3pecI9nXjBS_GDK0--l0aYfpoBVU0qqN4N4J6XymV7vZQSu7WIN-VY0C7jIu36OJsH6-k2bPhzo3b8h4glypb6v3s-7hFtoOu0v3Se4FLB6cwxcjRVWmmNW2qYLHooQhn2Uj9J-j_1dTG8SZz_KgeTDZsM3U",
    imageAlt: "Luxury mechanical watch face close up",
    isUrgent: true,
  },
  {
    id: 3,
    title: "Vintage Gibson Les Paul",
    currentBid: "$4,500",
    timeLeft: "1d 12h",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCprU38qoAomcGdHPtvQmJ0m0PvLppguZXa06NIELMV2NkGSksocXiaZFRC730MSZb5844CfwbM4gIvGgnbCbLftG6mxU4NZh0NWZ424BXJ62m4RTuwaIhdGb0RYm03oIeyXhQe5xEcLSbdGwz3jMldtcXGQpDNzNNwlBB-O9I-3DOcQZFn6ZAfA2ZbYs-_kjpd5BXQAFmdKD76mMB1EctDvwMPSGhDUf55t5EiZBMUFJQNYgBNCHvYP2w3mTMXqCIohKMbC-wfZdE",
    imageAlt: "Vintage electric guitar body",
    isUrgent: false,
  },
  {
    id: 4,
    title: "Banksy Print",
    currentBid: "$22,000",
    timeLeft: "2d 04h",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcJM1l05WCZtkTS1jEvjhiPLAeCJ2Vclt1lWGnhIu8F9yxJZc02iRX96evOW8CxatU6JSzPRcDyT206Dua3metdsaX-Bmy_bPCWSXKCxPA-DmI9T4c37jkmiw7nXCNBU73PA5GAHrkKN6-LE03yog5DYl9kVjelY2lZc7wIg4QFi_csU1u0RDbUjkSysSP2gtv94yRrS-Ewj2uMT2GaIk6jRczsVztwIELx4CfWiQA70UIz3AoMOg47vH93CaP2GLniqDfcPUoxiE",
    imageAlt: "Street art style canvas print",
    isUrgent: false,
  },
];

function LiveAuctions() {
  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-10 pt-8 pb-4">
        <h2 className="text-white text-[28px] font-bold leading-tight tracking-[-0.015em]">
          Live Auctions
        </h2>
        <a
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
          href="#"
        >
          View All{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </a>
      </div>
      <section className="px-4 lg:px-10 pb-8">
        <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scroll-smooth [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {liveAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              title={auction.title}
              currentBid={auction.currentBid}
              timeLeft={auction.timeLeft}
              imageUrl={auction.imageUrl}
              imageAlt={auction.imageAlt}
              isUrgent={auction.isUrgent}
              onPlaceBid={() => console.log(`Placing bid on ${auction.title}`)}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default LiveAuctions;
