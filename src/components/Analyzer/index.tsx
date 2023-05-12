import { useRef, useEffect, useState, MutableRefObject } from 'react';

import styles from './styles';
import Controls from '../Controls';

const {
  SAnalyzer
} = styles;

const Analyzer = () => {

  const [file, setFile] = useState<File | null>();
  // @ts-ignore
  const [animationId, setAnimationId] = useState<number | null>(null); 

  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);


  let audioFile: File;
  const filePath = '/sounds/DRY.mp3';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUpload = event.target.files?.[0];
    setFile(fileUpload);
  }

  // @ts-ignore
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
  }


  useEffect(() => {
    file ? handleAnalyzer(file) : null;
  }, [audioElementRef.current]);

  const handlePlay = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play();
    }
  };

  const handlePause = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      animationId ? cancelAnimationFrame(animationId) : null;
    }
  };


  const handleAnalyzer = async (file: File): Promise<void> => {
    
    const base64 = await audioFileToBase64(file);

    console.log("base64", base64);
    const audio1 = new Audio(base64);

    const audioContext = new AudioContext();

    let audioSource = audioContext.createMediaElementSource(audioElementRef.current ?? audio1);
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
    <>
      <SAnalyzer>
        
        
        <div ref={containerRef} style={{width: "400px", height: "400px"}}>
          <canvas ref={canvasRef}>

          </canvas>
        </div>
        

      </SAnalyzer>
      <Controls 
        handlePlay={handlePlay}
        handlePause={handlePause}
        handleFileUpload={handleFileUpload}
        file={file}
        audioElementRef={audioElementRef}
      />
    </>
  )
}

export default Analyzer;
