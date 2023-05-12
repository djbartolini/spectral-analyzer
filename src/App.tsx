import Analyzer from "./components/Analyzer";
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
    </SBody>
  )
}

export default App;
