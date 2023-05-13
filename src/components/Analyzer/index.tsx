import { useRef, useEffect, useState, MutableRefObject } from 'react';

import styles from './styles';
import Controls from '../Controls';

const {
  SAnalyzer,
  SContainer,
  SCanvas
} = styles;

const Analyzer = () => {

  const [file, setFile] = useState<File | null>();
  // @ts-ignore
  const [animationId, setAnimationId] = useState<number | null>(null); 

  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUpload = event.target.files?.[0];
    setFile(fileUpload);
  }

  // const getAudioFile = async () => {
  //   await fetch(filePath)
  //     .then(response => response.blob())
  //     .then(blob => {
  //       audioFile = new File([blob], 'audio.wav', { type: 'audio/wav' })
  //     });
  // }

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
    const base64Audio = new Audio(base64);

    const audioContext = new AudioContext();
    let audioSource = audioContext.createMediaElementSource(audioElementRef.current ?? base64Audio);
    let analyzer = audioContext.createAnalyser();
    audioSource.connect(analyzer);
    analyzer.connect(audioContext.destination);

    // Bands in EQ
    analyzer.fftSize = 64;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (canvas && container) {
      canvas.width = parseInt(getComputedStyle(container).width);
      canvas.height = 500;

      const ctx = canvas.getContext('2d');

      const barWidth = canvas.width / bufferLength;
      let barHeight;
     

      const animate = (): void => {
        let x = 0;
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          analyzer.getByteFrequencyData(dataArray);

          for (let i = 1; i < bufferLength; i++) {
            barHeight = (dataArray[i] * (i / i)) * 1.3;
            const red = 64 + barHeight;
            const green = 256 - (barHeight / 2);
            const blue = 0;
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
          }
        }
        requestAnimationFrame(animate);
      }
      animate();
    }
  }

  const freqComponent = () => {
    const base = 2;
    const min = 40;
    const max = 20000;
    const steps = Math.log2(max / min) / Math.log2(base) + 1; // calculate the number of steps based on the exponential increment
  
    const numbersList = [];
    for (let i = 0; i < steps; i++) {
      const value = min * Math.pow(base, i); // calculate the value of each step based on the exponential increment
      numbersList.push(<p style={{margin: "4px"}} key={value}>{value}</p>);
    }
  
    return <div style={{display: "flex", justifyContent: "space-around"}}>{numbersList}</div>;
  };
  

  return (
    <>
      <SAnalyzer>
        <SContainer ref={containerRef}>
          <SCanvas ref={canvasRef} />
          <div>
            {freqComponent()}
          </div>
        </SContainer>
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
