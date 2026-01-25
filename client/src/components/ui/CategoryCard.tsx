interface CategoryCardProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  href?: string;
}

function CategoryCard({
  title,
  imageUrl,
  imageAlt,
  href = "#",
}: CategoryCardProps) {
  return (
    <a
      className="group relative flex flex-col overflow-hidden rounded-xl aspect-[4/3] bg-[#292e38]"
      href={href}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
        data-alt={imageAlt}
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      {/* Title */}
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
    </a>
  );
}

export default CategoryCard;
