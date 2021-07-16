<template>
  <div>
    <template v-for="item in placeholders">
      <ContentLoader :height="35" :width="400">
        <rect
          x="0"
          y="5"
          rx="3"
          ry="3"
          :width="item.textWidth[0]"
          height="10"
        />
        <rect
          :x="item.textWidth[0] + 5"
          y="5"
          rx="3"
          ry="3"
          :width="item.textWidth[1]"
          height="10"
        />
        <rect
          :x="item.textWidth[0] + item.textWidth[1] + 10"
          y="5"
          rx="3"
          ry="3"
          :width="item.textWidth[2]"
          height="10"
        />
        <rect
          x="0"
          y="20"
          rx="3"
          ry="3"
          :width="item.tagWidth[0]"
          height="12"
        />
        <rect
          :x="item.tagWidth[0] + 5"
          y="20"
          rx="3"
          ry="3"
          :width="item.tagWidth[1]"
          height="12"
        />
        <rect
          :x="item.tagWidth[0] + item.tagWidth[1] + 10"
          y="20"
          rx="3"
          ry="3"
          :width="item.tagWidth[2]"
          height="12"
        />
      </ContentLoader>
    </template>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  name: 'BookmarkLoader',

  data: function () {
    return {
      placeholders: [
        {
          textWidth: [160, 25, 60],
          tagWidth: [50, 40, 30],
        },
        {
          textWidth: [140, 35, 30],
          tagWidth: [30, 35, 40],
        },
        {
          textWidth: [120, 30, 50],
          tagWidth: [45, 40, 30],
        },
        // {
        //   textWidth: [165, 35, 40],
        //   tagWidth: [50, 40, 40],
        // },
        // {
        //   textWidth: [140, 40, 50],
        //   tagWidth: [40, 55, 30],
        // },
      ],
    }
  },

  components: {
    ContentLoader,
  },
}
</script>
