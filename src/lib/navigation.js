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
