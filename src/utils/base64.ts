export function audioToBase64(audio: HTMLAudioElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject('Failed to convert audio to base64.');
      }
    };
    reader.readAsDataURL(audio.src);
  });
}
