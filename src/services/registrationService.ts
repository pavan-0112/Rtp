
import { supabase } from '@/integrations/supabase/client';
import { FormData, validateAllFields } from '@/utils/registrationValidation';

export interface RegistrationResult {
  success: boolean;
  error?: string;
  validationErrors?: { [key: string]: string };
}

export const registerUser = async (formData: FormData): Promise<RegistrationResult> => {
  try {
    // Validate all fields
    const validationErrors = await validateAllFields(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        validationErrors,
        error: 'Please fix the validation errors'
      };
    }

    const email = formData.email.toLowerCase().trim();

    // Create account directly with auto-confirmation for all valid domain emails
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: formData.password,
      options: {
        emailRedirectTo: undefined, // Skip email confirmation
        data: {
          name: formData.name.trim(),
          role: formData.role,
          phone: formData.phone.trim(),
          email_confirmed: true, // Mark as confirmed
        }
      }
    });

    if (authError) {
      if (authError.message?.includes('already registered')) {
        return {
          success: false,
          error: 'An account with this email already exists.'
        };
      }
      throw authError;
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create account. Please try again.'
      };
    }

    // Send welcome email
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: email,
          name: formData.name.trim(),
          role: formData.role
        }
      });
    } catch (emailError) {
      console.warn('Welcome email failed to send:', emailError);
      // Don't fail registration if email fails
    }

    // Try to sign them in immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: formData.password,
    });

    if (signInError) {
      console.warn('Auto sign-in failed, but account was created:', signInError);
      // Don't treat this as a fatal error since the account was created
    }

    return { success: true };
    
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'Failed to register. Please try again.'
    };
  }
};
