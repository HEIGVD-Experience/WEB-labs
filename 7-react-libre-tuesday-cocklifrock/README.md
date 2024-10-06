# Tetris v2

```
        ,----,                                                                                           
      ,/   .`|                                                                                           
    ,`   .'  :                ___                                                               ,----,   
  ;    ;     /              ,--.'|_               ,--,                                        .'   .' \  
.'___,/    ,'               |  | :,'    __  ,-. ,--.'|                                      ,----,'    | 
|    :     |                :  : ' :  ,' ,'/ /| |  |,       .--.--.                 .---.   |    :  .  ; 
;    |.';  ;      ,---.   .;__,'  /   '  | |' | `--'_      /  /    '              /.  ./|   ;    |.'  /  
`----'  |  |     /     \  |  |   |    |  |   ,' ,' ,'|    |  :  /`./            .-' . ' |   `----'/  ;   
    '   :  ;    /    /  | :__,'| :    '  :  /   '  | |    |  :  ;_             /___/ \: |     /  ;  /    
    |   |  '   .    ' / |   '  : |__  |  | '    |  | :     \  \    `.          .   \  ' .    ;  /  /-,   
    '   :  |   '   ;   /|   |  | '.'| ;  : |    '  : |__    `----.   \          \   \   '   /  /  /.`|   
    ;   |.'    '   |  / |   ;  :    ; |  , ;    |  | '.'|  /  /`--'  /           \   \    ./__;      :   
    '---'      |   :    |   |  ,   /   ---'     ;  :    ; '--'.     /             \   \ | |   :    .'    
                \   \  /     ---`-'             |  ,   /    `--'---'               '---"  ;   | .'       
                 `----'                          ---`-'                                   `---'          
                                                                                                         
```

## Description
This application is a multiplayer Tetris game designed with a focus on simplicity and interactivity.
It employs [Svelte](https://svelte.dev/) for efficient, reactive backend operations, and [Tailwind CSS](https://tailwindcss.com/) for a streamlined, responsive user interface.
Together, these tools provide a robust and engaging experience, allowing players to enjoy real-time Tetris matches with ease.

## Svelte 
<img src="https://github.com/web-classroom/7-react-libre-tuesday-cocklifrock/blob/main/img/Svelte.png" height="100">

[Svelte](https://svelte.dev/) is a modern JavaScript framework for building user interfaces. Unlike traditional frameworks like React or Vue, Svelte shifts much of the work to compile time, producing highly efficient imperative code that updates the DOM. This approach eliminates the need for a virtual DOM, reducing overhead and leading to faster applications. Svelte's syntax is clean and component-based, making it straightforward for developers to write readable and maintainable code.


## Tailwind CSS 
<img src="https://github.com/web-classroom/7-react-libre-tuesday-cocklifrock/blob/main/img/TailwindCSS.png" height="100">

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework that allows developers to style their applications directly in the HTML markup. This framework focuses on rapid UI development by providing low-level utility classes that can be composed to build complex designs. Tailwind eliminates the need to write custom CSS, speeding up the development process and ensuring consistent styling across the application.


## Launching the Application

> **This guide also assumes that the user has npm installed on their computer. If npm is not installed you can go [here](https://nodejs.org/en/download/package-manager)**

To get the application running, you'll need to set up the backend and the frontend servers. Follow these steps to launch the backend and the frontend servers:

1. **Navigate to the Backend Folder**
   
   Open your file explorer and go to the directory where the backend code is stored.

2. **Open a Terminal**

   - On Windows: Right-click in the folder while holding `Shift` and select `Open PowerShell window here`.
   - On macOS or Linux: Right-click in the folder and select `Open Terminal`.

3. **Install Dependencies**

   Type the following command in the terminal to install all the required dependencies:

   ```bash
   npm install
   ```

4. **Start the Backend Server**
   
   Once the dependencies are installed, start the backend server by running:

   ```bash
   npm start
   ```
   
   This will start the backend server, and you should see output in the terminal indicating that the server is running.

   ```bash
   > 07-websocket@1.0.0 start
   > node --experimental-modules server.js
   App started.
   ```

5. **Navigate to the Frontend Folder**
   
   Open your file explorer and go to the directory where the frontend code is stored.

6. **Open a Terminal**

   - On Windows: Right-click in the folder while holding `Shift` and select `Open PowerShell window here`.
   - On macOS or Linux: Right-click in the folder and select `Open Terminal`.

7. **Install Dependencies**

   Type the following command in the terminal to install all the required dependencies for the frontend server:

   ```bash
   npm install
   ```
8. **Start the Frontend Server**

   Once the dependencies are installed, start the frontend server by running:

   ```bash
   npm run dev

   # or start the server and open the app in a new browser tab
   npm run dev -- --open
   ```
   
   This will start the frontend server, which typically runs on a development server with live reloading. You should see output in the terminal indicating that the server is running and possibly a URL to access the application in a web browser.

   ```bash
   > frontend@0.0.1 dev
   > vite dev


   VITE v5.2.12  ready in 958 ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ➜  press h + enter to show help
   ```


   
   

