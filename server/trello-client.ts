// Simple Trello REST API client
export class TrelloClient {
  private apiKey: string;
  private token: string;
  private baseUrl = 'https://api.trello.com/1';

  constructor() {
    this.apiKey = process.env.TRELLO_API_KEY || '';
    this.token = process.env.TRELLO_TOKEN || '';
    
    if (!this.apiKey || !this.token) {
      throw new Error('Trello API credentials not found');
    }
  }

  private async makeRequest(endpoint: string, method = 'GET', data?: any) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('token', this.token);

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      throw new Error(`Trello API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listBoards() {
    return this.makeRequest('/members/me/boards');
  }

  async getBoard(boardId: string) {
    return this.makeRequest(`/boards/${boardId}`);
  }

  async getBoardLists(boardId: string) {
    return this.makeRequest(`/boards/${boardId}/lists`);
  }

  async createCard(listId: string, name: string, description?: string) {
    return this.makeRequest('/cards', 'POST', {
      idList: listId,
      name,
      desc: description || '',
    });
  }

  async getMyCards() {
    return this.makeRequest('/members/me/cards');
  }

  async getCard(cardId: string) {
    return this.makeRequest(`/cards/${cardId}`);
  }

  async updateCard(cardId: string, updates: { name?: string; desc?: string; due?: string }) {
    return this.makeRequest(`/cards/${cardId}`, 'PUT', updates);
  }

  async deleteCard(cardId: string) {
    return this.makeRequest(`/cards/${cardId}`, 'DELETE');
  }

  async moveCard(cardId: string, listId: string) {
    return this.makeRequest(`/cards/${cardId}`, 'PUT', {
      idList: listId,
    });
  }
}

// Singleton instance
export const trelloClient = new TrelloClient();