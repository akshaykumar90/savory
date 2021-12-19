<template>
  <div class="bg-white">
    <div
      class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <div v-for="item in bookmarks" :key="item.id" class="">
        <h2>{{ item.title }}</h2>
        <h3>{{ item.site }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
const bookmarks = [
  {
    date_added: 1639901969084,
    id: 'kr9kAMLx',
    site: 'web.dev',
    tags: ['frontend', 'performance', 'nextjs'],
    title:
      'How QuintoAndar increased conversion rates and pages per session by improving page performance',
    url: 'https://web.dev/quintoandar/',
  },
  {
    date_added: 1639901907683,
    id: 'MaAoOg9G',
    site: 'oreilly.com',
    tags: ['crypto', 'systems', 'finance', 'history'],
    title: 'Why it’s too early to get excited about Web3 – O’Reilly',
    url: 'https://www.oreilly.com/radar/why-its-too-early-to-get-excited-about-web3/',
  },
  {
    date_added: 1639901903811,
    id: 'AxYKVv7r',
    site: 'lethain.com',
    tags: ['working', 'people skills'],
    title: 'Inspection and the limits of trust. | Irrational Exuberance',
    url: 'https://lethain.com/inspection/',
  },
  {
    date_added: 1639901856654,
    id: 'yag29oex',
    site: 'twitter.com',
    tags: ['reading', 'person: dan luu'],
    title:
      'Dan Luu on Twitter: "The container throttling problem https://t.co/7VI8EcqdqO https://t.co/ChShyyt9yS" / Twitter',
    url: 'https://twitter.com/danluu/status/1472142011918471170',
  },
]

export default {
  setup() {
    return {
      bookmarks,
    }
  },
}
</script>
