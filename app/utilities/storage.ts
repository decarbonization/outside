export interface AsyncStorage {
    getItem(key: string): Promise<string | undefined>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
}

export class SessionStorage implements AsyncStorage {
    constructor() {
        this.items = new Map();
    }

    private readonly items: Map<string, string>;
    
    async getItem(key: string): Promise<string | undefined> {
        return this.items.get(key);
    }

    async setItem(key: string, value: string): Promise<void> {
        this.items.set(key, value);
    }

    async removeItem(key: string): Promise<void> {
        this.items.delete(key);
    }

    async clear(): Promise<void> {
        this.items.clear();
    }
}
