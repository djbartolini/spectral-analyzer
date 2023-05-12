import { useRef, MutableRefObject } from 'react';
import styles from './styles';


const {
  SAnalyzer
} = styles;

const Analyzer = () => {

  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  let audioFile: File;
  let audioSource;
  const filePath = '/sounds/DRY.mp3';



  const getAudioFile = async () => {
    await fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        audioFile = new File([blob], 'audio.mpw', { type: 'audio/mp3' })
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
  }



  const handleAnalyzer = async () => {
    await getAudioFile();
    const base64 = await audioFileToBase64(audioFile);

    console.log("base64", base64);
    const audio1 = new Audio(base64);

    audio1.play();

    const audioContext = new AudioContext();

    audioSource = audioContext.createMediaElementSource(audio1);
    let analyzer = audioContext.createAnalyser();
    audioSource.connect(analyzer);
    analyzer.connect(audioContext.destination);
    analyzer.fftSize = 64;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (canvas && container) {
      canvas.width = 800;
      canvas.height = 400;

      const ctx = canvas.getContext('2d');

      const barWidth = canvas.width / bufferLength;
      let barHeight;


      function animate() {
        let x = 0;
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          analyzer.getByteFrequencyData(dataArray);
          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = 'white';
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
          }
        }
        requestAnimationFrame(animate);
      }
      animate();
    }
  }

  return (
    <SAnalyzer>
      <button onClick={handleAnalyzer}>
        AUDIO
      </button>
      <audio controls>

      </audio>
      <div ref={containerRef} style={{width: "400px", height: "400px"}}>
        <canvas ref={canvasRef}>

        </canvas>
      </div>
      

    </SAnalyzer>
  )
}

export default Analyzer;
