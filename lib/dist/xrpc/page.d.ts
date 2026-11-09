export interface Page<T> {
    cursor?: string;
    items: readonly T[];
}
/** Walk cursor pages. Stops when the cursor is missing or does not move. */
export declare function paginate<T>(load: (cursor?: string) => Promise<Page<T>>, options?: {
    maxPages?: number;
}): Promise<T[]>;
