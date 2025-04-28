export type PasskeyCredential = {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    attestationObject?: string;
    authenticatorData?: string;
    signature?: string;
    userHandle?: string;
  };
};

/**
 * Creates a new passkey for the user
 * @param username Username or identifier for the user
 * @returns PasskeyCredential or null if creation failed
 */
export async function createPasskey(username: string): Promise<PasskeyCredential | null> {
  try {
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      throw new Error("WebAuthn is not supported in this browser");
    }

    // Generate a random user ID
    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    // Create the WebAuthn credential options
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: new Uint8Array(32),
      rp: {
        name: "Viavo",
        id: window.location.hostname
      },
      user: {
        id: userId,
        name: username,
        displayName: username
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 }, // ES256
        { type: "public-key", alg: -257 } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        requireResidentKey: true
      },
      timeout: 60000,
      attestation: "direct"
    };

    // Fill challenge with random values
    window.crypto.getRandomValues(publicKeyCredentialCreationOptions.challenge);

    // Create the credential
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    }) as PublicKeyCredential;

    // Format the credential for storage
    const passkey: PasskeyCredential = {
      id: credential.id,
      rawId: btoa(
        String.fromCharCode.apply(null, Array.from(new Uint8Array(credential.rawId)))
      ),
      type: credential.type,
      response: {
        clientDataJSON: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array(credential.response.clientDataJSON))
          )
        ),
        attestationObject: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array((credential.response as AuthenticatorAttestationResponse).attestationObject))
          )
        )
      }
    };

    return passkey;
  } catch (error) {
    console.error("Error creating passkey:", error);
    return null;
  }
}

/**
 * Authenticates with a passkey
 * @param credentialId The ID of the credential to authenticate with
 * @returns Authentication result or null if authentication failed
 */
export async function authenticateWithPasskey(credentialId: string): Promise<PasskeyCredential | null> {
  try {
    if (!window.PublicKeyCredential) {
      throw new Error("WebAuthn is not supported in this browser");
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [
        {
          id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
          type: 'public-key',
        }
      ],
      timeout: 60000,
      userVerification: 'required'
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    }) as PublicKeyCredential;

    // Format the assertion for verification
    const result: PasskeyCredential = {
      id: assertion.id,
      rawId: btoa(
        String.fromCharCode.apply(null, Array.from(new Uint8Array(assertion.rawId)))
      ),
      type: assertion.type,
      response: {
        clientDataJSON: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array(assertion.response.clientDataJSON))
          )
        ),
        authenticatorData: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array((assertion.response as AuthenticatorAssertionResponse).authenticatorData))
          )
        ),
        signature: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array((assertion.response as AuthenticatorAssertionResponse).signature))
          )
        ),
        userHandle: (assertion.response as AuthenticatorAssertionResponse).userHandle
          ? btoa(
              String.fromCharCode.apply(
                null,
                Array.from(new Uint8Array((assertion.response as AuthenticatorAssertionResponse).userHandle!))
              )
            )
          : undefined
      }
    };

    return result;
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    return null;
  }
}

/**
 * Checks if the browser supports WebAuthn
 * @returns true if supported, false otherwise
 */
export function isWebAuthnSupported(): boolean {
  return (
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function"
  );
}

/**
 * Checks if platform authenticator (TouchID, FaceID, Windows Hello) is available
 * @returns Promise resolving to true if available
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    return false;
  }
  
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error("Error checking platform authenticator:", error);
    return false;
  }
}
