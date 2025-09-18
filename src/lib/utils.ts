/**
 * Utility functions for formatting and calculations
 */

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}

/**
 * Format a number as a percentage with optional + sign for positive values
 */
export function formatPercentage(percentage: number, showSign: boolean = true): string {
	const sign = showSign && percentage >= 0 ? '+' : '';
	return `${sign}${percentage.toFixed(2)}%`;
}

/**
 * Format a large number with appropriate suffixes (K, M, B)
 */
export function formatLargeNumber(num: number): string {
	if (num >= 1e9) {
		return `$${(num / 1e9).toFixed(2)}B`;
	}
	if (num >= 1e6) {
		return `$${(num / 1e6).toFixed(2)}M`;
	}
	if (num >= 1e3) {
		return `$${(num / 1e3).toFixed(2)}K`;
	}
	return formatCurrency(num);
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
	const defaultOptions: Intl.DateTimeFormatOptions = {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	};
	
	return new Date(dateString).toLocaleDateString('en-US', options || defaultOptions);
}

/**
 * Format a date string to include time
 */
export function formatDateTime(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
}

/**
 * Get CSS color class for ROI/PnL values
 */
export function getROIColor(value: number): string {
	if (value > 0) return 'text-green-600';
	if (value < 0) return 'text-red-600';
	return 'text-gray-600';
}

/**
 * Get CSS background color class for ROI/PnL values
 */
export function getROIBackgroundColor(value: number): string {
	if (value > 0) return 'bg-green-50';
	if (value < 0) return 'bg-red-50';
	return 'bg-gray-50';
}

/**
 * Calculate ROI percentage from initial and current values
 */
export function calculateROI(initialValue: number, currentValue: number): number {
	if (initialValue <= 0) return 0;
	return ((currentValue - initialValue) / initialValue) * 100;
}

/**
 * Calculate the current value of an investment based on ROI
 */
export function calculateCurrentValue(investmentAmount: number, roi: number): number {
	return investmentAmount * (1 + roi / 100);
}

/**
 * Calculate profit/loss from investment amount and current value
 */
export function calculatePnL(investmentAmount: number, currentValue: number): number {
	return currentValue - investmentAmount;
}

/**
 * Validate investment amount input
 */
export function validateInvestmentAmount(amount: number | string): { isValid: boolean; error?: string } {
	const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
	
	if (isNaN(numAmount)) {
		return { isValid: false, error: 'Investment amount must be a valid number' };
	}
	
	if (numAmount <= 0) {
		return { isValid: false, error: 'Investment amount must be greater than 0' };
	}
	
	if (numAmount > 1000000) {
		return { isValid: false, error: 'Investment amount cannot exceed $1,000,000' };
	}
	
	return { isValid: true };
}

/**
 * Get time ago string from a date
 */
export function getTimeAgo(dateString: string): string {
	const now = new Date();
	const date = new Date(dateString);
	const diffMs = now.getTime() - date.getTime();
	const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
	const diffDays = Math.floor(diffHours / 24);
	
	if (diffHours < 1) return 'Just now';
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	
	return formatDate(dateString);
}

/**
 * Sort array of objects by a given field
 */
export function sortByField<T>(
	array: T[], 
	field: keyof T, 
	direction: 'asc' | 'desc' = 'desc'
): T[] {
	return [...array].sort((a, b) => {
		let aVal = a[field];
		let bVal = b[field];
		
		// Handle string comparison
		if (typeof aVal === 'string' && typeof bVal === 'string') {
			aVal = aVal.toLowerCase() as T[keyof T];
			bVal = bVal.toLowerCase() as T[keyof T];
		}
		
		if (direction === 'asc') {
			return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
		} else {
			return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
		}
	});
}

/**
 * Generate CSV content from data array
 */
export function generateCSV<T extends Record<string, any>>(
	data: T[], 
	headers: { key: keyof T; label: string }[]
): string {
	const csvHeaders = headers.map(h => h.label);
	const csvRows = data.map(row => 
		headers.map(h => {
			const value = row[h.key];
			// Escape quotes and wrap in quotes if contains comma or quote
			const stringValue = String(value || '');
			if (stringValue.includes(',') || stringValue.includes('"')) {
				return `"${stringValue.replace(/"/g, '""')}"`;
			}
			return stringValue;
		})
	);
	
	return [csvHeaders, ...csvRows]
		.map(row => row.join(','))
		.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string): void {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	
	link.href = url;
	link.download = filename;
	link.style.display = 'none';
	
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	
	URL.revokeObjectURL(url);
}

/**
 * Format multiplier (e.g. 2.5x)
 */
export function formatMultiplier(multiplier: number | null | undefined): string {
	if (!multiplier) return 'N/A';
	return `${multiplier.toFixed(1)}x`;
}

/**
 * Debounce function for input handlers
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}