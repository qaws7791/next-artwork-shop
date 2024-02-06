import { getDoc, doc } from "firebase/firestore";
import { db } from "./index";

interface AIGenerator {
  id: string;
  generatorName: string;
  description: string;
  logoImageUrl: string;
}

const fetchAIGenerator = async (aiGeneratorId: string) => {
  const aiGeneratorDoc = await getDoc(doc(db, "ai-generators", aiGeneratorId));
  if (!aiGeneratorDoc.exists()) {
    return null;
  }
  const aiGeneratorData = {
    id: aiGeneratorDoc.id,
    ...aiGeneratorDoc.data(),
  } as AIGenerator;

  return aiGeneratorData;
};

const AIGeneratorService = {
  fetchAIGenerator,
};

export default AIGeneratorService;
