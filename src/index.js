'use strict';

const { Resend } = require('resend');

module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap({ strapi }) {
    // Enviar email de bienvenida cuando se registra un nuevo usuario
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],

      async afterCreate(event) {
        const { result } = event;
        const name = result.username || 'amigo';
        const email = result.email;

        if (!email) return;

        const resend = new Resend(process.env.RESEND_API_KEY);

        const html = `
          <!DOCTYPE html>
          <html lang="es">
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0; padding:0; background-color:#f4f4f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 40px 16px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#18181b; border-radius:16px; overflow:hidden; border: 1px solid #27272a;">

                    <!-- Header con logo -->
                    <tr>
                      <td align="center" style="padding: 40px 40px 32px;">
                        <img src="https://standapp.somnum.net/email-logo.png" alt="StandApp+" width="180" style="display:block; border:0; max-width:100%;" />
                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="padding: 0 40px;">
                        <div style="height:1px; background-color:#27272a;"></div>
                      </td>
                    </tr>

                    <!-- Contenido principal -->
                    <tr>
                      <td style="padding: 40px 40px 32px;">
                        <p style="margin:0 0 8px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:22px; font-weight:700; color:#ffffff;">
                          ¡Bienvenido, ${name}!
                        </p>
                        <p style="margin:0 0 24px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:15px; color:#a1a1aa; line-height:1.6;">
                          Ahora tu cuenta recuerda por ti. Empieza en el celular, continúa en la compu — tu progreso siempre te espera donde lo dejaste.
                        </p>

                        <p style="margin:0 0 12px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:15px; color:#d4d4d8; line-height:1.6;">
                          Tu cuenta ya tiene todo listo:
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                          <tr>
                            <td style="padding:6px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:14px; color:#a1a1aa;">
                              <span style="color:#8ff461; margin-right:10px;">▸</span> Tu progreso sincronizado en todos tus dispositivos
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:14px; color:#a1a1aa;">
                              <span style="color:#8ff461; margin-right:10px;">▸</span> Especiales de stand-up curados a mano
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:14px; color:#a1a1aa;">
                              <span style="color:#8ff461; margin-right:10px;">▸</span> Los mejores roasts en español
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:14px; color:#a1a1aa;">
                              <span style="color:#8ff461; margin-right:10px;">▸</span> Contenido nuevo constantemente
                            </td>
                          </tr>
                        </table>

                        <!-- CTA -->
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="border-radius:10px; background-color:#8ff461;">
                              <a href="https://standapp.somnum.net"
                                style="display:inline-block; padding:14px 32px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:15px; font-weight:600; color:#0a0a0a; text-decoration:none; letter-spacing:0.2px;">
                                Empezar a ver comedia
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="padding: 0 40px;">
                        <div style="height:1px; background-color:#27272a;"></div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td align="center" style="padding: 24px 40px 32px;">
                        <p style="margin:0 0 4px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:12px; color:#52525b;">
                          SOMNUM · standapp.somnum.net
                        </p>
                        <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:12px; color:#3f3f46;">
                          Recibiste este correo porque creaste una cuenta en StandApp+.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        try {
          const { error } = await resend.emails.send({
            from: 'StandApp+ <noreply@somnum.net>',
            to: [email],
            subject: '¡Bienvenido a StandApp+! 🎤',
            html,
          });

          if (error) {
            strapi.log.error(`[EMAIL] Error enviando bienvenida a ${email}: ${error.message}`);
          } else {
            strapi.log.info(`[EMAIL] Bienvenida enviada a ${email}`);
          }
        } catch (err) {
          strapi.log.error(`[EMAIL] Excepción enviando bienvenida: ${err.message}`);
        }
      },
    });
  },
};
