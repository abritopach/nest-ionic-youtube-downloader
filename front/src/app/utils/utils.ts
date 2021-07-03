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
