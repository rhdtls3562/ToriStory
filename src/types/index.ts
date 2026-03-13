export type Profile = {
  id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export type HompySettings = {
  id: string
  user_id: string
  theme: string
  bg_color: string
  bg_image_url: string | null
  bg_music_url: string | null
  widgets: {
    clock: boolean
    music: boolean
    visitor: boolean
  }
  skin_css: string | null
}

export type GuestbookItem = {
  id: string
  hompy_owner_id: string
  author_id: string | null
  author_name: string
  content: string
  is_private: boolean
  created_at: string
}

export type GalleryPhoto = {
  id: string
  user_id: string
  image_url: string
  caption: string | null
  created_at: string
}

export type VisitorLog = {
  id: string
  hompy_owner_id: string
  visitor_id: string | null
  visited_at: string
}
