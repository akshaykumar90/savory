<script setup>
import { useAuth } from '../auth'
import { onMounted } from 'vue'

const authStore = useAuth()

const props = defineProps({
  login: Boolean,
})

const { loginWithRedirect } = authStore

onMounted(() => {
  loginWithRedirect(props.login ? 'login' : 'signup')
})
</script>
