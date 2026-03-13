import CustomizeClient from '@/components/customize/CustomizeClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CustomizePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const { data: settings } = await supabase
    .from('hompy_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return <CustomizeClient profile={profile} initialSettings={settings} />
}
