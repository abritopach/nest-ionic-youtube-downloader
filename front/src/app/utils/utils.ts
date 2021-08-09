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

export const sha256 = async (message: string) => {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('hashHex', hashHex);
    return hashHex;
}
