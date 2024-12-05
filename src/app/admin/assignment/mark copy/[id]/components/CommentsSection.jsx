import React, { useState } from 'react';
import { useAddCommentToResultMutation } from '@/lib/features/assignment/assignmentsResultsApiSlice';
import Card from '@/components/card/index';

const CommentsSection = ({ id, submittedComments, setSubmittedComments }) => {
  const [comments, setComments] = useState('');
  const [addComment] = useAddCommentToResultMutation();

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleCommentsSubmit = async () => {
    if (comments.trim()) {
      try {
        await addComment({ id, comment: comments }).unwrap();
        setSubmittedComments([...submittedComments, comments]);
        setComments('');
      } catch (err) {
        console.error('Failed to submit comment: ', err);
      }
    }
  };

  return (
    <Card className="mt-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <textarea
        value={comments}
        onChange={handleCommentsChange}
        placeholder="Add your comments here..."
        className="w-full border rounded-md p-2 mb-4"
        rows="4"
      />
      <button
        onClick={handleCommentsSubmit}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit Comment
      </button>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Submitted Comments:</h3>
        {submittedComments.length > 0 ? (
          <ul>
            {submittedComments.map((comment, index) => (
              <li key={index} className="border-b py-2">{comment}</li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </Card>
  );
};

export default CommentsSection;
