export function storeLocalStorage(key: string, value: any) {
  const jsonValue = JSON.stringify(value)
  window.localStorage.setItem(key, jsonValue);
}

export function getLocalStorage(key: string) {
  const value = window.localStorage.getItem(key);
  if(value) {
   return JSON.parse(value)
  } 
  return null
}

