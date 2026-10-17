import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Star,
  Heart,
  SlidersHorizontal,
  ArrowUpDown,
  Flame,
  X,
  Minus,
  Plus,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { getAuthHeaders, getAuthUser } from "./authStorage";
import { useToast } from "./Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export type FoodItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
};

export const fullMenuItems: FoodItem[] = [
    {
      id: 1,
      name: "Veg Burger",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy vegetable patty layered with lettuce and mayo.",
      category: "Burger",
    },
    {
      id: 2,
      name: "Cheese Burger",
      price: 179,
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
      description:
        "Juicy grilled burger topped with melted cheddar cheese.",
      category: "Burger",
    },
    {
      id: 3,
      name: "Chicken Burger",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80",
      description:
        "Grilled chicken fillet burger with fresh vegetables.",
      category: "Burger",
    },
    {
      id: 4,
      name: "Double Patty Burger",
      price: 249,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
      description:
        "Two juicy patties stacked with cheese and sauce.",
      category: "Burger",
    },
    {
      id: 5,
      name: "Margherita Pizza",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      description:
        "Classic mozzarella pizza with tomato sauce.",
      category: "Pizza",
    },
    {
      id: 6,
      name: "Pepperoni Pizza",
      price: 449,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
      description:
        "Spicy pepperoni slices loaded with cheese.",
      category: "Pizza",
    },
    {
      id: 7,
      name: "Farmhouse Pizza",
      price: 399,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
      description:
        "Veg pizza loaded with capsicum, onion and olives.",
      category: "Pizza",
    },
    {
      id: 8,
      name: "Paneer Tikka Pizza",
      price: 379,
      image:
        "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=800&q=80",
      description:
        "Indian style pizza topped with spicy paneer tikka.",
      category: "Pizza",
    },
    {
      id: 9,
      name: "Hakka Noodles",
      price: 249,
      image:
        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80",
      description:
        "Stir fried noodles tossed with vegetables.",
      category: "Noodles",
    },
    {
      id: 10,
      name: "Schezwan Noodles",
      price: 269,
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
      description:
        "Spicy noodles cooked in schezwan sauce.",
      category: "Noodles",
    },
    {
      id: 11,
      name: "Chicken Noodles",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1600490036275-35f5f1656861?auto=format&fit=crop&w=800&q=80",
      description:
        "Egg noodles mixed with tender chicken pieces.",
      category: "Noodles",
    },
    {
      id: 12,
      name: "Veg Manchurian",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy vegetable balls tossed in tangy sauce.",
      category: "Manchurian",
    },
    {
      id: 13,
      name: "Gobi Manchurian",
      price: 189,
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy cauliflower florets in spicy gravy.",
      category: "Manchurian",
    },
    {
      id: 14,
      name: "Chicken Manchurian",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1633352615955-f0c99e8b7e5a?auto=format&fit=crop&w=800&q=80",
      description:
        "Juicy chicken balls coated in flavorful sauce.",
      category: "Manchurian",
    },
    {
      id: 15,
      name: "French Fries",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80",
      description:
        "Golden crispy potato fries with seasoning.",
      category: "Fast Food",
    },
    {
      id: 16,
      name: "Cheese Fries",
      price: 159,
      image:
        "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy fries topped with melted cheese sauce.",
      category: "Fast Food",
    },
    {
      id: 17,
      name: "Chocolate Cake",
      price: 179,
      image:
        "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
      description:
        "Rich chocolate layered cake with smooth frosting.",
      category: "Dessert",
    },
    {
      id: 18,
      name: "Gulab Jamun",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1568827999250-3f6afff96e66?auto=format&fit=crop&w=800&q=80",
      description:
        "Soft milk-solid dumplings soaked in sugar syrup.",
      category: "Dessert",
    },
    {
      id: 19,
      name: "Vanilla Ice Cream",
      price: 99,
      image:
        "https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=800&q=80",
      description:
        "Creamy vanilla ice cream scoop.",
      category: "Dessert",
    },
    {
      id: 20,
      name: "Brownie with Ice Cream",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?auto=format&fit=crop&w=800&q=80",
      description:
        "Warm chocolate brownie served with ice cream.",
      category: "Dessert",
    },

    {
      id: 21,
      name: "Paneer Burger",
      price: 189,
      image:
        "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&w=800&q=80",
      description:
        "Grilled paneer patty burger with onion rings and mint mayo.",
      category: "Burger",
    },
    {
      id: 22,
      name: "Mushroom Burger",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=800&q=80",
      description:
        "Juicy mushroom patty topped with cheese and lettuce.",
      category: "Burger",
    },
    {
      id: 23,
      name: "BBQ Chicken Burger",
      price: 229,
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
      description:
        "Smoky BBQ glazed chicken fillet burger.",
      category: "Burger",
    },
    {
      id: 24,
      name: "Mexican Burger",
      price: 219,
      image:
        "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=800&q=80",
      description:
        "Spicy Mexican style burger with jalapenos and salsa.",
      category: "Burger",
    },
    {
      id: 25,
      name: "Cheese Burst Pizza",
      price: 449,
      image:
        "https://images.unsplash.com/photo-1613564834361-9436948817d1?auto=format&fit=crop&w=800&q=80",
      description:
        "Pizza loaded with molten cheese inside the crust.",
      category: "Pizza",
    },
    {
      id: 26,
      name: "Veg Supreme Pizza",
      price: 429,
      image:
        "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
      description:
        "Loaded with onion, capsicum, olives and mushrooms.",
      category: "Pizza",
    },
    {
      id: 27,
      name: "Chicken Tandoori Pizza",
      price: 479,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
      description:
        "Tandoori chicken chunks with spicy Indian flavor.",
      category: "Pizza",
    },
    {
      id: 28,
      name: "Four Cheese Pizza",
      price: 499,
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
      description:
        "Mozzarella, cheddar, parmesan and feta cheese blend.",
      category: "Pizza",
    },
    {
      id: 29,
      name: "Veg Fried Rice",
      price: 229,
      image:
        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80",
      description:
        "Stir fried rice mixed with vegetables and soy sauce.",
      category: "Chinese",
    },
    {
      id: 30,
      name: "Chicken Fried Rice",
      price: 269,
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
      description:
        "Aromatic rice tossed with chicken pieces and spices.",
      category: "Chinese",
    },
    {
      id: 31,
      name: "Schezwan Fried Rice",
      price: 249,
      image:
        "https://images.unsplash.com/photo-1600490036275-35f5f1656861?auto=format&fit=crop&w=800&q=80",
      description:
        "Spicy rice cooked in authentic schezwan sauce.",
      category: "Chinese",
    },
    {
      id: 32,
      name: "Spring Rolls",
      price: 179,
      image:
        "https://images.unsplash.com/photo-1598679253544-2c97992403ea?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy rolls stuffed with vegetables and noodles.",
      category: "Fast Food",
    },
    {
      id: 33,
      name: "Chilli Paneer",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
      description:
        "Paneer cubes tossed in spicy chilli sauce.",
      category: "Chinese",
    },
    {
      id: 34,
      name: "Chilli Chicken",
      price: 329,
      image:
        "https://images.unsplash.com/photo-1633352615955-f0c99e8b7e5a?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy chicken pieces cooked with capsicum and sauce.",
      category: "Chinese",
    },
    {
      id: 35,
      name: "Masala Dosa",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
      description:
        "South Indian crispy dosa stuffed with potato masala.",
      category: "South Indian",
    },
    {
      id: 36,
      name: "Idli Sambhar",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1694849789325-914b71ab4075?auto=format&fit=crop&w=800&q=80",
      description:
        "Soft steamed idlis served with sambhar and chutney.",
      category: "South Indian",
    },
    {
      id: 37,
      name: "Vada Pav",
      price: 89,
      image:
        "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?auto=format&fit=crop&w=800&q=80",
      description:
        "Mumbai style spicy potato fritter sandwich.",
      category: "Fast Food",
    },
    {
      id: 38,
      name: "Pav Bhaji",
      price: 159,
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
      description:
        "Spicy mashed vegetable curry served with butter pav.",
      category: "Indian",
    },
    {
      id: 39,
      name: "Chocolate Donut",
      price: 99,
      image:
        "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=800&q=80",
      description:
        "Soft donut topped with rich chocolate glaze.",
      category: "Dessert",
    },
    {
      id: 40,
      name: "Strawberry Shake",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
      description:
        "Fresh strawberry blended milkshake with cream topping.",
      category: "Beverage",
    },
    {
      id: 41,
      name: "Mango Shake",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80",
      description:
        "Fresh mango blended with chilled milk and ice cream.",
      category: "Beverage",
    },
    {
      id: 42,
      name: "Cold Coffee",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80",
      description:
        "Chilled coffee blended with milk and chocolate syrup.",
      category: "Beverage",
    },
    {
      id: 43,
      name: "Oreo Shake",
      price: 169,
      image:
        "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
      description:
        "Creamy milkshake blended with crushed Oreo cookies.",
      category: "Beverage",
    },
    {
      id: 44,
      name: "Lemon Soda",
      price: 79,
      image:
        "https://images.unsplash.com/photo-1611928237590-087afc90c6fd?auto=format&fit=crop&w=800&q=80",
      description:
        "Refreshing lemon soda with a hint of mint.",
      category: "Beverage",
    },
    {
      id: 45,
      name: "Paneer Butter Masala",
      price: 349,
      image:
        "https://images.unsplash.com/photo-1728910156510-77488f19b152?auto=format&fit=crop&w=800&q=80",
      description:
        "Soft paneer cubes cooked in creamy tomato gravy.",
      category: "Indian",
    },
    {
      id: 46,
      name: "Butter Chicken",
      price: 399,
      image:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
      description:
        "Tender chicken cooked in rich buttery tomato sauce.",
      category: "Indian",
    },
    {
      id: 47,
      name: "Chicken Biryani",
      price: 349,
      image:
        "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
      description:
        "Aromatic basmati rice layered with spiced chicken.",
      category: "Indian",
    },
    {
      id: 48,
      name: "Veg Biryani",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1631452180539-96aca7d48617?auto=format&fit=crop&w=800&q=80",
      description:
        "Fragrant rice cooked with mixed vegetables and spices.",
      category: "Indian",
    },
    {
      id: 49,
      name: "Rajma Chawal",
      price: 229,
      image:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
      description:
        "Kidney beans curry served with steamed rice.",
      category: "Indian",
    },
    {
      id: 50,
      name: "Chole Bhature",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80",
      description:
        "Spicy chickpea curry served with fluffy fried bread.",
      category: "Indian",
    },
    {
      id: 51,
      name: "Tandoori Roti",
      price: 29,
      image:
        "https://images.unsplash.com/photo-1710091691780-c7eb0dc50cf8?auto=format&fit=crop&w=800&q=80",
      description:
        "Whole wheat flatbread baked in clay oven.",
      category: "Indian",
    },
    {
      id: 52,
      name: "Butter Naan",
      price: 49,
      image:
        "https://images.unsplash.com/photo-1631292784640-2b24be784d5d?auto=format&fit=crop&w=800&q=80",
      description:
        "Soft naan brushed with melted butter.",
      category: "Indian",
    },
    {
      id: 53,
      name: "Garlic Naan",
      price: 59,
      image:
        "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
      description:
        "Naan topped with fresh garlic and butter.",
      category: "Indian",
    },
    {
      id: 54,
      name: "Veg Sandwich",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1615485290836-4ebcebf44aaf?auto=format&fit=crop&w=800&q=80",
      description:
        "Fresh vegetable sandwich with butter and chutney.",
      category: "Fast Food",
    },
    {
      id: 55,
      name: "Grilled Cheese Sandwich",
      price: 159,
      image:
        "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
      description:
        "Toasted sandwich stuffed with melted cheese.",
      category: "Fast Food",
    },
    {
      id: 56,
      name: "Club Sandwich",
      price: 189,
      image:
        "https://images.unsplash.com/photo-1688978181542-87a886a16fbe?auto=format&fit=crop&w=800&q=80",
      description:
        "Triple layered sandwich with veggies and cheese.",
      category: "Fast Food",
    },
    {
      id: 57,
      name: "Samosa",
      price: 25,
      image:
        "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy pastry stuffed with spicy potato filling.",
      category: "Fast Food",
    },
    {
      id: 58,
      name: "Kachori",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1606755456206-b25206cde27e?auto=format&fit=crop&w=800&q=80",
      description:
        "Deep fried crispy snack filled with spicy lentils.",
      category: "Fast Food",
    },
    {
      id: 59,
      name: "Rasmalai",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1660383534593-6b5221ab80d2?auto=format&fit=crop&w=800&q=80",
      description:
        "Soft cottage cheese balls soaked in sweetened milk.",
      category: "Dessert",
    },
    {
      id: 60,
      name: "Jalebi",
      price: 99,
      image:
        "https://images.unsplash.com/photo-1576618148423-df549bcb6972?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy deep fried spirals soaked in sugar syrup.",
      category: "Dessert",
    },
    {
      id: 61,
      name: "Gulab Jamun",
      price: 119,
      image:
        "https://images.unsplash.com/photo-1624000961428-eeece184988b?auto=format&fit=crop&w=800&q=80",
      description:
        "Soft fried dumplings soaked in sugar syrup.",
      category: "Dessert",
    },
    {
      id: 62,
      name: "Chocolate Brownie",
      price: 179,
      image:
        "https://images.unsplash.com/photo-1525203135335-74d272fc8d9c?auto=format&fit=crop&w=800&q=80",
      description:
        "Rich and fudgy chocolate brownie served warm.",
      category: "Dessert",
    },
    {
      id: 63,
      name: "Vanilla Ice Cream",
      price: 99,
      image:
        "https://images.unsplash.com/photo-1555050338-0abc773f7978?auto=format&fit=crop&w=800&q=80",
      description:
        "Classic creamy vanilla flavored ice cream.",
      category: "Dessert",
    },
    {
      id: 64,
      name: "Chocolate Ice Cream",
      price: 109,
      image:
        "https://images.unsplash.com/photo-1575919361890-69028a013637?auto=format&fit=crop&w=800&q=80",
      description:
        "Smooth and creamy chocolate ice cream scoop.",
      category: "Dessert",
    },
    {
      id: 65,
      name: "Strawberry Ice Cream",
      price: 109,
      image:
        "https://images.unsplash.com/photo-1615735486329-c61cd40bfcc6?auto=format&fit=crop&w=800&q=80",
      description:
        "Fresh strawberry flavored ice cream.",
      category: "Dessert",
    },
    {
      id: 66,
      name: "Farmhouse Pizza",
      price: 329,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
      description:
        "Loaded pizza topped with fresh vegetables and cheese.",
      category: "Fast Food",
    },
    {
      id: 67,
      name: "Paneer Tikka Pizza",
      price: 349,
      image:
        "https://images.unsplash.com/photo-1661081090290-9b66fd49d882?auto=format&fit=crop&w=800&q=80",
      description:
        "Pizza topped with spicy paneer tikka chunks.",
      category: "Fast Food",
    },
    {
      id: 68,
      name: "Cheese Burger",
      price: 189,
      image:
        "https://images.unsplash.com/photo-1605262157780-8910063b2bf9?auto=format&fit=crop&w=800&q=80",
      description:
        "Juicy burger loaded with melted cheese slice.",
      category: "Fast Food",
    },
    {
      id: 69,
      name: "Veg Momos",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1630431341636-999a7e047f3b?auto=format&fit=crop&w=800&q=80",
      description:
        "Steamed dumplings stuffed with fresh vegetables.",
      category: "Fast Food",
    },
    {
      id: 70,
      name: "Chicken Momos",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
      description:
        "Steamed dumplings filled with seasoned chicken.",
      category: "Fast Food",
    },
    {
      id: 71,
      name: "French Fries",
      price: 119,
      image:
        "https://images.unsplash.com/photo-1751560455942-f859f1215826?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy golden fries sprinkled with salt.",
      category: "Fast Food",
    },
    {
      id: 72,
      name: "Peri Peri Fries",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80",
      description:
        "Spicy peri peri seasoned crispy fries.",
      category: "Fast Food",
    },
    {
      id: 73,
      name: "Masala Chai",
      price: 49,
      image:
        "https://images.unsplash.com/photo-1594488506255-a8bbfdeedbaf?auto=format&fit=crop&w=800&q=80",
      description:
        "Traditional Indian tea brewed with spices.",
      category: "Beverage",
    },
    {
      id: 74,
      name: "Cappuccino",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1568901839119-631418a3910d?auto=format&fit=crop&w=800&q=80",
      description:
        "Hot coffee topped with creamy milk foam.",
      category: "Beverage",
    },
    {
      id: 75,
      name: "Fresh Lime Soda",
      price: 89,
      image:
        "https://images.unsplash.com/photo-1619158403521-ed9795026d47?auto=format&fit=crop&w=800&q=80",
      description:
        "Refreshing lime soda served chilled.",
      category: "Beverage",
    },
    {
      id: 76,
      name: "Classic Veg Pizza",
      price: 289,
      image:
        "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
      description:
        "Classic pizza loaded with fresh vegetables and mozzarella.",
      category: "Pizza",
    },
    {
      id: 77,
      name: "Mushroom Pizza",
      price: 359,
      image:
        "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80",
      description:
        "Fresh mushroom pizza with creamy mozzarella cheese.",
      category: "Pizza",
    },
    {
      id: 78,
      name: "Italian Pizza",
      price: 399,
      image:
        "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=800&q=80",
      description:
        "Authentic Italian pizza with herbs and olive oil.",
      category: "Pizza",
    },
    {
      id: 79,
      name: "Corn Cheese Pizza",
      price: 329,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
      description:
        "Sweet corn topped with extra cheese.",
      category: "Pizza",
    },
    {
      id: 80,
      name: "Mexican Pizza",
      price: 429,
      image:
        "https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=800&q=80",
      description:
        "Spicy Mexican style pizza with jalapenos.",
      category: "Pizza",
    },
    {
      id: 81,
      name: "Classic Veg Burger",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1713330801172-03f8d1c0dde7?auto=format&fit=crop&w=800&q=80",
      description:
        "Veg patty with lettuce, tomato and cheese.",
      category: "Burger",
    },
    {
      id: 82,
      name: "Crunchy Chicken Burger",
      price: 239,
      image:
        "https://images.unsplash.com/photo-1530554764233-e79e16c91d08?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy chicken burger with spicy sauce.",
      category: "Burger",
    },
    {
      id: 83,
      name: "BBQ Burger",
      price: 259,
      image:
        "https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=800&q=80",
      description:
        "BBQ sauce with grilled patty and cheese.",
      category: "Burger",
    },
    {
      id: 84,
      name: "Spicy Paneer Burger",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
      description:
        "Paneer patty served with spicy mayo.",
      category: "Burger",
    },
    {
      id: 85,
      name: "Aloo Tikki Burger",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
      description:
        "Indian style aloo tikki burger.",
      category: "Burger",
    },
    {
      id: 86,
      name: "Veg Chowmein",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80",
      description:
        "Chinese noodles tossed with vegetables.",
      category: "Chinese",
    },
    {
      id: 87,
      name: "Garlic Noodles",
      price: 229,
      image:
        "https://images.unsplash.com/photo-1627900440398-5db32dba8db1?auto=format&fit=crop&w=800&q=80",
      description:
        "Garlic flavored stir fried noodles.",
      category: "Chinese",
    },
    {
      id: 88,
      name: "Paneer Chilli",
      price: 279,
      image:
        "https://images.unsplash.com/photo-1603661688298-870c8958ebf8?auto=format&fit=crop&w=800&q=80",
      description:
        "Paneer tossed in spicy chilli sauce.",
      category: "Chinese",
    },
    {
      id: 89,
      name: "Veg Fried Momos",
      price: 169,
      image:
        "https://images.unsplash.com/photo-1607328874071-45a9cd600644?auto=format&fit=crop&w=800&q=80",
      description:
        "Crispy fried momos with spicy chutney.",
      category: "Chinese",
    },
    {
      id: 90,
      name: "Dragon Chicken",
      price: 349,
      image:
        "https://images.unsplash.com/photo-1684707878393-02606f779d7f?auto=format&fit=crop&w=800&q=80",
      description:
        "Hot and spicy dragon chicken.",
      category: "Chinese",
    },
    {
      id: 91,
      name: "Dal Tadka",
      price: 229,
      image:
        "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80",
      description:
        "Yellow dal tempered with Indian spices.",
      category: "Indian",
    },
    {
      id: 92,
      name: "Shahi Paneer",
      price: 329,
      image:
        "https://images.unsplash.com/photo-1627366422957-3efa9c6df0fc?auto=format&fit=crop&w=800&q=80",
      description:
        "Creamy paneer curry with rich gravy.",
      category: "Indian",
    },
    {
      id: 93,
      name: "Jeera Rice",
      price: 169,
      image:
        "https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=800&q=80",
      description:
        "Steamed rice flavored with cumin.",
      category: "Indian",
    },
    {
      id: 94,
      name: "Veg Thali",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1567529854338-fc097b962123?auto=format&fit=crop&w=800&q=80",
      description:
        "Complete Indian meal with multiple dishes.",
      category: "Indian",
    },
    {
      id: 95,
      name: "Palak Paneer",
      price: 319,
      image:
        "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80",
      description:
        "Paneer cubes cooked in spinach gravy.",
      category: "Indian",
    },
    {
      id: 96,
      name: "Fresh Orange Juice",
      price: 99,
      image:
        "https://images.unsplash.com/photo-1571328003758-4a3921661729?auto=format&fit=crop&w=800&q=80",
      description:
        "Freshly squeezed orange juice.",
      category: "Beverage",
    },
    {
      id: 97,
      name: "Watermelon Juice",
      price: 109,
      image:
        "https://images.unsplash.com/photo-1641665271888-575e46923776?auto=format&fit=crop&w=800&q=80",
      description:
        "Refreshing watermelon juice.",
      category: "Beverage",
    },
    {
      id: 98,
      name: "Chocolate Shake",
      price: 169,
      image:
        "https://images.unsplash.com/photo-1624781740834-fbfbf5fd221a?auto=format&fit=crop&w=800&q=80",
      description:
        "Rich chocolate milkshake.",
      category: "Beverage",
    },
    {
      id: 99,
      name: "Mint Mojito",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1619158401201-8fa932695178?auto=format&fit=crop&w=800&q=80",
      description:
        "Refreshing mint mojito.",
      category: "Beverage",
    },
    {
      id: 100,
      name: "Virgin Mojito",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?auto=format&fit=crop&w=800&q=80",
      description:
        "Lemon mint cooler with soda.",
      category: "Beverage",
    },
    {
      id: 101,
      name: "Red Velvet Cake",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1469533778471-92a68acc3633?auto=format&fit=crop&w=800&q=80",
      description:
        "Soft red velvet cake with cream cheese frosting.",
      category: "Dessert",
    },
    {
      id: 102,
      name: "Black Forest Cake",
      price: 219,
      image:
        "https://images.unsplash.com/photo-1556953410-b77c8b035596?auto=format&fit=crop&w=800&q=80",
      description:
        "Chocolate cake with cherries and cream.",
      category: "Dessert",
    },
    {
      id: 103,
      name: "Fruit Custard",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
      description:
        "Fresh fruits mixed with creamy custard.",
      category: "Dessert",
    },
    {
      id: 104,
      name: "Kulfi",
      price: 99,
      image:
        "https://images.unsplash.com/photo-1568827999250-3f6afff96e66?auto=format&fit=crop&w=800&q=80",
      description:
        "Traditional Indian frozen dessert.",
      category: "Dessert",
    },
    {
      id: 105,
      name: "Cheesecake",
      price: 249,
      image:
        "https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=800&q=80",
      description:
        "Creamy baked cheesecake with rich flavor.",
      category: "Dessert",
    },
  ];

