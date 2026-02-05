
import { supabase } from '@/integrations/supabase/client';

export interface EmailValidationResult {
  isValid: boolean;
  status: string;
  subStatus: string;
  freeEmail: boolean;
  didYouMean: string | null;
  domain: string;
  processed_at: string;
}

export interface EmailValidationResponse {
  result: EmailValidationResult | null;
  error?: string;
  message?: string;
}

/**
 * Validates an email address using ZeroBounce API
 * Returns null if email is not provided (empty or null)
 * Returns validation result if email is provided
 * Handles errors gracefully (network issues, invalid API key, etc.)
 */
export const validateEmailWithZeroBounce = async (email?: string): Promise<EmailValidationResult | null> => {
  try {
    // If email is not provided, return null
    if (!email || email.trim() === "") {
      return null;
    }

    console.log(`Validating email: ${email.trim()}`);

    const { data, error } = await supabase.functions.invoke('validate-email-zerobounce', {
      body: { email: email.trim() }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Email validation service error: ${error.message}`);
    }

    const response: EmailValidationResponse = data;

    if (response.error) {
      console.error('ZeroBounce API error:', response.error);
      throw new Error(response.error);
    }

    // Return null if no email was provided (handled by edge function)
    if (response.result === null) {
      return null;
    }

    console.log('Email validation result:', response.result);
    return response.result;

  } catch (error: any) {
    console.error('Email validation failed:', error);
    // Gracefully handle errors by throwing with a user-friendly message
    throw new Error(error.message || 'Unable to validate email. Please try again.');
  }
};

/**
 * Simple wrapper function that returns a boolean for quick validation
 */
export const isEmailValid = async (email?: string): Promise<boolean | null> => {
  try {
    const result = await validateEmailWithZeroBounce(email);
    return result ? result.isValid : null;
  } catch (error) {
    console.error('Email validation error:', error);
    return null; // Return null on error for graceful handling
  }
};
