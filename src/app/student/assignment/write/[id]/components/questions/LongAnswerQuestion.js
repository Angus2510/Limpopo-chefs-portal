export default function LongQuestion({ question, questionNumber, mark, value, onChange }) {
  const numericMark = Number(mark);
  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Question {questionNumber}</h2>
        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
          Long Question
        </span>
        <p className="text-gray-800 mt-1">{question}</p>
        <div className="mt-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Use the editor to format your answer"
            rows="6"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
        {numericMark} {numericMark === 1 ? 'Mark' : 'Marks'}
        </span>
      </div>
    </div>
  );
}
