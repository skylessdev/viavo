import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

export function formatAmount(amount: number, decimals = 5): string {
  return amount.toFixed(decimals).replace(/\.?0+$/, '');
}

export function formatCurrency(amount: number, currency: 'ETH' | 'USDC'): string {
  return `${formatAmount(amount)} ${currency}`;
}

export function getExpirationText(minutes: number): string {
  if (minutes === 0) return 'Never';
  if (minutes < 60) return `In ${minutes} minutes`;
  if (minutes === 60) return 'In 1 hour';
  if (minutes === 1440) return 'In 24 hours';
  return `In ${Math.floor(minutes / 60)} hours`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard', error);
    return false;
  }
}

export async function shareContent(title: string, text: string, url: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url,
      });
      return true;
    }
    return await copyToClipboard(url);
  } catch (error) {
    console.error('Error sharing content', error);
    return false;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
