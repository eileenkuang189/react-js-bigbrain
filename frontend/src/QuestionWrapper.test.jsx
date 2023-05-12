import React from 'react';
import { render } from '@testing-library/react';
import QuestionWrapper from './components/QuestionWrapper';

describe('QuestionWrapper', () => {
  const props = {
    qno: 1,
    question: 'What is your favorite color?',
    choices: ['Red', 'Green', 'Blue'],
  };
  it('should render the question and choices', () => {
    const { getByText } = render(<QuestionWrapper {...props} />);
    expect(getByText(`Q${props.qno}: ${props.question}`)).toBeInTheDocument();
    props.choices.forEach((choice) => {
      expect(getByText(choice)).toBeInTheDocument();
    });
  });
});
