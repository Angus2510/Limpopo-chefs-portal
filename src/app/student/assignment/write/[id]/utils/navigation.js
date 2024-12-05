export default function QuestionNavigator({
  onBack,
  onNext,
  currentIndex,
  totalQuestions,
}) {
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={onBack}
        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 disabled:opacity-50"
        disabled={currentIndex <= 0}
      >
        Back
      </button>
      <button
        onClick={onNext}
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        disabled={currentIndex >= totalQuestions - 1}
      >
        Next
      </button>
    </div>
  );
}
