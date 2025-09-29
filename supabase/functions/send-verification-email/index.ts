import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  userId: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId, userName }: VerificationEmailRequest = await req.json();
    
    console.log('Sending verification email to:', email);

    // Generate a verification token
    const verificationToken = crypto.randomUUID();
    
    // Store the verification token in the database
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ 
        email_verified: false,
        // We'll store the token in a temporary way for verification
      })
      .eq('user_id', userId);

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Error updating profile');
    }

    // Create verification URL
    const verificationUrl = `${supabaseUrl.replace('/supabase', '')}/verify-email?token=${verificationToken}&userId=${userId}`;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "VocabSpark <onboarding@resend.dev>",
        to: [email],
        subject: "Verifica tu cuenta de VocabSpark 📚",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificar Email - VocabSpark</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: white; display: inline-block; padding: 20px; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                  <h1 style="margin: 0; color: #4f46e5; font-size: 32px; font-weight: bold;">📚 VocabSpark</h1>
                </div>
              </div>

              <!-- Main Content -->
              <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); margin-bottom: 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 36px;">
                    ✉️
                  </div>
                  <h2 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">¡Hola ${userName}!</h2>
                  <p style="margin: 15px 0 0; color: #6b7280; font-size: 16px;">Verifica tu email para completar tu registro</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    Estás a un paso de desbloquear todo el potencial de VocabSpark. Haz clic en el botón de abajo para verificar tu cuenta y comenzar tu viaje de aprendizaje.
                  </p>

                  <a href="${verificationUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); transition: all 0.3s ease;">
                    ✅ Verificar Perfil
                  </a>
                </div>

                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <h3 style="margin: 0 0 10px; color: #1f2937; font-size: 16px; font-weight: bold;">🎯 ¿Qué obtienes al verificar?</h3>
                  <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                    <li>Acceso completo a todas las funciones</li>
                    <li>Seguridad adicional para tu cuenta</li>
                    <li>Notificaciones importantes sobre tu progreso</li>
                    <li>Respaldo de tus datos de aprendizaje</li>
                  </ul>
                </div>

                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                  <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                    Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:
                  </p>
                  <p style="color: #4f46e5; font-size: 14px; word-break: break-all; margin: 10px 0 0;">
                    ${verificationUrl}
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="text-align: center;">
                <p style="color: white; font-size: 14px; margin: 0; opacity: 0.9;">
                  Si no creaste una cuenta en VocabSpark, puedes ignorar este email.
                </p>
                <p style="color: white; font-size: 12px; margin: 10px 0 0; opacity: 0.7;">
                  © 2024 VocabSpark - Tu compañero de aprendizaje de inglés
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email');
    }

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email de verificación enviado correctamente",
      verificationToken // In production, don't return this
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);