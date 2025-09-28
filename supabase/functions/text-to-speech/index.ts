import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice } = await req.json()

    if (!text || !text.trim()) {
      throw new Error('Text is required')
    }

    console.log('Generating speech for:', text)

    // Use OpenAI TTS - most reliable and best Spanish pronunciation
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd', // High quality model
        input: text.slice(0, 4096), // Limit text length for safety
        voice: voice || 'nova', // Nova has excellent Spanish pronunciation
        response_format: 'mp3',
        speed: 0.9 // Slightly slower for better comprehension
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI TTS API error:', errorText)
      throw new Error(`TTS generation failed: ${response.status} - ${errorText}`)
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer()
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    )

    console.log('Speech generated successfully with OpenAI TTS')

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        provider: 'OpenAI TTS HD',
        text: text
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Speech generation failed',
        fallback: true
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})