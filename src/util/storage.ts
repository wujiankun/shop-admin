export const setItem = (key:string, value:object|null|string) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

export const removeItem = (key:string) => {
  window.localStorage.removeItem(key)
}

export const getItem = <T>(key:string) => {
  const value = window.localStorage.getItem(key)
  if (!value) {
    return null
  }
  try {
    return JSON.parse(value) as T
  } catch (e) {
    return null
  }
}
