import { useState, useCallback, useEffect } from 'react';
import { isWebAuthnSupported, isPlatformAuthenticatorAvailable } from '@/lib/web-authn';

export function usePasskey() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  // Check if WebAuthn is supported and if platform authenticator is available
  const checkPasskeySupport = useCallback(async () => {
    const supported = isWebAuthnSupported();
    setIsSupported(supported);
    
    if (supported) {
      const available = await isPlatformAuthenticatorAvailable();
      setIsAvailable(available);
      return available;
    }
    
    return false;
  }, []);
  
  // Check support on mount
  useEffect(() => {
    checkPasskeySupport();
  }, [checkPasskeySupport]);
  
  return {
    isSupported,
    isAvailable,
    checkPasskeySupport
  };
}
