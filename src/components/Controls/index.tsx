import { RefObject } from 'react';
import styles from './styles';

const {
  SControls
} = styles;

type ControlsProps = {
  handlePlay: () => void;
  handlePause: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null | undefined;
  audioElementRef: RefObject<HTMLAudioElement>;
}

const Controls = ({ handlePause, handlePlay, handleFileUpload, file, audioElementRef }: ControlsProps) => {


  const audioSrc = file ? URL.createObjectURL(file) : '';

  return (
    <SControls>
      
      <audio 
        controls 
        src={audioSrc} 
        onPlay={() => file ? handlePlay() : null} 
        onPause={() => file ? handlePause() : null}
        ref={audioElementRef}
      />
      <input
        type='file'
        onChange={handleFileUpload}
      ></input>
    </SControls>
  )
};

export default Controls;
