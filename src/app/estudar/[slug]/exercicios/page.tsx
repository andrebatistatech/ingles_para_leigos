import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PracticeRunner } from '@/components/study/PracticeRunner'

export default async function ExercisesPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_vip')
    .eq('user_id', user.id)
    .single()
  if (!profile?.is_vip) redirect('/upgrade')

  const { data: topic } = await serviceClient
    .from('study_topics')
    .select('slug, title')
    .eq('slug', params.slug)
    .single()
  if (!topic) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PracticeRunner slug={topic.slug} title={topic.title} />
    </div>
  )
}
