export const MENU_ITEMS = [
  {
    title: "Explore",
    path: "/explore",
    isPrivate: false,
  },
  {
    title: "MyPage",
    path: "/account",
    isPrivate: true,
  },
];

export const PUBLIC_MENU_ITEMS = MENU_ITEMS.filter((item) => !item.isPrivate);

export const USER_MENU_ITEMS = [
  {
    title: "Profile",
    path: "/user",
    children: [
      {
        title: "Edit Profile",
        path: "/user/edit",
      },
      {
        title: "Change Password",
        path: "/user/password",
      },
    ],
  },
  {
    title: "My Artworks",
    path: "/user/artworks",
    children: [
      {
        title: "Create Artwork",
        path: "/user/artworks/create",
      },
    ],
  },
  {
    title: "Purchase History",
    path: "/user/purchases",
  },
  {
    title: "Sales History",
    path: "/user/sales",
  },
];
