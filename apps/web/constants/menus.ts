import type { NavMenu, NavMenuItems } from "~/types/nav";

export const navMenu: NavMenu[] = [
  {
    heading: "",
    items: [
      {
        title: "Home",
        icon: "i-lucide-home",
        link: "/",
      },
    ],
  },
  {
    heading: "Contents (API)",
    items: [
      {
        title: "Example",
        icon: "lucide:list",
        link: "/",
      },
    ],
  },
  {
    heading: "Media",
    items: [
      {
        title: "Files",
        icon: "lucide:image",
        link: "/media",
      },
    ],
  },
  {
    heading: "Permissions",
    items: [
      {
        title: "Member",
        icon: "lucide:user",
        link: "/settings",
      },
      {
        title: "Role",
        icon: "lucide:users",
        link: "/settings",
      },
      {
        title: "API Key",
        icon: "lucide:key-round",
        link: "/settings",
      },
    ],
  },
  {
    heading: "Others",
    items: [
      {
        title: "Settings",
        icon: "i-lucide-settings",
        link: "/settings",
      },
    ],
  },
];

export const navMenuBottom: NavMenuItems = [
  {
    title: "Help & Support",
    icon: "i-lucide-circle-help",
    link: "https://github.com/dianprata/nuxt-shadcn-dashboard",
  },
  {
    title: "Feedback",
    icon: "i-lucide-send",
    link: "https://github.com/dianprata/nuxt-shadcn-dashboard",
  },
];
