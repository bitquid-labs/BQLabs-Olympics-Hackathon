export type MenuType = {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  description?: string;
  subMenus?: MenuType[];
};

export const Menus: MenuType[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Purchase Cover',
    subMenus: [
      {
        label: 'Purchase Cover',
        href: '/purchase',
      },
      {
        label: 'My Cover',
        href: '/purchase/me',
      },
    ],
  },
  {
    label: 'Stake',
    subMenus: [
      {
        label: 'Stake',
        href: '/stake',
      },
      {
        label: 'My Stake',
        href: '/stake/me',
      },
    ],
  },
  {
    label: 'Claim',
    href: '/claim',
  },
  { label: 'Governance', href: '/governance' },
];
