export function generateFileFromBase64(
	base64String: string,
	contentType: string,
	fileName: string
) {
	const blob = base64ToBlob(base64String, contentType);
	return new File([blob], fileName, { type: contentType });
}

export function base64ToBlob(base64String: string, contentType: string) {
	const byteCharacters = atob(base64String);
	const byteNumbers = new Array(byteCharacters.length);

	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	const byteArray = new Uint8Array(byteNumbers);
	return new Blob([byteArray], { type: contentType });
}