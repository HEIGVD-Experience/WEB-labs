<script>
// @ts-nocheck

    import { onMount } from "svelte";
    import { page } from '$app/stores';
    import { Renderer } from "../../../../common/src/renderer.js";
    import { Replica } from "../../../../common/src/game.js";
    import { GameMap } from "../../../../common/src/gameMap.js";
    import { gameCols, gameRows } from "../../../../common/src/constants.js";
    import { setListeners } from "../../../../common/src/inputListener.js";
    import { JoinMessage, MessageCodec } from "../../../../common/src/messages.js";
    
    import { get } from 'svelte/store';

    /**
     * @type {HTMLCanvasElement}
     */
    let canvasElement;

    // Get the username from the URL parameters
    let username;
    // @ts-ignore
    $: username = get(page).url.searchParams.get('username');
    let playerId;

    onMount(() => {
        const context = canvasElement.getContext("2d");

        const gameMap = new GameMap(gameCols, gameRows);
        const replica = new Replica(gameMap);
        const renderer = new Renderer(replica, context);

        // Render loop
        function loop() {
            renderer.render();
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);

        // Get hostname from current URL
        const socket = new WebSocket('ws://localhost:3000/');

        socket.addEventListener('open', () => {
            // @ts-ignore
            setListeners(canvasElement, (message) => {
                socket.send(MessageCodec.encode(message));
            });
        });

        socket.addEventListener('message', (event) => {
            const message = MessageCodec.decode(event.data);
            if (message instanceof JoinMessage) {
                playerId = message.getPlayerId();
                renderer.setPlayerId(playerId);
            } else {
                replica.onMessage(message);
                renderer.updateScores();
            }
        });
    });
</script>

<div class='flex items-center justify-center min-h-screen from-green-400 via-purple-700 to-red-900 bg-gradient-to-br'>
    <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
        <div class='max-w-md mx-auto space-y-6'>
            <h2 class="text-2xl font-bold">Wonderful tetris game here!</h2>
            <p class='text-lg'>Welcome, <b>{username}</b> you are player <b>{playerId}</b>!</p>

            <div id="content">
                <div id="game">
                    <canvas id="canvas" bind:this={canvasElement} width="300" height="600"></canvas>
                    <div id="infoPannel">
                        <div id="currentPlayer"></div>
                        <div id="scores"></div>
                    </div>
                </div>
            </div>

            <p class="my-4 content-end">
                <a href='/' class='text-stone-400 content-end hover:underline'>Home page →</a>
            </p>
        </div>
    </div>
</div>
