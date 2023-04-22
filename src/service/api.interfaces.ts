import { Track } from "../app.interfaces";

export interface TokenResponse {
    access_token: string;
    expires_in: number;
}

export interface SearchResponse {
    tracks: Track[];
}