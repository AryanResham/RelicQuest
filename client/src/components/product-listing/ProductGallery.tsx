import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const allImages = images.length > 0 ? images : ["https://placehold.co/600x400/1a1f2e/9ca3af?text=No+Image"];

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Main Image Stage */}
      <div className="w-full relative group rounded-xl overflow-hidden bg-card-dark border border-[#292e38] shadow-sm">
        <div
          className="aspect-video w-full bg-contain bg-center bg-no-repeat cursor-zoom-in transition-transform duration-300"
          style={{
            backgroundImage: `url("${allImages[selectedImage]}")`,
          }}
        />

      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {allImages.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`cursor-pointer rounded-lg overflow-hidden h-20 bg-card-dark transition-all ${
                selectedImage === index
                  ? "ring-2 ring-primary"
                  : "border border-[#292e38] opacity-70 hover:opacity-100 hover:border-primary"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url("${image}")` }}
              />
            </button>
          ))}
          {allImages.length > 4 && (
            <button className="cursor-pointer flex items-center justify-center border border-[#292e38] hover:border-primary rounded-lg h-20 bg-card-dark opacity-70 hover:opacity-100 transition-all">
              <span className="text-text-secondary text-sm font-medium">+{allImages.length - 4}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
