<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  await ApiClient.pocketCallback()
  window.close()
})
</script>
