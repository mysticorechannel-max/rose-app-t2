import { ClipboardList, Gift, Headset, House, Info, PartyPopper } from "lucide-react";

export const navItems = [
  { key: "home", href: "/", icon: House },
  { key: "products", href: "/products", icon: Gift },
  { key: "categories", href: "/categories", icon: ClipboardList },
  { key: "occasions", href: "/occasions", icon: PartyPopper },
  { key: "contact", href: "/contact", icon: Headset },
  { key: "about", href: "/about", icon: Info },
] as const;
