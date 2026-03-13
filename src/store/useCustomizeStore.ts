import { create } from 'zustand'
import { createClient } from '../lib/supabase/client'

type Widgets = {
  clock: boolean
  music: boolean
  visitor: boolean
}

type CustomizeState = {
  theme: string
  bgColor: string
  bgImageUrl: string | null
  widgets: Widgets
  isDirty: boolean
}

type CustomizeActions = {
  setTheme: (theme: string) => void
  setBgColor: (color: string) => void
  setBgImageUrl: (url: string | null) => void
  setWidget: (key: keyof Widgets, value: boolean) => void
  loadSettings: (userId: string) => Promise<void>
  save: (userId: string) => Promise<void>
  reset: () => void
}

const defaultState: CustomizeState = {
  theme: 'spring',
  bgColor: '#fff8f2',
  bgImageUrl: null,
  widgets: {
    clock: true,
    music: false,
    visitor: true,
  },
  isDirty: false,
}

export const useCustomizeStore = create<CustomizeState & CustomizeActions>(
  (set, get) => ({
    ...defaultState,

    setTheme: (theme) => set({ theme, isDirty: true }),

    setBgColor: (bgColor) => set({ bgColor, isDirty: true }),

    setBgImageUrl: (bgImageUrl) => set({ bgImageUrl, isDirty: true }),

    setWidget: (key, value) =>
      set((state) => ({
        widgets: { ...state.widgets, [key]: value },
        isDirty: true,
      })),

    // Supabase에서 설정 불러오기
    loadSettings: async (userId) => {
      const supabase = createClient()
      const { data } = await supabase
        .from('hompy_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (data) {
        set({
          theme: data.theme ?? defaultState.theme,
          bgColor: data.bg_color ?? defaultState.bgColor,
          bgImageUrl: data.bg_image_url ?? null,
          widgets: data.widgets ?? defaultState.widgets,
          isDirty: false,
        })
      }
    },

    // Supabase에 설정 저장
    save: async (userId) => {
      const { theme, bgColor, bgImageUrl, widgets } = get()
      const supabase = createClient()

      await supabase.from('hompy_settings').upsert({
        user_id: userId,
        theme,
        bg_color: bgColor,
        bg_image_url: bgImageUrl,
        widgets,
      })

      set({ isDirty: false })
    },

    reset: () => set({ ...defaultState }),
  })
)
