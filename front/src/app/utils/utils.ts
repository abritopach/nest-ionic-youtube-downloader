export const handlePromise = async <T>(
    promise: Promise<T>,
    defaultError: string = 'rejected'
): Promise<T[] | [T, null | undefined]> => promise
        .then((data) => [data, undefined])
        .catch((error) => [undefined, error || defaultError]);

export const isValidYouTubeVideoUrl = (url: string) => {
    const youtubeRegExp =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(youtubeRegExp);
};

export const isAYoutubePlaylistUrl = (url: string) => {
    const youtubePlaylistRegExp =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com)\/.*\?.*\blist=.*$/;
    return url.match(youtubePlaylistRegExp);
}

export const sha256 = async (message: string) => {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

export const convertBlobToString = async (blob: Blob) => await blob.text();

export const convertBase64ToBlob = (base64Image: string, type: string) => {
    // Split into two parts
    const parts = base64Image.split(';base64,');
    // Hold the content type
    const imageType = parts[0].split(':')[1];
    // Decode Base64 string
    const decodedData = window.atob(parts[1]);
    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type });
};

export const convertAudioBlobToBase64 = async (audioFile): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
        resolve(e.target.result as string);
    };
    reader.readAsDataURL(audioFile);
});

export const convertBlobToArrayBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
    if ('arrayBuffer' in blob) return blob.arrayBuffer();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject;
        reader.readAsArrayBuffer(blob);
    });
}

export const excludedYoutubeVideoUrls = () => [];
