<template>
  <div class="bg-white">
    <div
      class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <div v-for="item in bookmarks" :key="item.id" class="">
        <h3>{{ item.title }}</h3>
        <span>4h ago, 2 highlights</span>
        <div class="flex">
          <a v-for="(tag, index) in item.tags" :key="index">
            {{ tag }}
          </a>
          <a href="#">+</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const bookmarks = [
  {
    date_added: 1639901969084,
    id: 'kr9kAMLx',
    tags: ['web.dev', 'frontend', 'performance', 'nextjs'],
    title:
      'How QuintoAndar increased conversion rates and pages per session by improving page performance',
    url: 'https://web.dev/quintoandar/',
  },
  {
    date_added: 1639901907683,
    id: 'MaAoOg9G',
    tags: ['oreilly.com', 'crypto', 'systems', 'finance', 'history'],
    title: 'Why it’s too early to get excited about Web3 – O’Reilly',
    url: 'https://www.oreilly.com/radar/why-its-too-early-to-get-excited-about-web3/',
  },
  {
    date_added: 1639901903811,
    id: 'AxYKVv7r',
    tags: ['lethain.com', 'working', 'people skills'],
    title: 'Inspection and the limits of trust. | Irrational Exuberance',
    url: 'https://lethain.com/inspection/',
  },
  {
    date_added: 1639901856654,
    id: 'yag29oex',
    tags: ['twitter.com', 'reading', 'person: dan luu'],
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
