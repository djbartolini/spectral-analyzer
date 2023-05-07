import Analyzer from "./components/Analyzer";
import Controls from "./components/Controls";
import Header from "./components/Header";
import styles from "./styles";

const {
  SBody
} = styles;

const App = () => {

  return (
    <SBody>
      <Header />
      <Analyzer />
      <Controls />
    </SBody>
  )
}

export default App;
