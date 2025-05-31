import React from "react";

type Booking = {
  procedure: string;
  date: string;
  time: string;
};

type BookingReviewProps = {
  bookingsReview: Booking[];
  onRemove: (index: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const BookingReview: React.FC<BookingReviewProps> = ({ bookingsReview, onRemove, onConfirm, onCancel }) => {
  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">Review Booking</h5>
      </div>
      <div className="modal-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Procedure</th>
              <th>Date</th>
              <th>Time</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {bookingsReview.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No bookings to review.
                </td>
              </tr>
            ) : (
              bookingsReview.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.procedure}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onRemove(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={bookingsReview.length === 0}
          >
            Confirm Booking
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingReview;
