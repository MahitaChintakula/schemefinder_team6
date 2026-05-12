export const startVoiceRecognition = () => {

    const recognition =
        new window.webkitSpeechRecognition();

    recognition.lang = "en-IN";

    recognition.start();

    recognition.onresult = (event) => {

        console.log(event.results[0][0].transcript);
    };
};
