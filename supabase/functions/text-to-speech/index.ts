import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Try ElevenLabs first
async function tryElevenLabs(text: string, voice?: string): Promise<string> {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('ElevenLabs API error:', errorText)
    throw new Error(`ElevenLabs failed: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
}

// Fallback to OpenAI TTS
async function tryOpenAI(text: string, voice?: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice || 'alloy',
      response_format: 'mp3',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OpenAI TTS API error:', errorText)
    throw new Error(`OpenAI TTS failed: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Generating speech for:', text)

    let audioContent: string | null = null
    let provider = 'unknown'

    // Try ElevenLabs first
    try {
      audioContent = await tryElevenLabs(text, voice)
      provider = 'ElevenLabs'
      console.log('Speech generated successfully with ElevenLabs')
    } catch (elevenLabsError) {
      console.warn('ElevenLabs failed, trying OpenAI:', elevenLabsError)
      
      // Fallback to OpenAI
      try {
        audioContent = await tryOpenAI(text, voice)
        provider = 'OpenAI'
        console.log('Speech generated successfully with OpenAI')
      } catch (openAiError) {
        console.error('All TTS providers failed:', { elevenLabsError, openAiError })
        // Return a signal to use browser TTS
        return new Response(
          JSON.stringify({ 
            useBrowserTTS: true,
            text: text,
            error: 'All cloud TTS providers are unavailable'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        audioContent,
        provider,
        text 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ 
        useBrowserTTS: true,
        text: '',
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})