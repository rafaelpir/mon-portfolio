// Charge une seule fois l'API IFrame de YouTube et résout avec `window.YT`.
let youTubeApiPromise;
export function loadYouTubeApi() {
  if (!youTubeApiPromise) {
    youTubeApiPromise = new Promise((resolve) => {
      if (window.YT?.Player) return resolve(window.YT);
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    });
  }
  return youTubeApiPromise;
}
