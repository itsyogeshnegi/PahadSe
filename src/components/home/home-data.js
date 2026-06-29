import { HeartHandshake, Leaf, Mountain, Sparkles } from "lucide-react";

import garlicChilli from "@/assets/images/red-chilli.webp";
import hariMirch from "@/assets/images/green-chilli.webp";

export const flavours = [
  {
    id: "red-namak",
    name: "Classic Loon",
    price: 69,
    mrp: 80,
    tags: ["Spicy", "Tangy", "Flavorful"],
    image: garlicChilli,
    desc: "A warm, smoky blend of sun-dried red chilli and pahadi garlic - a little sprinkle wakes up everything from dal to dosa.",
    accent: "text-chili",
  },
  {
    id: "green-namak",
    name: "Hing Jera Loon",
    price: 59,
    mrp: 70,
    tags: ["Fresh", "Zesty", "Aromatic"],
    image: hariMirch,
    desc: "Bright green chilli folded with toasted cumin - fresh, fragrant, and gently fiery, the way the hills make it.",
    accent: "text-primary",
  },
];

export const promises = [
  { icon: Leaf, label: "100% Natural" },
  { icon: Sparkles, label: "No Preservatives" },
  { icon: Mountain, label: "Authentic Pahadi Taste" },
  { icon: HeartHandshake, label: "Made with Love" },
];
