// const { send } = require("express/lib/response");

const publicVapidKey = 'BJKdJ6-dLREbG4WJ1vsM5E0wNQZN_Jfs1DeHzBExgYab7UcBtewarU1zUudlLQvzr2gLKZ6aNo9M_t3dqQZOMtc';


//Check for service worker

if('serviceWorker' in navigator){
    send().catch(err=>console.log(err));
}

//REgister SW, register Push, Send Push
async function send(){
    console.log('Register service worker...');
    const register =await navigator.serviceWorker.register('/worker.js',{
        scope:'/'
    });
    console.log("service worker registered");
    //REgister Push
    console.log("REgistering Push...")
    const subscription =await register.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(publicVapidKey)
    });
    console.log("Push Registered...")

    //Send Push Notification

    console.log('Sending Push')

    await fetch('/subscribe',{
        method:'Post',
        body:JSON.stringify(subscription),
        headers:{
            'content-type':'application/json'
        }
    });
    console.log('Push Sent...');

}
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
} 