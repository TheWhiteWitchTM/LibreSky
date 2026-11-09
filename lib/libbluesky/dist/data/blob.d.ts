export interface RepoBlobJson {
    $type?: 'blob';
    ref: {
        $link: string;
    };
    mimeType: string;
    size?: number;
}
export declare class RepoBlob {
    readonly $type: "blob";
    readonly ref: {
        $link: string;
    };
    readonly mimeType: string;
    readonly size?: number;
    constructor(input: {
        ref: {
            $link: string;
        } | string;
        mimeType: string;
        size?: number;
    });
    toJSON(): RepoBlobJson;
}
