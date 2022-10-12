<script setup>
import { useAuth } from '../auth'
import { onMounted } from 'vue'

const authStore = useAuth()

const { loginWithRedirect } = authStore

onMounted(() => {
  loginWithRedirect('signup')
})
</script>
