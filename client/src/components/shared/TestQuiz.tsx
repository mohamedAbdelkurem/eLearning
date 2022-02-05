import { ReactElement } from "react";
import { useLocation } from "react-router";
import Quiz from "react-quiz-component";
import { Alert, Tag } from "antd";
import NotFound from "./NotFound";
function TestQuiz(): ReactElement {
  const location = useLocation();
  const { state }: any = location;
  return (
    <div className="flex justify-center mt-10 text-lg bg-white border border-gray-300 rounded shadow-sm justify-items-center">
      {!state ? (
        <NotFound />
      ) : (
        <div className="w-screen p-2">
          <Alert
            message="you already finished this quiz , the result doesnt count"
            type="info"
            showIcon
          />
          <Quiz
            quiz={state.quiz}
            showDefaultResult={false}
            customResultPage={(obj) => (
              <RenderCustomResultPage
                obj={obj}
                percentage={state.quiz.percentage}
              />
            )}
            showInstantFeedback={false}
          />
        </div>
      )}
    </div>
  );
}
const RenderCustomResultPage = ({ obj, percentage }) => {
  return (
    <div className="w-full space-y-4 divide-y-2 divide-gray-300">
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

          <Alert
          message={`${percentage}% is required to pass this quiz`}
          type="warning"
          className="inline-block m-2"
        />
        </p>
       
        {(obj.numberOfCorrectAnswers * 100) / obj.numberOfQuestions >
        percentage ? (
          <>
            <Tag className="text-lg" color="green">
              quiz passed 🤩
            </Tag>
          </>
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
    </div>
  );
};
export default TestQuiz;
