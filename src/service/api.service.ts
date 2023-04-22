import axios from 'axios';
import { TokenResponse } from './api.interfaces';

export class ApiService {
    private static instance: ApiService;

    private token!: string;

    private expires!: number;

    private apiUrl: string = 'https://ifyl.tievolib8216.workers.dev';

    private constructor() {}

    static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }

        return ApiService.instance;
    }

    async getToken() {
        if (!this.token || this.expires < Date.now()) {
            const { data } = await axios.get<TokenResponse>(`${this.apiUrl}/token`);
            this.token = data.access_token;
            this.expires = Date.now() + data.expires_in * 1000;
        }
        return this.token;
    }

    async search(query: string) {
        const token = await this.getToken();
        const { data } = await axios.get(`${this.apiUrl}/search?q=${query}`, {
            headers: {
                Authorization: token,
            },
        });
        return data;
    }

    async recommend(id: string) {
        const token = await this.getToken();
        const { data } = await axios.get(`${this.apiUrl}/recommend?trackId=${id}`, {
            headers: {
                Authorization: token,
            }
        });
        return data;
    }
}