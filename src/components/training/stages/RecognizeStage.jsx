import AnswerStage from './AnswerStage';
import { recognitionDrills } from '../../../learning/answerEvaluator';
export default function RecognizeStage({lessonData,...props}) {return <AnswerStage {...props} drills={recognitionDrills(lessonData)}/>;}

