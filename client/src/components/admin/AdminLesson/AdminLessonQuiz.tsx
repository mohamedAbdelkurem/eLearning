import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { State } from "../../../redux/types";
import { Form, Input, Button, Space, Spin } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FormListFieldData } from "antd/lib/form/FormList";
import { addQuizLesson, getLesson } from "../../../redux/slices/lessonSlice";

const AdminLessonQuiz = () => {
  const location: any = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [questionsErrors, setquestionsErrors] = useState(false);
  useEffect(() => {
    setquestionsErrors(false);
    dispatch(
      getLesson({
        slug: location.state.slug,
        identifier: location.state.identifier,
      })
    );
  }, [dispatch, location.state.slug]);
  const onFinish = (quiz) => {
    console.table("Received quiz of form:", quiz);
    if (quiz.questions && quiz.questions.length > 0) {
      setquestionsErrors(false);
      dispatch(
        addQuizLesson({
          title: quiz.quizTitle,
          quiz: JSON.stringify({ ...quiz, questionType: "text" }),
          slug: location.state.slug,
          identifier: location.state.identifier,
        })
      );
      history.goBack();
    } else {
      setquestionsErrors(true);
    }
  };
  const { loading, lesson } = useSelector((state: State) => state.lesson);
  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="container py-4">
          <h1 className="text-xl font-semibold text-center">
            Build quiz for lesson : {lesson.title}
          </h1>
          <Form
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            autoComplete="off"
            className="p-2 border border-gray-400"
          >
            <Form.Item
              name="quizTitle"
              fieldKey={"quizTitle"}
              rules={[
                { required: true, message: "please provide a quiz title" },
              ]}
            >
              <Input placeholder="Quiz title" allowClear />
            </Form.Item>
            <Form.Item
              name="quizSynopsis"
              fieldKey={"quizDescription"}
              rules={[
                { required: true, message: "please provide a quiz title" },
              ]}
            >
              <Input placeholder="Quiz description" allowClear />
            </Form.Item>
            <Form.Item
              name="percentage"
              fieldKey={"percentage"}
              rules={[
                { required: true, message: "please provide a percentage" },
              ]}
            >
              <Input
                placeholder="percentage"
                allowClear
                type="number"
                min={0}
                max={100}
              />
            </Form.Item>
            <Form.List name="questions">
              {(fields, { add, remove }) => {
                return (
                  <div className="p-2 border ">
                    {fields.map((field: FormListFieldData) => (
                      <div className="p-2 border border-gray-400">
                        Question {field.name}
                        <Form.Item
                          {...field}
                          name={[field.name, "question"]}
                          fieldKey={[field.fieldKey, "question"]}
                          rules={[
                            { required: true, message: "Missing question" },
                          ]}
                        >
                          <Input
                            prefix={
                              <MinusCircleOutlined
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            }
                            placeholder="question"
                            allowClear
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "questionType"]}
                          fieldKey={[field.fieldKey, "questionType"]}
                          className="hidden"
                          initialValue="text"
                        >
                          <Input
                            type="text"
                            placeholder="questionType"
                            disabled
                          />
                        </Form.Item>
                        <Form.List name={[field.name, "answers"]}>
                          {(answers, { add, remove }) => {
                            return (
                              <div>
                                {answers.map((answer) => (
                                  <Space key={answer.key} align="start">
                                    <Form.Item
                                      label={String(answer.key + 1)}
                                      {...answer}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing answer",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="answer" />
                                    </Form.Item>

                                    <MinusCircleOutlined
                                      onClick={() => {
                                        remove(answer.name);
                                      }}
                                    />
                                  </Space>
                                ))}

                                <Form.Item>
                                  <Button
                                    type="link"
                                    onClick={() => {
                                      add();
                                    }}
                                    block
                                  >
                                    <PlusOutlined /> add answer
                                  </Button>
                                </Form.Item>
                              </div>
                            );
                          }}
                        </Form.List>
                        <Form.Item
                          {...field}
                          name={[field.name, "correctAnswer"]}
                          fieldKey={[field.fieldKey, "correctAnswer"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing correctAnswer",
                            },
                          ]}
                        >
                          <Input
                            placeholder="correctAnswer"
                            type="number"
                            min={0}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "point"]}
                          fieldKey={[field.fieldKey, "point"]}
                          initialValue={10}
                          className="hidden"
                        >
                          <Input placeholder="point" type="number" />
                        </Form.Item>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          add();
                        }}
                        block
                      >
                        <PlusOutlined /> Add question
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          {questionsErrors && (
            <p className="m-1 text-sm text-red-500">
              * At least add one question
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminLessonQuiz;
