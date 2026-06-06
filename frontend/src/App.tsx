import { MotionConfig } from "framer-motion";
import { HorizontalShowcase } from "./components/HorizontalShowcase";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HorizontalShowcase />
    </MotionConfig>
  );
}

export default App;
