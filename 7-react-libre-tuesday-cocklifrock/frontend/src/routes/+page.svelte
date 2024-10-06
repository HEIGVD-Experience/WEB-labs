<div class='flex items-center justify-center min-h-screen from-green-400 via-purple-700 to-red-900 bg-gradient-to-br'>
    <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
        <div class='max-w-md mx-auto space-y-6'>
    
            <h2 class="text-2xl font-bold">Wonderful tetris game here!</h2>

    
            <div class='text-base leading-7'>
                <p class='font-normal text-gray-700'>You can give us your little name here :)</p>

                <form action="/game" method="GET">
                    <div class="my-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
                        <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            required
                            minlength="1"
                        >
                    </div>
                    <button
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-stone-800 text-white shadow hover:bg-primary/90 h-9 px-4 py-2"
                        type="submit"
                    >
                        Let's go!
                    </button>
                </form>
                

                <p class="my-4">
                    <a href='/random' class='text-stone-400 hover:underline'>Use the app with a random name →</a>
                </p>
            </div>
        </div>
    </div>
</div>