type FullMenuProps = {
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
};

type SortType = "default" | "low" | "high" | "az";

export default function FullMenu({
  cartItems,
  setCartItems,
}: FullMenuProps) {
  const appToast = useToast();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortType>("default");
  const [toast, setToast] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const menu = fullMenuItems;

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(menu.map((item) => item.category))),
    ];
  }, []);

  const filteredMenu = useMemo(() => {
    let items = menu.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "low") {
      items = [...items].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "az") {
      items = [...items].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return items;
  }, [search, activeCategory, sortBy]);

  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 1800);
  };

  // ==========================================
  // CART QUANTITY (source of truth = cartItems)
  // Add button dikhta hai jab tak item cart mein
  // nahi hai. Add hote hi wahi jagah stepper
  // (- qty +) mein badal jaati hai.
  // ==========================================

  const getCartQuantity = (id: number) => {
    const cartItem = cartItems.find((ci) => ci.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const addToCart = (item: FoodItem) => {
    setCartItems((prevCartItems) => {
      const existing = prevCartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existing) {
        return prevCartItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                image: item.image,
              }
            : cartItem
        );
      }

      return [
        ...prevCartItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        },
      ];
    });

    showToast(`${item.name} added to cart`);
  };

  const increaseCartQuantity = (item: FoodItem) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const decreaseCartQuantity = (id: number) => {
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const getRating = (id: number) =>
    (4.4 + (id % 6) / 10).toFixed(1);

  // =========================================================
  // FAVORITES
  // "fullmenu-" prefix isliye taaki Full Menu ke item IDs
  // Home page ke menu item IDs se overlap na karein.
  // =========================================================

  const [favoriteKeys, setFavoriteKeys] = useState<string[]>([]);
  useEffect(() => {
    const user = getAuthUser();

    if (!user.email) return;

    fetch(
      `${API_URL}/favorites/${encodeURIComponent(user.email)}`,
      { headers: getAuthHeaders() }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavoriteKeys(
            data.map((favorite: { food_key: string }) => favorite.food_key)
          );
        }
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = async (item: FoodItem) => {
    const user = getAuthUser();

    if (!user.email) {
      appToast.warning("Please login to save favorites");
      return;
    }

    const foodKey = `fullmenu-${item.id}`;
    const isFavorited = favoriteKeys.includes(foodKey);

    try {
      if (isFavorited) {
        const response = await fetch(
          `${API_URL}/favorites/${encodeURIComponent(foodKey)}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        if (response.ok) {
          setFavoriteKeys((prev) =>
            prev.filter((key) => key !== foodKey)
          );
          appToast.info("Removed from favorites");
        }
      } else {
        const response = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            user_email: user.email,
            food_key: foodKey,
            food_name: item.name,
            price: item.price,
            image: item.image,
          }),
        });

        if (response.ok) {
          setFavoriteKeys((prev) => [...prev, foodKey]);
          appToast.success("Added to favorites");
        }
      }
    } catch {
      appToast.error("Unable to update favorites");
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[radial-gradient(circle_at_top_left,#fff7ed,transparent_32%),linear-gradient(135deg,#fff,#fffbeb,#fff7ed)] dark:bg-[radial-gradient(circle_at_top_left,#431407,transparent_30%),linear-gradient(135deg,#020617,#0f172a,#1e1b4b)]">

      {toast && (
        <div className="toast-success">
          {toast}
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 p-5 md:p-8 text-white shadow-xl mb-6">

          <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/20 rounded-full blur-3xl" />

          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-yellow-300/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur mb-3 text-sm font-semibold">
              <Flame size={18} />
              Fresh menu • Fast ordering
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              Explore Full Menu
            </h1>

            <p className="text-orange-50 text-sm md:text-base max-w-xl">
              Search, filter and add your favorite dishes quickly.
            </p>

          </div>
        </div>

        {/* FILTERS */}

        <div className="glass-card rounded-2xl p-3 md:p-4 mb-7 sticky top-20 z-30">

          <div className="flex flex-col lg:flex-row gap-3 items-stretch">

            <div className="relative flex-1 lg:max-w-xl">

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                size={18}
              />

              <input
                type="text"
                placeholder="Search food, category or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-orange-100 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
              />

            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-100 text-orange-700 font-bold"
            >
              {showFilters ? (
                <X size={20} />
              ) : (
                <SlidersHorizontal size={20} />
              )}

              Filters
            </button>

            <div
              className={`${
                showFilters ? "flex" : "hidden"
              } lg:flex flex-col sm:flex-row gap-3`}
            >

              <select
                value={activeCategory}
                onChange={(e) =>
                  setActiveCategory(e.target.value)
                }
                className="px-4 py-2.5 rounded-xl border border-orange-100 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 text-gray-800 dark:text-white outline-none"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as SortType)
                }
                className="px-4 py-2.5 rounded-xl border border-orange-100 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 text-gray-800 dark:text-white outline-none"
              >
                <option value="default">
                  Default Sort
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>

                <option value="az">
                  Name: A to Z
                </option>
              </select>

            </div>
          </div>

          <div className="hidden md:flex flex-wrap gap-2 mt-3">

            {categories.slice(0, 12).map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-orange-600 to-red-500 text-white shadow"
                    : "bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-200 hover:bg-orange-50"
                }`}
              >
                {category}
              </button>
            ))}

          </div>
        </div>

        {/* RESULT COUNT */}

        <div className="flex items-center justify-between mb-5">

          <p className="text-gray-600 dark:text-gray-300 font-semibold">
            Showing{" "}
            <span className="text-orange-600 font-extrabold">
              {filteredMenu.length}
            </span>{" "}
            items
          </p>

          <div className="hidden sm:flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm">
            <ArrowUpDown size={16} />

            {sortBy === "default"
              ? "Recommended"
              : "Sorted"}
          </div>

        </div>

        {/* NO FOOD */}

        {filteredMenu.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">

            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              No food found
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Try another search or category.
            </p>

          </div>
        ) : (

          /* FOOD GRID */

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">

            {filteredMenu.map((item) => (

              <article
                key={item.id}
                className="group glass-card hover-lift rounded-3xl overflow-hidden flex flex-col border border-orange-100/60 dark:border-slate-700/60"
              >

                {/* IMAGE */}

                <div className="relative h-56 overflow-hidden bg-orange-100 dark:bg-slate-800">

                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;

                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "1";

                        target.src =
                          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-orange-600 font-bold text-xs shadow">
                    {item.category}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(item)}
                    aria-label={
                      favoriteKeys.includes(`fullmenu-${item.id}`)
                        ? `Remove ${item.name} from favorites`
                        : `Add ${item.name} to favorites`
                    }
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 shadow flex items-center justify-center hover:scale-110 transition"
                  >
                    <Heart
                      size={18}
                      className="text-red-500"
                      fill={
                        favoriteKeys.includes(`fullmenu-${item.id}`)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white font-bold">

                    <Star
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    {getRating(item.id)}

                  </div>

                </div>

                {/* FOOD DETAILS */}

                <div className="p-5 flex flex-col flex-1">

                  <div className="flex justify-between gap-3 mb-2">

                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white line-clamp-1">
                      {item.name}
                    </h2>

                    <span className="text-xl font-extrabold text-orange-600">
                      ₹{item.price}
                    </span>

                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 line-clamp-2 min-h-[40px]">
                    {item.description}
                  </p>

                  {/* ADD / QUANTITY STEPPER */}

                  <div className="mt-auto">

                    {getCartQuantity(item.id) === 0 ? (

                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-orange-300/50 hover:-translate-y-1 transition"
                      >
                        <ShoppingCart size={18} />
                        Add
                      </button>

                    ) : (

                      <div className="w-full flex items-center justify-between rounded-2xl bg-orange-50 dark:bg-slate-800 border border-orange-100 dark:border-slate-700 overflow-hidden">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseCartQuantity(item.id)
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-12 h-12 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="font-bold text-gray-900 dark:text-white">
                          {getCartQuantity(item.id)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseCartQuantity(item)
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-12 h-12 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}