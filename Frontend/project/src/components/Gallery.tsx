import { useState } from "react";
import { createPortal } from "react-dom";
import { Facebook, Instagram, X } from "lucide-react";

type GalleryImage = {
  url: string;
  alt: string;
  description: string;
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const images: GalleryImage[] = [
    {
      url: "https://i.pinimg.com/1200x/48/98/3e/48983e3d343694dd9b780b9651e8793d.jpg",
      alt: "Restaurant",
      description:
        "Our dining space is designed to feel like a warm getaway — soft lighting, comfortable seating, and a layout that brings people together over good food. Whether it's a quiet dinner or a lively weekend gathering, this is where the magic happens.",
    },
    {
      url: "https://i.pinimg.com/736x/56/43/33/5643333d786a162edbe13d069f24e78d.jpg",
      alt: "Menu",
      description:
        "Every dish on our menu tells a story — from comforting classics to bold new flavors. We update it seasonally to make sure you always have something fresh and exciting to try, alongside the favorites you keep coming back for.",
    },
    {
      url: "https://i.pinimg.com/1200x/c7/7a/45/c77a45e2c2a22dff89c28ab800dcee6c.jpg",
      alt: "Table",
      description:
        "A perfectly set table is where every great meal begins. We take care of the little details — clean linens, thoughtful spacing, and a cozy setup — so you can focus on the conversation and the food in front of you.",
    },
    {
      url: "https://i.pinimg.com/1200x/c6/c0/6c/c6c06cefc361e1cabf992516ff2840c2.jpg",
      alt: "Kitchen",
      description:
        "This is where the real work happens. Our kitchen team preps and cooks every order with care, using fresh ingredients and time-tested techniques to bring you food that tastes like it was made just for you — because it was.",
    },
    {
      url: "https://i.pinimg.com/736x/90/b8/e2/90b8e2092a439e79a8644dfcf56089ca.jpg",
      alt: "Service Review",
      description:
        "Nothing means more to us than hearing from our guests. This moment captures what we strive for every single day — genuine smiles, honest feedback, and the satisfaction of knowing we made someone's meal a little more special.",
    },
    {
      url: "https://i.pinimg.com/736x/88/26/28/8826280cf0007953ea7c98ed0ccf9718.jpg",
      alt: "Counter",
      description:
        "Our counter is the first place you'll interact with our team — quick, friendly, and always ready to help you place your order or answer a question. It's a small space that sets the tone for your entire visit.",
    },
    {
      url: "https://i.pinimg.com/736x/dd/e9/74/dde974f310de20710e8c4d58d677f267.jpg",
      alt: "Lights",
      description:
        "As the evening sets in, our lighting transforms the whole space into something a little more intimate and magical. It's the small touches like this that turn a regular dinner into a memorable one.",
    },
    {
      url: "https://i.pinimg.com/736x/67/47/22/67472213c9148b004c162a22629c5805.jpg",
      alt: "Staff",
      description:
        "Behind every great meal is a team that genuinely cares. Our staff works together with passion and hospitality at heart, making sure every guest feels welcomed the moment they walk through the door.",
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gallery
          </h2>
          <p className="text-xl text-gray-600">
            A glimpse of our restaurant atmosphere
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer aspect-square"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-semibold">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Share Your Experience</h3>

          <p className="text-lg mb-6">
            Tag us on social media and share your favorite moments
          </p>

          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/savoryhaven"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-semibold hover:text-pink-500 transition duration-300"
            >
              #SavoryHaven
            </a>

            <a
              href="https://www.facebook.com/savoryhaven"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-semibold hover:text-blue-600 transition duration-300"
            >
              @savoryhaven
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          IMAGE POPUP
          Portal se seedha document.body mein render kiya, taaki
          Home page ke <main> wale transform (translate-x-0 /
          translate-x-64) se ye "position: fixed" popup clip/shift
          na ho — hamesha screen ke exact center mein stable rahe,
          chahe kisi bhi photo pe (kahin bhi scroll position pe)
          click kiya ho.
      ========================================================= */}
      {selectedImage &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedImage(null)}
                aria-label="Close"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-lg z-20 transition"
              >
                <X size={22} />
              </button>

              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 bg-black flex items-center justify-center p-6">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    className="max-h-[70vh] w-full object-contain rounded-xl"
                  />
                </div>

                <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">
                    {selectedImage.alt}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {selectedImage.description}
                  </p>

                  <div className="flex gap-6 items-center">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full text-white transition"
                    >
                      <Facebook size={20} />
                    </a>

                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-3 rounded-full text-white transition"
                    >
                      <Instagram size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}