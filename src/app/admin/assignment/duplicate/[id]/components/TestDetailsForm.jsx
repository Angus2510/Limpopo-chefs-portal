import React, { useState, useEffect } from 'react';
import CombinedDurationSelector from './CombinedDurationSelector';
import StudentSelect from '@/components/select/StudentSelect';
import CampusSelect from '@/components/select/CampusSelect';
import IntakeGroupSelect from '@/components/select/IntakeGroupSelect';
import OutcomeSelect from '@/components/select/TestOutcomeSelect';
import ShortQuestion from './questions/ShortQuestion';
import LongQuestion from './questions/LongQuestion';
import MatchQuestion from './questions/MatchQuestion';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import SingleWordQuestion from './questions/SingleWordQuestion';
import TrueFalseQuestion from './questions/TrueFalseQuestion';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Card from "@/components/card";
import moment from 'moment-timezone';

import 'moment/locale/en-gb';

moment.locale('en-gb');


function TestDetailsForm({ testDetails, updateTestDetail }) {
    // const [selectedStudents, setSelectedStudents] = useState(testDetails.individualStudents.map(c => c._id) || []);
    // const [selectedCampuses, setSelectedCampuses] = useState(testDetails.campus.map(c => c._id) || []);
    // const [selectedIntakeGroups, setSelectedIntakeGroups] = useState(testDetails.intakeGroups.map(g => g._id) || []);
    // const [selectedOutcomes, setSelectedOutcomes] = useState(testDetails.outcome.map(o => o._id) || []);

    const [selectedStudents, setSelectedStudents] = useState(
        Array.isArray(testDetails.students) ? testDetails.students.map(c => c?._id) : []
    );
    const [selectedCampuses, setSelectedCampuses] = useState(
        Array.isArray(testDetails.campuses) ? testDetails.campuses.map(c => c?._id) : []
    );
    const [selectedIntakeGroups, setSelectedIntakeGroups] = useState(
        Array.isArray(testDetails.intakeGroups) ? testDetails.intakeGroups.map(g => g?._id) : []
    );
    const [selectedOutcomes, setSelectedOutcomes] = useState(
        Array.isArray(testDetails.outcomes) ? testDetails.outcomes.map(o => o?._id) : []
    );
    
    const [hours, setHours] = useState(Math.floor(testDetails.duration / 60));
    const [minutes, setMinutes] = useState(testDetails.duration % 60);
    const [currentQuestionText, setCurrentQuestionText] = useState('');
    const [questions, setQuestions] = useState(testDetails.questions || []);
    const [questionType, setQuestionType] = useState('');
    const [currentMarks, setCurrentMarks] = useState('');
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);
    const [options, setOptions] = useState([]);
    const [selectedDateTime, setSelectedDateTime] = useState(testDetails.availableFrom || '');

    const questionComponents = {
        Short: ShortQuestion,
        Long: LongQuestion,
        Match: MatchQuestion,
        MultipleChoice: MultipleChoiceQuestion,
        SingleWord: SingleWordQuestion,
        TrueFalse: TrueFalseQuestion,
    };

 
    const defaultMarks = {
        Short: 2,
        Long: 5,
        Match: 3,
        MultipleChoice: 4,
        SingleWord: 1,
        TrueFalse: 1,
    };

    
    useEffect(() => {
        if (questionType && editingIndex === -1) {
            setCurrentMarks(defaultMarks[questionType] || '');
        }
    }, [questionType, editingIndex]);

    useEffect(() => {
        const totalDuration = hours * 60 + minutes;
        updateTestDetail({
            ...testDetails,
            students: selectedStudents,
            campuses: selectedCampuses,
            intakeGroups: selectedIntakeGroups,
            outcomes: selectedOutcomes,
            duration: totalDuration,
            questions: questions
        });
    }, [selectedStudents, selectedCampuses, selectedIntakeGroups, selectedOutcomes, hours, minutes, questions]);
    const handleDateTimeChange = (newDateTime) => {
        console.log('Selected DateTime:', newDateTime); 
        const utcDateTime = moment(newDateTime).utc().format();
        console.log('Converted to UTC:', utcDateTime); 
        setSelectedDateTime(newDateTime);
        updateTestDetail({ ...testDetails, availableFrom: utcDateTime });
    };

    const deriveCorrectAnswer = () => {
        switch (questionType) {
            case 'SingleWord':
            case 'TrueFalse':
                return currentAnswer;
            case 'MultipleChoice':
                return options.filter(option => option.isCorrect).map(option => option.value);
            case 'Match':
                return options.map(opt => ({ columnA: opt.columnA, columnB: opt.columnB }));
            default:
                return currentAnswer;
        }
    };

    const handleAddOrUpdateQuestion = () => {
        if (!currentQuestionText || !currentMarks) {
            alert('Please fill in both the question text and marks.');
            return;
        }

        if (questionType === 'SingleWord' && !currentAnswer) {
            alert('Please provide an answer for the single word question.');
            return;
        }

        if (questionType === 'Short' && !currentAnswer) {
            alert('Please provide an answer for the single word question.');
            return;
        }

        if (questionType === 'Long' && !currentAnswer) {
            alert('Please provide an answer for the single word question.');
            return;
        }

        if (questionType === 'MultipleChoice' && options.filter(opt => opt.isCorrect).length === 0) {
            alert('Please select at least one correct answer for the multiple choice question.');
            return;
        }

        if (questionType === 'Match' && options.some(opt => !opt.columnA || !opt.columnB)) {
            alert('Please complete all pairs for the match question.');
            return;
        }

        const newQuestion = {
            text: currentQuestionText,
            mark: currentMarks,
            options: options,
            type: questionType,
            correctAnswer: deriveCorrectAnswer(),
        };

        if (editingIndex >= 0) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingIndex] = newQuestion;
            setQuestions(updatedQuestions);
        } else {
            setQuestions([...questions, newQuestion]);
        }
        resetInputs();
    };

    const resetInputs = () => {
        setCurrentQuestionText('');
        setCurrentAnswer('');
        setCurrentMarks('');
        setQuestionType('');
        setEditingIndex(-1);
        setOptions([]);
    };

    const handleEditQuestion = (index) => {
        const question = questions[index];
        setEditingIndex(index);
        setCurrentQuestionText(question.text);
        setQuestionType(question.type);
        setCurrentMarks(question.mark);
        setCurrentAnswer(question.correctAnswer);
        setOptions(question.options || []);
    };

    const cancelEdit = () => resetInputs();

    const handleSelectionChange = (field, value) => {
        updateTestDetail({ ...testDetails, [field]: value });
    };

    const getTotalMarks = () => {
        return questions.reduce((total, question) => total + (parseInt(question.mark, 10) || 0), 0);
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    return (
        <Card>
            <div className="space-y-12 p-6">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Test/Task Details</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Enter the details of the test</p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="testName" className="block text-sm font-medium leading-6 text-gray-900">Test/Task Name</label>
                            <input
                                id="testName"
                                type="text"
                                value={testDetails.title || ''}
                                onChange={(e) => handleSelectionChange('title', e.target.value)}
                                placeholder="Enter test name"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="testDateTime" className="block text-sm font-medium leading-6 text-gray-900">Test/Task Date/Time</label>
                            <Datetime
                                id="testDateTime"
                                value={selectedDateTime}
                                inputProps={{ className: 'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500' }}
                                onChange={handleDateTimeChange}
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="testDuration" className="block text-sm font-medium leading-6 text-gray-900">Test/Task Duration</label>
                            <CombinedDurationSelector
                                hours={hours}
                                minutes={minutes}
                                setHours={setHours}
                                setMinutes={setMinutes}
                                id="testDuration"
                                dateFormat="YYYY-MM-DD"
                                timeFormat="HH:mm"
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">Test/Task Type</label>
                            <select
                                className="form-select block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                id="type"
                                value={testDetails.type || ''}
                                onChange={(e) => handleSelectionChange('type', e.target.value)}
                            >
                                <option value="">Select Type</option>
                                <option value="Test">Test</option>
                                <option value="Task">Task</option>
                            </select>
                        </div>
                        <div className="sm:col-span-3">
                            <StudentSelect selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
                        </div>
                        <div className="sm:col-span-3">
                            <CampusSelect selectedCampuses={selectedCampuses} setSelectedCampuses={setSelectedCampuses} />
                        </div>
                        <div className="sm:col-span-3">
                            <IntakeGroupSelect selectedIntakeGroups={selectedIntakeGroups} setSelectedIntakeGroups={setSelectedIntakeGroups} />
                        </div>
                        <div className="sm:col-span-3">
                            <OutcomeSelect selectedOutcomes={selectedOutcomes} setSelectedOutcomes={setSelectedOutcomes} />
                        </div>
                    </div>
                </div>
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Add Questions</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Add questions to the test/task</p>
                    <div className="mt-10">
                        <select
                            value={questionType}
                            onChange={(e) => setQuestionType(e.target.value)}
                            className="form-select block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Question Type</option>
                            <option value="Short">Short Answer</option>
                            <option value="Long">Long Answer</option>
                            <option value="SingleWord">Single Word Answer</option>
                            <option value="TrueFalse">True or False</option>
                            <option value="Match">Match Question</option>
                            <option value="MultipleChoice">Multiple Choice</option>
                        </select>
                        {questionType && (
                            <>
                                <input
                                    type="text"
                                    value={currentQuestionText}
                                    onChange={(e) => setCurrentQuestionText(e.target.value)}
                                    placeholder="Enter question text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                {questionType === 'SingleWord' && (
                                    <input
                                        type="text"
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="Enter the correct answer"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                )}
                                {questionType === 'Long' && (
                                    <input
                                        type="text"
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="Enter the correct answer"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                )}
                                   {questionType === 'Short' && (
                                    <input
                                        type="text"
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="Enter the correct answer"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                )}
                                {questionType === 'TrueFalse' && (
                                    <TrueFalseQuestion
                                        answer={currentAnswer}
                                        onAnswerChange={(value) => setCurrentAnswer(value)}
                                    />
                                )}
                                {questionType === 'MultipleChoice' && (
                                    <MultipleChoiceQuestion
                                        options={options}
                                        setOptions={setOptions}
                                        questionText={currentQuestionText}
                                        setQuestionText={setCurrentQuestionText}
                                    />
                                )}
                                {questionType === 'Match' && (
                                    <MatchQuestion
                                        options={options}
                                        setOptions={setOptions}
                                        currentQuestionText={currentQuestionText}
                                        setCurrentQuestionText={setCurrentQuestionText}
                                    />
                                )}
                                <input
                                    type="number"
                                    value={currentMarks}
                                    onChange={(e) => setCurrentMarks(e.target.value)}
                                    placeholder="Marks for the question"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                <button onClick={handleAddOrUpdateQuestion} className="bg-brand-500 hover:bg-brand-700 text-white font-bold py-2 px-4 rounded mt-2">
                                    {editingIndex >= 0 ? 'Update Question' : 'Add Question'}
                                </button>
                                {editingIndex >= 0 && (
                                    <button onClick={cancelEdit} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mt-2">
                                        Cancel Edit
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Test Questions</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">View and edit the questions</p>
                    <div className="mt-10">
                        {questions.map((q, index) => (
                            <div key={index} className="p-4 mt-2 border rounded bg-white shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold">Question {index + 1}</h2>
                                        <p className="text-gray-800 mt-1">{q.text}</p>
                                        {q.type === 'TrueFalse' && (
                                            <p className="text-sm font-medium text-gray-600">Answer: {q.correctAnswer}</p>
                                        )}
                                        {q.type === 'MultipleChoice' && (
                                            <div className="mb-4">
                                                {q.options.map((option, idx) => (
                                                    <div key={idx} className={`px-4 py-2 rounded-lg ${q.correctAnswer.includes(option.value) ? 'bg-brand-200' : 'bg-gray-200'}`}>
                                                        {option.value} {q.correctAnswer.includes(option.value) ? '(Correct)' : ''}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {q.type === 'Match' && q.options.map((pair, idx) => (
                                            <div key={idx} className="text-sm">
                                                {pair.typeA === 'text' ? (
                                                    pair.columnA // Render text if it's not an image
                                                ) : (
                                                    <img src={typeof pair.columnA === 'string' ? pair.columnA : URL.createObjectURL(pair.columnA)} alt="Column A" style={{ maxWidth: '100px', maxHeight: '100px' }} onLoad={() => URL.revokeObjectURL(pair.columnA)} /> // Render image
                                                )} matches with 
                                                {pair.typeB === 'text' ? (
                                                    pair.columnB // Render text if it's not an image
                                                ) : (
                                                    <img src={typeof pair.columnB === 'string' ? pair.columnB : URL.createObjectURL(pair.columnB)} alt="Column B" style={{ maxWidth: '100px', maxHeight: '100px' }} onLoad={() => URL.revokeObjectURL(pair.columnB)} /> // Render image
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">{q.mark} Marks</span>
                                </div>
                                <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEditQuestion(index)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteQuestion(index)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                            </div>
                        ))}
                        <div className="p-4 mt-2 text-xl font-semibold">
                            Total Marks: {getTotalMarks()}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default TestDetailsForm;
