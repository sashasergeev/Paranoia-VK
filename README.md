# Paranoia@VK

**Paranoia@VK is an privacy extension for chrome browser. It works with the social media VK.** 

The idea is in encryption of messages with key, acesss to which is only on hands people you share it with. So it is like end-to-end encryption because a message is being decrypted only on recipient's device, and only if key (associated with this dialog/chat/whatever) is present in extension on it.

The extension only stores keys in its own local storage, without any data transfer to third party services.

---
## WORKFLOW
Here i will show you how this works from users side.

1. First, user needs to go to page [**message page**](https://vk.com/im), extension won't work on any other page because of url constraints.
2. At this moment, extension is works and waits for you to choose dialog.

    At extension popup you will see:

    <img src="https://ik.imagekit.io/sashasergeev/paranoiavk-guide/select.png" alt="Select dialog" height="450px" width="auto" />

3. Now user is selected dialog, he has two ways:
    
    I. If he previously was in this dialog and generated or inputted a key, he will see this:
    
    <img src="https://ik.imagekit.io/sashasergeev/paranoiavk-guide/selected_with_key.png"  alt="Selected dialog with key" height="450px" width="auto"  />


    II. If he first time in dialog with this extension he will see: 
        
    <img src="https://ik.imagekit.io/sashasergeev/paranoiavk-guide/selected_without_key_zJeOL79uA.png" alt="Selected dialog without key" height="450px" width="auto" />
        
4. Now when user has a key and has shared it, he can send encrypted messages and also decrypt them.
5. In order for user to send encrypted message, he needs to press special, injected by extension, button **Paranoia@Send**.
    
    <img src="https://ik.imagekit.io/sashasergeev/paranoiavk-guide/msg-bar_fs10rrUjN.png" alt="Message bar" />
6. If extension is on, and key is assigned to this dialog, user will see decrypted messages.
    
    <img src="https://ik.imagekit.io/sashasergeev/paranoiavk-guide/decrypted-msgs_9gjT9Kc7S.png" style="display: block; margin: 5px auto" alt="Decrypted messages and errors" />
    
    The messages that was encrypted with this extension, will be highlighted by trademark **[P@VK]** as we can see on an image.

    In case, when message was encrypted with another key, extension will show an error message in place of hash, there also tips in this message about what to do.
7. If user don't need extension to work anymore, he just need to go to extension popup and turn it off, by clicking top button.
8. When extension is off, send button won't be injected and messages won't be decrypted.
        
    <img src="https://ik.imagekit.io/sashasergeev/paranoiavk-guide/extension-is-off.png" style="display: block; margin: 5px auto" alt="Extension view - off" height="450px" width="auto"  />
    
    You are also able to delete **ALL** keys, when extension is off.
    As you could mention, icon is depends on the current status.

    And this is how encrypted messages looks:
    
    <img src="https://ik.imagekit.io/sashasergeev/paranoiavk-guide/encrypted.messages_nLTU7J3g9.png" style="display: block; margin: 5px auto" alt="Encrypted messages" />


---

## Limitations/Bugs
For now, there is several limitations/bugs which **will be fixed soon**.

1. Extension isn't working with two message pages at a time, it will work only with page that was first opened.
2. Right now, when user on dialog page, that has key and decide to switch to another with dialog keys, it will try to decrypt messages with key assigned to first dialog. So user, in order it to work properly, needs to go to messages page, and choose it from there.
---
## Plans
- Make it not only for VK social media.
- Change algorithm of encryption, because here i use AES algorithm from library called [**crypto-js**](https://www.npmjs.com/package/crypto-js), which is not that safe regards vulnerabilities.

---
---
## How to run it on your computer
As for now, i didn't upload it to chrome extension store, so the only way to run this:

1. Clone repository.
2. Enter to cmd command:

    ``` yarn run build ```
3. After this, go to chrome, type in address bar: 

    ```chrome://extensions/```
4. At right top turn on Developer Mode.
5. Now, click button "**Load unpacked**".
6. Select **dist** folder that was created in project directory in the 2 step.
7. That's all!  

---

## Tech stack
Nothing too special here:
> HTML, CSS, JavaScript, React, crypto-js, react-qr-code, bunch of webpack plugins, babel ofc.

