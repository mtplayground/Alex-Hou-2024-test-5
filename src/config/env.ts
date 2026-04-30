const DEFAULT_APP_TITLE = 'Alex Hou 2024 Test 5'

export const APP_TITLE =
  import.meta.env.VITE_APP_TITLE?.trim() || DEFAULT_APP_TITLE
