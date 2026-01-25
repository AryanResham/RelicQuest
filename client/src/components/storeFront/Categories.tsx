import { CategoryCard } from "../ui";
const categories = [
  {
    id: 1,
    title: "Watches",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeFa3Q19dyBdV6_cL4nwgjC-ItvOe4diAwkZvrpaee-yk1JS0z8WRK-iopoS61gp-JzkWMSt6B_-k9qxDsyEMeQIqOQ9VmMi_BBN5WmjkvyB7UsT9CljhS6jvVCpKYaSfuvAfac5bS5iXk0MioI_9-2n5VtZmdbtPNZDlhFv1ru6iY6mr5aVqcpreDtCYHS-dvQTyjlt9kh8-P-0ftaUaSxiDZf7ENbYhR1mpnQWZAJVkOfPxgyAiO3PA2qmBjEyafPIGJjU6ok-Y",
    imageAlt: "Close up of mechanical watch gears",
  },
  {
    id: 2,
    title: "Art",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdCCQMlBiIgLolQoyRPhLZjR8NXewQObrT6hnXXElnGiq4YwYhYBVUZ7X4PCzYi89PhgEwNG8SD1fO0YBAUg_b1c1bsSRyNEkW9HVZYigOoarelAvPT7mntXotKlEHvI50AROQ-1b36jXkcM61JezlOtZHBzMQEOFKpaq8BlCvaLs7hheR9bbOqyf1XNQtVyA4zTGPI-Wesj20j5kycuUD3zoo2noF997Td0_mAdNf8IA5fedQuQOMPywQDH-SrjHnGp9Z4F5Bptk",
    imageAlt: "Abstract colorful art piece",
  },
  {
    id: 3,
    title: "Sports",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMguAkr7nymVgL5GiSV4FCIFMwpMiUgoJ_4tjxts28BoqEGWTATZvS94o3q6TDys0A1s7BdYVQZV10mKHyiO0oPzfoG06RnltPnNvco5tgxgQ5Z1vAeXYYPA7DqLq91XXFTmNKmKOxbqr1V_ALC2hCfXpjQsa2tvTmP86pAsFPHniM8FehS_9oe8HvKj3g6nZFAi6zUK8eIlonsrJxrQVhhMXTJebrytM260AvhMGdTl9WH-MnqKDtOAXFPVr3m_HE9b2H-ytYkoI",
    imageAlt: "Baseball glove and ball on grass",
  },
  {
    id: 4,
    title: "Coins",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAU4ioTg3xY8AUTuflAL77M4GDkibw7zbn5JNJGq3qoFcEWycsYFhIhoDUHImZZCe1KInQo2SBuOJQ_HB7r27Pm1xNlq-UpJUt5CNQgORmUEcPpipedmAu9-qP-VHglqM-5YLw2HLJupcFq8voMvkII3RETxW2z04yzXDuYkJ9FjwUnwitVWfY-ubsCpz76YtE_JuQJM0_xLo4nAfwDpQJobub6ceeQroKZvVfcamQ_gzEkTeW56izHy3JFcrD3Oc5lxzG9Nfl-qzk",
    imageAlt: "Old coins pile",
  },
  {
    id: 5,
    title: "Comics",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ1_SjCztAz5OssfNoc74S-_nr2T24CaxGLB9hMk0JQG-BlZAY4bP2vxpYn-RwLWMGRVCs7GjtOB5tnkhxODaoHel_qaoCn80o-MkxuWGNI18cCJVMusXG0nqnFMIJ6PAllYSGt5T3dJvRcPDn3pa_g5SY2CwJIspO1lPbluGawn8IhYwgls4bB8yJ70q-5DQTMI9AZWLnteW5DLpPEbUkyM3JKWcNDSBPMvzLpMe1c6BarKSsK31HsCdApxQnO5O72qqTnPjKUOs",
    imageAlt: "Colorful comic books stack",
  },
];
function Categories() {
  return (
    <>
      {/* Category Header */}
      <div className="px-4 lg:px-10 pt-4 pb-4">
        <h2 className="text-white text-[28px] font-bold leading-tight tracking-[-0.015em]">
          Browse by Category
        </h2>
      </div>

      {/* Categories Grid */}
      <section className="px-4 lg:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              imageUrl={category.imageUrl}
              imageAlt={category.imageAlt}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Categories;
