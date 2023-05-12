import styles from './styles';


const {
  SAnalyzer
} = styles;

const Analyzer = () => {

  let audioFile: File;
  const filePath = '/sounds/robot.wav';

  const getAudioFile = async () => {
    await fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        audioFile = new File([blob], 'audio.wav', { type: 'audio/wav' })
      });
  }

  const audioFileToBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
    });
  };

  const handlePlay = async () => {
    await getAudioFile();
    const base64 = await audioFileToBase64(audioFile);

    console.log("base64", base64);
    const audio1 = new Audio(base64);
    audio1.play();
  }

  return (
    <SAnalyzer>
      <button onClick={handlePlay}>
        AUDIO
      </button>

    </SAnalyzer>
  )
}

export default Analyzer;
