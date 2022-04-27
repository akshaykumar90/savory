import { ref } from 'vue'

const LOCAL_STORAGE_KEY = '__savory.client.auth_info'
const FIELD_USER_ID = 'user_id'

function readUserIdFromStorage() {
  const rawInfo = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!rawInfo) {
    // Empty state
    return null
  }
  let decoded = JSON.parse(rawInfo)
  const userId = decoded[FIELD_USER_ID]
  return userId
}

export function useAuthState() {
  const userId = ref(readUserIdFromStorage())

  const updateState = ({ user_id }) => {
    userId.value = user_id
    const to = {}
    to[FIELD_USER_ID] = user_id
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(to))
  }

  const cleanState = () => {
    userId.value = null
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

  return {
    userId,
    updateState,
    cleanState,
  }
}
