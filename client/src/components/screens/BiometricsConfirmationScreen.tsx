import Icon from '@/components/ui/icon';

export default function BiometricsConfirmationScreen() {
  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xs flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 mb-6 rounded-full bg-primary-100 flex items-center justify-center">
          <Icon name="fingerprint" className="text-primary-600 text-4xl animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900">Confirm Biometrics</h1>
        
        <p className="text-neutral-600">
          Use your FaceID or Fingerprint to confirm and create your wallet
        </p>
        
        <div className="w-full flex flex-col items-center mt-6 space-y-2">
          <div className="w-12 h-1.5 bg-primary-200 rounded-full animate-pulse"></div>
          <p className="text-sm text-neutral-500">Scanning...</p>
        </div>
      </div>
    </div>
  );
}
