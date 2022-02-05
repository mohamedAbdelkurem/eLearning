import { ReactElement, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import Quiz from "react-quiz-component";
import { Button, Spin, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../redux/types";
import NotFound from "../shared/NotFound";
import {
  resetSubmited,
  submitLessonQuizResult,
} from "../../redux/slices/lessonSlice";
function LessonQuiz(): ReactElement {
  const location = useLocation();
  const { state }: any = location;
  return (
    <div className="flex justify-center mt-10 text-lg bg-white border border-gray-300 rounded shadow-sm justify-items-center">
      {!state.quiz ? (
        <NotFound />
      ) : (
        <Quiz
          quiz={state.quiz}
          showDefaultResult={false}
          customResultPage={(obj) => (
            <RenderCustomResultPage
              slug={state.slug}
              identifier={state.identifier}
              obj={obj}
              percentage={state.quiz.percentage}
            />
          )}
          showInstantFeedback={false}
        />
      )}
    </div>
  );
}
const RenderCustomResultPage = ({ obj, percentage, slug, identifier }) => {
  const dispatch = useDispatch();
  const { submitedResult, loading } = useSelector(
    (state: State) => state.lesson
  );
  useEffect(() => {
    dispatch(resetSubmited());
  }, []);
  return (
    <>
      {loading ? (
       <div className="flex justify-center text-center"> <Spin spinning /></div>
      ) : (
        <div className="w-full space-y-4 divide-y-2 divide-gray-300">
          {submitedResult ? (
            <p>submited</p>
          ) : (
            <>
              <div>
                <p>
                  You scored :{" "}
                  <span className="font-bold">
                    {(
                      (obj.numberOfCorrectAnswers * 100) /
                      obj.numberOfQuestions
                    ).toFixed(2)}{" "}
                    %
                  </span>
                </p>
                <p>{percentage}% is required to pass this quiz</p>
                {(obj.numberOfCorrectAnswers * 100) / obj.numberOfQuestions >
                percentage ? (
                  <div className="space-x-2">
                    <Button
                      type="primary"
                      onClick={() => {
                        dispatch(submitLessonQuizResult({ slug, identifier }));
                      }}
                    >
                      submit result
                    </Button>
                    <Tag className="text-lg" color="green">
                      quiz passed 🤩
                    </Tag>
                  </div>
                ) : (
                  <Tag className="text-lg" color="red">
                    quiz failed 😥
                  </Tag>
                )}
              </div>
              <div>
                <h3>details :</h3>
                {obj.questions.map((q, index) => (
                  <div className="w-full p-2 border border-gray-50 ">
                    <p className="pr-2 bg-gray-200">
                      {index + 1}/ {q.question}
                    </p>
                    <p>
                      <span className="font-semibold">correct answer</span> :
                      {q.correctAnswer} - {q.answers[q.correctAnswer - 1]}
                    </p>
                    <p>
                      <span className="font-semibold">your answer </span>:
                      {q.correctAnswer} - {q.answers[obj.userInput[index] - 1]}
                    </p>
                    {q.correctAnswer == obj.userInput[index] ? (
                      <Tag className="text-lg" color="green">
                        correct
                      </Tag>
                    ) : (
                      <Tag className="text-lg" color="red">
                        incorrect
                      </Tag>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default LessonQuiz;
