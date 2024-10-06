import { redirect } from '@sveltejs/kit';

export function load() {

    const adjectives = ['Brave', 'Clever', 'Witty', 'Swift', 'Bold'];
    const nouns = ['Eagle', 'Tiger', 'Shark', 'Panther', 'Wolf'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const random = `${randomAdjective}${randomNoun}${Math.floor(Math.random() * 1000)}`;

    throw redirect(302, `/game?username=${random}`);
}