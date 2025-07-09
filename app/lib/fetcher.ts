const API_SECRET_KEY = process.env.API_SECRET_KEY;
console.log('API_SECRET_KEY:', API_SECRET_KEY);

export default async function Fetcher(url: string | URL | Request, options: RequestInit = {}) {
    const headers = { ...(options.headers || {}) } as Record<string, string>;

    const res = await fetch(url, {
        ...options,
        headers
    });
    
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        (error as any).info = await res.json();
        (error as any).status = res.status;
        throw error;
    }
    
    return res.json();
}