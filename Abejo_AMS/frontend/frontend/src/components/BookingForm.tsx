import React from "react";

interface BookingFormProps {
  formData: {
    patientName: string;
    patientID: string;
    procedure: string;
    date: string;
    time: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    patientName: string;
    patientID: string;
    procedure: string;
    date: string;
    time: string;
  }>>;
  onAddToReview: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ formData, setFormData, onAddToReview }) => {
  const procedures = [
    "Cleaning",
    "Filling",
    "Extraction",
    "Root Canal Treatment",
    "Scaling and Polishing",
    "Dental Crown",
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    const day = selectedDate.getDay();

    if (day === 0 || day === 6) {
      alert("Weekend appointment is not allowed!");
      setFormData({ ...formData, date: "" });
      return;
    }
    if (selectedDate < today) {
      alert("Date must not be in the past!");
      setFormData({ ...formData, date: "" });
      return;
    }
    setFormData({ ...formData, date: e.target.value });
  };

  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">Booking Appointment</h5>
      </div>
      <div className="modal-body">
        <div className="form-group mb-2">
          <label>Patient Name</label>
          <input
            type="text"
            value={formData.patientName}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group mb-2">
          <label>Patient ID</label>
          <input
            type="text"
            value={formData.patientID}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group mb-2">
          <label>Procedure</label>
          <select
            value={formData.procedure}
            onChange={(e) =>
              setFormData({ ...formData, procedure: e.target.value })
            }
            className="form-control"
          >
            <option value="">Select Procedure</option>
            {procedures.map((proc) => (
              <option key={proc} value={proc}>
                {proc}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mb-2">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>
        <div className="form-group mb-2">
          <label>Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            className="form-control"
          />
        </div>
        <button className="btn btn-success" onClick={onAddToReview}>
          Add to Review
        </button>
      </div>
    </>
  );
};

export default BookingForm;
