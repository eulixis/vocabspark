import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const userId = url.searchParams.get('userId');

    if (!token || !userId) {
      return new Response('Parámetros de verificación inválidos', { status: 400 });
    }

    console.log('Verifying email for user:', userId);

    // Update the user's email verification status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ email_verified: true })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating verification status:', updateError);
      throw new Error('Error al verificar el email');
    }

    // Return a beautiful success page
    const successPage = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verificado - VocabSpark</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <!-- Success Card -->
          <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center;">
            <!-- Success Icon -->
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; font-size: 48px; animation: pulse 2s infinite;">
              ✅
            </div>

            <!-- Title and Message -->
            <h1 style="margin: 0 0 15px; color: #1f2937; font-size: 32px; font-weight: bold;">¡Email Verificado!</h1>
            <p style="margin: 0 0 30px; color: #6b7280; font-size: 18px; line-height: 1.6;">
              Tu perfil ha sido verificado exitosamente. Ahora puedes disfrutar de todas las funciones de VocabSpark.
            </p>

            <!-- Features List -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: left;">
              <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 18px; font-weight: bold; text-align: center;">🎉 ¡Ya puedes:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li>Acceder a todas las lecciones premium</li>
                <li>Sincronizar tu progreso en todos tus dispositivos</li>
                <li>Recibir notificaciones personalizadas</li>
                <li>Participar en competencias y desafíos</li>
              </ul>
            </div>

            <!-- Return Button -->
            <a href="/" 
               style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); transition: all 0.3s ease;">
              🚀 Ir a VocabSpark
            </a>

            <!-- Footer -->
            <p style="margin: 30px 0 0; color: #9ca3af; font-size: 14px;">
              ¡Gracias por unirte a nuestra comunidad de aprendizaje!
            </p>
          </div>
        </div>

        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        </style>
      </body>
      </html>
    `;

    return new Response(successPage, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    
    const errorPage = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error de Verificación - VocabSpark</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #f87171 0%, #ef4444 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center;">
            <div style="background: #ef4444; color: white; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; font-size: 48px;">
              ❌
            </div>
            <h1 style="margin: 0 0 15px; color: #1f2937; font-size: 32px; font-weight: bold;">Error de Verificación</h1>
            <p style="margin: 0 0 30px; color: #6b7280; font-size: 18px;">
              No pudimos verificar tu email. El enlace puede haber expirado o ser inválido.
            </p>
            <a href="/" 
               style="display: inline-block; background: #374151; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px;">
              Volver a VocabSpark
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    return new Response(errorPage, {
      status: 500,
      headers: {
        "Content-Type": "text/html", 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);