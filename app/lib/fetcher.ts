export default async function Fetcher(url: string | URL | Request, options: RequestInit = {}) {
    const headers = new Headers(options.headers);

    const res = await fetch(url, {
        ...options,
        headers
    });
    
    if (!res.ok) {
        const error = Object.assign(new Error('An error occurred while fetching the data.'), {
            info: await res.json(),
            status: res.status,
        });
        throw error;
    }
    
    return res.json();
}