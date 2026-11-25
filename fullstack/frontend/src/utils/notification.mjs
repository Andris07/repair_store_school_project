import { reactive } from 'vue'

export const notifs = reactive([])

let nextId = 1

function push(type, message, timeout = 4000) {
  const id = nextId++
  notifs.push({ id, type, message })
  if (timeout > 0) setTimeout(() => dismiss(id), timeout)
  return id
}

export function dismiss(id) {
  const index = notifs.findIndex((t) => t.id === id)
  if (index !== -1) notifs.splice(index, 1)
}

export const toast = {
  success: (message, timeout) => push('success', message, timeout),
  error: (message, timeout = 6000) => push('error', message, timeout),
  info: (message, timeout) => push('info', message, timeout)
}
