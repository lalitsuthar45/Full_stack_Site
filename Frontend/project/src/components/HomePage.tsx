import Hero from "./Hero";
import MenuSection from "./MenuSection";
import About from "./About";
import Gallery from "./Gallery";
import Contact from "./Contact";
import type { CartItem } from "./FullMenu";

export type HomePageProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isMenuOpen: boolean;
};

export default function HomePage({
  cartItems,
  setCartItems,
  isMenuOpen,
}: HomePageProps) {
  return (
    <main
      className={`page-transition pt-16 transition-transform duration-300 ${
        isMenuOpen ? "translate-x-64" : "translate-x-0"
      }`}
    >
      <Hero />
      <MenuSection cartItems={cartItems} setCartItems={setCartItems} />
      <About />
      <Gallery />
      <Contact />
    </main>
  );
}
