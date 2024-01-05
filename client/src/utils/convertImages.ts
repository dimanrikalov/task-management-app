function base64ToBlob(base64String: string, contentType: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

export function generateFileFromBase64(
    base64String: string,
    contentType: string,
    fileName: string
) {
    const blob = base64ToBlob(base64String, contentType);
    return new File([blob], fileName, { type: contentType });
}

export async function convertImageToBase64(image: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;

            // Convert ArrayBuffer to binary string
            const binaryString = Array.from(new Uint8Array(arrayBuffer))
                .map((byte) => String.fromCharCode(byte))
                .join('');

            // Convert binary string to base64
            const base64String = btoa(binaryString);

            resolve(base64String);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(image);
    });
}
