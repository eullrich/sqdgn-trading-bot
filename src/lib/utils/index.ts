export function formatCurrency(value: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 6
	}).format(value);
}

export function formatPercentage(value: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value / 100);
}

export function formatMultiplier(value: number): string {
	return `${value.toFixed(2)}x`;
}

export function calculateWinRate(wins: number, total: number): number {
	return total > 0 ? (wins / total) * 100 : 0;
}

export function parseTokenSymbol(text: string): string | null {
	const tokenRegex = /\$([A-Z0-9]{2,10})/i;
	const match = text.match(tokenRegex);
	return match ? match[1].toUpperCase() : null;
}

export function parseMultiplier(text: string): number | null {
	const multiplierRegex = /(\d+(?:\.\d+)?)[xX]/;
	const match = text.match(multiplierRegex);
	return match ? parseFloat(match[1]) : null;
}

export function parsePrice(text: string): number | null {
	const priceRegex = /\$?(\d+(?:\.\d+)?)/;
	const match = text.match(priceRegex);
	return match ? parseFloat(match[1]) : null;
}