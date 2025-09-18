// Global state for processing mode
let fastProcessingEnabled = true;

export function isFastProcessingEnabled(): boolean {
	return fastProcessingEnabled;
}

export function setFastProcessingEnabled(enabled: boolean): void {
	fastProcessingEnabled = enabled;
	console.log(`🔄 Processing mode changed to: ${enabled ? 'FAST' : 'NORMAL'}`);
}

export function getFastProcessingEnabled(): boolean {
	return fastProcessingEnabled;
}