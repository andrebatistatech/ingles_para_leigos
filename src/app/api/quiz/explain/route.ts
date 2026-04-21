import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const SYSTEM_PROMPT = `You are a bilingual English teacher (English + Brazilian Portuguese).
A student answered an English question incorrectly.

Provide a short, educational explanation with:
1. Why their answer is wrong (in Portuguese)
2. Why the correct answer is right (in Portuguese)  
3. A grammar/vocabulary tip in English with Portuguese translation

Format as a single paragraph, max 3-4 sentences. Be encouraging.
Respond in this exact format:
🇧🇷 <explanation in Portuguese>
🇺🇸 <tip in English> (<Portuguese translation>)`

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check VIP
  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_vip')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_vip) {
    return NextResponse.json({ error: 'VIP only', vip_required: true }, { status: 403 })
  }

  const { questionText, userAnswer, correctAnswer, level, sessionId } = await request.json()

  if (!questionText || !correctAnswer || !level || !sessionId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const EXPLAIN_LIMIT = 5

  const { data: session } = await serviceClient
    .from('quiz_sessions')
    .select('explain_count')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (session.explain_count >= EXPLAIN_LIMIT) {
    return NextResponse.json({ error: 'Limit reached', limit_reached: true }, { status: 429 })
  }

  try {
    const { text } = await generateText({
      model: openai('gpt-4.1-nano'),
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Level: ${level}\nQuestion: ${questionText}\nStudent answered: ${userAnswer ?? '(no answer / time expired)'}\nCorrect answer: ${correctAnswer}`,
      }],
    })

    await serviceClient
      .from('quiz_sessions')
      .update({ explain_count: session.explain_count + 1 })
      .eq('id', sessionId)

    return NextResponse.json({ explanation: text, remaining: EXPLAIN_LIMIT - session.explain_count - 1 })
  } catch (err) {
    console.error('[explain] AI error:', err)
    return NextResponse.json({ error: 'AI unavailable' }, { status: 500 })
  }
}
