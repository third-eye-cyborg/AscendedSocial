import { randomUUID } from 'crypto';

// OneSignal email service integration
if (!process.env.ONESIGNAL_API_KEY) {
  console.warn('ONESIGNAL_API_KEY not found, email features will be disabled');
}

const oneSignalApiKey = process.env.ONESIGNAL_API_KEY;
const oneSignalAppId = process.env.ONESIGNAL_APP_ID;

export interface WelcomeEmailData {
  email: string;
  firstName?: string;
  userName?: string;
}

export interface NewsletterEmailData {
  email: string;
  firstName?: string;
  subject: string;
  content: string;
  unsubscribeToken: string;
}

export interface TransactionalEmailData {
  email: string;
  firstName?: string;
  subject: string;
  content: string;
  type: 'password_reset' | 'email_verification' | 'account_notification' | 'oracle_reading' | 'energy_refill';
}

export class EmailService {
  private static FROM_EMAIL = 'Ascended Social <noreply@ascended.social>';
  
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    if (!oneSignalApiKey || !oneSignalAppId) {
      console.warn('OneSignal not configured, skipping welcome email');
      return false;
    }

    try {
      const welcomeContent = this.generateWelcomeEmailContent(data);
      
      await this.sendOneSignalEmail({
        email: data.email,
        subject: '✨ Welcome to Ascended Social - Your Spiritual Journey Begins',
        html: welcomeContent,
      });

      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  async sendNewsletterEmail(data: NewsletterEmailData): Promise<boolean> {
    if (!oneSignalApiKey || !oneSignalAppId) {
      console.warn('OneSignal not configured, skipping newsletter email');
      return false;
    }

    try {
      const newsletterContent = this.generateNewsletterContent(data);
      
      await this.sendOneSignalEmail({
        email: data.email,
        subject: data.subject,
        html: newsletterContent,
      });

      return true;
    } catch (error) {
      console.error('Failed to send newsletter email:', error);
      return false;
    }
  }

  async sendTransactionalEmail(data: TransactionalEmailData): Promise<boolean> {
    if (!oneSignalApiKey || !oneSignalAppId) {
      console.warn('OneSignal not configured, skipping transactional email');
      return false;
    }

    try {
      const transactionalContent = this.generateTransactionalEmailContent(data);
      
      await this.sendOneSignalEmail({
        email: data.email,
        subject: data.subject,
        html: transactionalContent,
      });

      return true;
    } catch (error) {
      console.error('Failed to send transactional email:', error);
      return false;
    }
  }

  private generateWelcomeEmailContent(data: WelcomeEmailData): string {
    const name = data.firstName || data.userName || 'Spiritual Seeker';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Ascended Social</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 40px 20px; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; }
            .content h2 { color: #333; margin-bottom: 20px; font-weight: 400; }
            .content p { color: #666; line-height: 1.8; margin-bottom: 20px; }
            .features { background: #f8f9ff; padding: 30px; border-radius: 10px; margin: 30px 0; }
            .feature { margin-bottom: 15px; display: flex; align-items: center; }
            .feature-icon { font-size: 20px; margin-right: 15px; }
            .cta { text-align: center; margin: 40px 0; }
            .cta-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 500; }
            .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✨ Welcome to Ascended Social</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>Welcome to Ascended Social, where spirituality meets community. Your journey of enlightenment and connection begins now.</p>
                
                <div class="features">
                    <div class="feature">
                        <span class="feature-icon">🧘‍♀️</span>
                        <span>Share your spiritual insights and connect with like-minded souls</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🔮</span>
                        <span>Receive daily oracle readings and personalized spiritual guidance</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">⚡</span>
                        <span>Use energy points to amplify posts that resonate with your spirit</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🌟</span>
                        <span>Discover your unique sigil and track your spiritual growth</span>
                    </div>
                </div>

                <div class="cta">
                    <a href="https://ascendedsocial.com" class="cta-button">Begin Your Journey</a>
                </div>

                <p>Your spiritual community awaits. Share your first post, engage with others, and let your inner light shine bright.</p>
                <p>Blessed be,<br>The Ascended Social Team</p>
            </div>
            <div class="footer">
                <p>You're receiving this because you joined Ascended Social.<br>
                Ascended Social - Where souls connect and spirits soar</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateNewsletterContent(data: NewsletterEmailData): string {
    const name = data.firstName || 'Spiritual Seeker';
    const baseUrl = process.env.BASE_URL || 'https://ascendedsocial.com';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.subject}</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px 20px; }
            .content { padding: 40px 30px; }
            .content p { color: #666; line-height: 1.8; margin-bottom: 20px; }
            .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #666; font-size: 14px; }
            .unsubscribe { margin-top: 20px; }
            .unsubscribe a { color: #999; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✨ Ascended Social</h1>
            </div>
            <div class="content">
                <p>Hello ${name},</p>
                ${data.content}
                <p>With spiritual light,<br>The Ascended Social Team</p>
            </div>
            <div class="footer">
                <p>Ascended Social Newsletter - Connecting souls across the spiritual realm</p>
                <div class="unsubscribe">
                    <a href="${baseUrl}/unsubscribe?token=${data.unsubscribeToken}">Unsubscribe</a> | 
                    <a href="${baseUrl}/newsletter/preferences?token=${data.unsubscribeToken}">Manage Preferences</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateTransactionalEmailContent(data: TransactionalEmailData): string {
    const name = data.firstName || 'Spiritual Seeker';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.subject}</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px 20px; }
            .content { padding: 40px 30px; }
            .content p { color: #666; line-height: 1.8; margin-bottom: 20px; }
            .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✨ Ascended Social</h1>
            </div>
            <div class="content">
                <p>Hello ${name},</p>
                ${data.content}
                <p>Blessed be,<br>The Ascended Social Team</p>
            </div>
            <div class="footer">
                <p>This is an automated message from Ascended Social.<br>
                Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private async sendOneSignalEmail(data: { email: string; subject: string; html: string }): Promise<void> {
    if (!oneSignalApiKey || !oneSignalAppId) {
      throw new Error('OneSignal not configured - missing API key or App ID');
    }

    const payload = {
      app_id: oneSignalAppId,
      email_subject: data.subject,
      email_body: data.html,
      include_email_tokens: [data.email],
      email_from_name: 'Ascended Social',
      email_from_address: 'noreply@ascended.social',
    };


    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${oneSignalApiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        console.error(`❌ OneSignal email API error: ${response.status}`, responseText);
        throw new Error(`OneSignal email failed: ${response.status} - ${responseText}`);
      }

      // Parse successful response
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = responseText;
      }

    } catch (error) {
      console.error(`❌ Failed to send OneSignal email to ${data.email}:`, error);
      throw error;
    }
  }

  generateUnsubscribeToken(): string {
    return randomUUID();
  }
}

export const emailService = new EmailService();