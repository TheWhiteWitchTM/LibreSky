const PATHS = {
  home: '<path fill="currentColor" d="M4 10.4 12 3.6l8 6.8V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1v-9.6z"/>',
  search: '<path fill="currentColor" d="M10.5 3a7.5 7.5 0 1 1 4.64 13.36l4.25 4.25-1.42 1.42-4.25-4.25A7.5 7.5 0 0 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/>',
  bell: '<path fill="currentColor" d="M12 22a2.4 2.4 0 0 0 2.35-2h-4.7A2.4 2.4 0 0 0 12 22zm7-5.2V11a7 7 0 0 0-5.2-6.75V3.5a1.8 1.8 0 1 0-3.6 0v.75A7 7 0 0 0 5 11v5.8L3.4 18.6A1 1 0 0 0 4.2 20.2h15.6a1 1 0 0 0 .8-1.6L19 16.8z"/>',
  chat: '<path fill="currentColor" d="M5 3.5h14A2.5 2.5 0 0 1 21.5 6v9a2.5 2.5 0 0 1-2.5 2.5H9.2L4.5 21.2V6A2.5 2.5 0 0 1 5 3.5z"/>',
  feeds: '<path fill="currentColor" d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v3A1.5 1.5 0 0 1 18.5 10h-13A1.5 1.5 0 0 1 4 8.5v-3zm0 8A1.5 1.5 0 0 1 5.5 12h13a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-3z"/>',
  lists: '<path fill="currentColor" d="M8 6h12v2H8V6zM8 11h12v2H8v-2zm0 5h8v2H8v-2zM4.5 6.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm0 5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm0 5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/>',
  bookmark: '<path fill="currentColor" d="M6.5 3h11A1.5 1.5 0 0 1 19 4.5V21l-7-3.4L5 21V4.5A1.5 1.5 0 0 1 6.5 3z"/>',
  user: '<path fill="currentColor" d="M12 12.2a4.2 4.2 0 1 0-4.2-4.2 4.2 4.2 0 0 0 4.2 4.2zM4.8 20.2a7.2 7.2 0 0 1 14.4 0 .8.8 0 0 1-.8.8H5.6a.8.8 0 0 1-.8-.8z"/>',
  settings: '<path fill="currentColor" d="M4 7.2h6.1a2.4 2.4 0 0 0 4.6 0H20v2h-5.3a2.4 2.4 0 0 0-4.6 0H4v-2zm0 7.6h2.2a2.4 2.4 0 0 0 4.6 0H20v2H10.8a2.4 2.4 0 0 0-4.6 0H4v-2z"/>',
  reply: '<path fill="none" stroke="currentColor" stroke-width="2.25" stroke-linejoin="round" d="M7 16.8 4.8 19v-2.6A6.6 6.6 0 1 1 8 17.2"/>',
  repost: '<path fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" d="M7 7h8.2L13 4.8M17 17H8.8L11 19.2M7.2 7V16M16.8 17V8"/>',
  heart: '<path class="heart" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linejoin="round" d="M12 19s-6.2-3.7-6.2-8.1A3.4 3.4 0 0 1 12 8.6a3.4 3.4 0 0 1 6.2 2.3C18.2 15.3 12 19 12 19z"/>',
  share: '<path fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" d="M12 15V4.5M8.2 8 12 4.2 15.8 8M6 11.5v6A1.5 1.5 0 0 0 7.5 19h9a1.5 1.5 0 0 0 1.5-1.5v-6"/>',
  image: '<path fill="currentColor" d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17V7A1.5 1.5 0 0 1 5 5.5zm1.2 9.2 2.3-2.8 1.8 2.1 2.6-3.4 4.4 5.6H6.2zM8.2 10.2a1.3 1.3 0 1 0-1.3-1.3 1.3 1.3 0 0 0 1.3 1.3z"/>',
  more: '<circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/>',
  pin: '<path fill="currentColor" d="M9.2 3.2h5.6l.8 3.6 2.6 1.2v2H13.2V17L12 20.2 10.8 17V10H5.8v-2l2.6-1.2.8-3.6z"/>',
  phone: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M8 4.6h2.1l1 2.3-1.5 1a9 9 0 0 0 4.4 4.4l1-1.5 2.3 1V14a1.5 1.5 0 0 1-1.6 1.5A12.2 12.2 0 0 1 6.5 6.2 1.5 1.5 0 0 1 8 4.6z"/>',
  video: '<path fill="currentColor" d="M4 7.2A1.7 1.7 0 0 1 5.7 5.5h8.1A1.7 1.7 0 0 1 15.5 7.2v9.6a1.7 1.7 0 0 1-1.7 1.7H5.7A1.7 1.7 0 0 1 4 16.8V7.2zm11.5 2.1 4-2.3v10l-4-2.3v-5.4z"/>',
  spark: '<path fill="currentColor" d="M12 2.8 13.6 8 19 9.2 13.6 10.8 12 16.2 10.4 10.8 5 9.2 10.4 8 12 2.8zm6.2 9.2.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1z"/>',
  back: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 5 8 12l7 7"/>',
  close: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 5v14M5 12h14"/>',
  smile: '<circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="10" r="1.15" fill="currentColor"/><circle cx="15" cy="10" r="1.15" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M8.4 13.6c.9 1.5 2.1 2.2 3.6 2.2s2.7-.7 3.6-2.2"/>',
  gif: '<rect x="2.5" y="6" width="19" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M6.2 9.1h2.3v1.15H7.35v.7h1.05v1H7.35V15H6.2V9.1zm3.35 0h2.55v1.15h-1.4V15H9.55V9.1zm3.7 0h2.7v1.15h-1.55v.85h1.4v1.05h-1.4V15h-1.15V9.1z"/>',
  link: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M10.2 13.4a3.6 3.6 0 0 0 5.1.2l1.8-1.8a3.6 3.6 0 0 0-5.1-5.1l-1 1"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M13.8 10.6a3.6 3.6 0 0 0-5.1-.2l-1.8 1.8a3.6 3.6 0 0 0 5.1 5.1l1-1"/>',
  gear: '<path fill="currentColor" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.3 7.3 0 0 0-1.7-.98l-.38-2.65A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.59-1.7.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.53.4 1.09.73 1.7.98l.38 2.65c.05.24.25.42.49.42h4c.24 0 .44-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.7-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5z"/>',
  speaker: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M4 9.5h3.2L11 6.2v11.6L7.2 14.5H4z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M14.2 9.2a3.2 3.2 0 0 1 0 5.6M16.6 7a6 6 0 0 1 0 10"/>',
};

export function icon(name) {
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name] || ''}</svg>`;
}
