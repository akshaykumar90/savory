import {
  FilmIcon,
  FolderIcon,
  InboxIcon,
  NewspaperIcon,
} from '@heroicons/vue/24/outline'

export const navigation = [
  {
    name: 'Bookmarks',
    icon: InboxIcon,
    href: '/',
  },
  {
    name: 'Tags',
    icon: FolderIcon,
    href: '/tags',
  },
  {
    name: 'Reading',
    icon: NewspaperIcon,
    href: { path: '/tag', query: { name: 'reading' } },
  },
  {
    name: 'Playlist',
    icon: FilmIcon,
    href: { path: '/tag', query: { name: 'playlist' } },
  },
]

const mkt_site_url = process.env.MKT_SITE_URL

export const appLinks = [
  {
    name: 'Settings',
    href: '/settings',
  },
]

export const outboundLinks = [
  {
    name: 'Help',
    href: `${mkt_site_url}/getting-started`,
  },
  {
    name: 'Questions?',
    href: `${mkt_site_url}/feedback`,
  },
]
