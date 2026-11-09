export interface RepoBlobJson {
  $type?: 'blob';
  ref: { $link: string };
  mimeType: string;
  size?: number;
}

export class RepoBlob {
  readonly $type = 'blob' as const;
  readonly ref: { $link: string };
  readonly mimeType: string;
  readonly size?: number;

  constructor(input: { ref: { $link: string } | string; mimeType: string; size?: number }) {
    const link = typeof input.ref === 'string' ? input.ref : input.ref?.$link;
    this.ref = { $link: String(link || '') };
    this.mimeType = input.mimeType;
    if (input.size != null) this.size = input.size;
  }

  toJSON(): RepoBlobJson {
    return {
      $type: this.$type,
      ref: { $link: this.ref.$link },
      mimeType: this.mimeType,
      ...(this.size != null ? { size: this.size } : {}),
    };
  }
}
