import type { GameState, GameActionRequest } from './types';

const API_URL = 'http://localhost:5207/api/game'; // Standard port for .NET 8 Web API (http)

export const gameApi = {
    startGame: async (): Promise<GameState> => {
        const response = await fetch(`${API_URL}/start`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to start game');
        return response.json();
    },

    getState: async (): Promise<GameState> => {
        const response = await fetch(`${API_URL}/state`);
        if (!response.ok) throw new Error('Failed to get state');
        return response.json();
    },

    executeAction: async (request: GameActionRequest): Promise<GameState> => {
        const response = await fetch(`${API_URL}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Action failed');
        }
        return response.json();
    }
};
