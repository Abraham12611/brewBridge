import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a token amount with appropriate decimal places
 * @param amount The amount to format
 * @param decimals Number of decimal places (default: 18)
 * @returns Formatted amount string
 */
export function formatAmount(amount: string | number, decimals: number = 18): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '0.00';

  return numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a gas price in Gwei
 * @param gasPrice Gas price in wei
 * @returns Formatted gas price string
 */
export function formatGasPrice(gasPrice: bigint): string {
  return `${gasPrice / BigInt(1e9)} Gwei`;
}

/**
 * Formats a timestamp into a human-readable date string
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}
