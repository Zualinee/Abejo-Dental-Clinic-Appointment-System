import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import PatientHeader from "../../layouts/patientheader";
import PatientSidemenu from "../../layouts/patientsidemenu";

interface BookingItem {
  procedure_id: number;
  procedure_name: string;
  date: string;
  time: string;
}

const PatientAppointment = () => {
  const [formData, setFormData] = useState({
    procedure_id: 0,
    date: "",
    time: "",
  });

  const [bookingsReview, setBookingsReview] = useState<BookingItem[]>([]);

  const [appointmentsCountByDate, setAppointmentsCountByDate] = useState<Record<string, number>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const procedureOptions = [
    { id: 1, name: "Oral Prophylaxis", price: 500 },
    { id: 2, name: "Restoration", price: 1500 },
    { id: 3, name: "Dentures", price: 7000 },
    { id: 4, name: "Root Canal Treatment", price: 5000 },
    { id: 5, name: "Extraction", price: 800 },
    { id: 6, name: "Jacket Crown/Fixed Bridge", price: 12000 },
    { id: 7, name: "Braces", price: 30000 },
    { id: 8, name: "Veneers", price: 10000 },
    { id: 9, name: "Whitening", price: 4000 },
    { id: 10, name: "Retainers", price: 3000 },
  ];

  // For demo, let's assume max 5 bookings per day:
  const MAX_BOOKINGS_PER_DAY = 5;

  // Fetch existing appointments count grouped by date to color calendar
  useEffect(() => {
    const fetchAppointmentsCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/appointments/countByDate");
        setAppointmentsCountByDate(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments count", error);
      }
    };
    fetchAppointmentsCount();
  }, []);

  const selectedProcedure = procedureOptions.find(
    (p) => p.id === formData.procedure_id
  );

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Prevent selecting weekend date
    if (name === "date") {
      const dateObj = new Date(value);
      const day = dateObj.getDay();
      if (day === 0 || day === 6) {
        Swal.fire("Warning", "Weekends are not available for booking.", "warning");
        return; // don't update date if weekend selected
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "procedure_id" ? parseInt(value) : value,
    }));
  };

  // Add current selection to review list, limit to 1 booking
  const handleAddToReview = () => {
    if (
      formData.procedure_id === 0 ||
      formData.date === "" ||
      formData.time === ""
    ) {
      Swal.fire("Warning", "Please fill all fields before adding.", "warning");
      return;
    }

    // Prevent adding previous dates
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      Swal.fire("Warning", "Cannot book previous dates.", "warning");
      return;
    }

    // Prevent weekend booking (extra safeguard)
    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      Swal.fire("Warning", "Weekends are not available for booking.", "warning");
      return;
    }

    // Check if slot is already in review list
    const slotExists = bookingsReview.some(
      (b) =>
        b.date === formData.date &&
        b.time === formData.time
    );
    if (slotExists) {
      Swal.fire("Warning", "This slot is already added in your review.", "warning");
      return;
    }

    // Limit to only 1 booking at a time
    if (bookingsReview.length >= 1) {
      Swal.fire("Info", "You can only book one appointment at a time.", "info");
      return;
    }

    const procName =
      procedureOptions.find((p) => p.id === formData.procedure_id)?.name || "";

    setBookingsReview([
      ...bookingsReview,
      {
        procedure_id: formData.procedure_id,
        procedure_name: procName,
        date: formData.date,
        time: formData.time,
      },
    ]);
  };

  // Remove booking from review list by index
  const handleRemoveReview = (index: number) => {
    setBookingsReview((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit all bookings in review list to backend
  const handleSubmit = async () => {
    if (bookingsReview.length === 0) {
      Swal.fire("Warning", "Please add at least one booking before submitting.", "warning");
      return;
    }

    const patientId = localStorage.getItem("patient_id");
    if (!patientId) {
      Swal.fire("Error", "Patient ID not found. Please log in again.", "error");
      return;
    }

    try {
      for (const booking of bookingsReview) {
        const response = await axios.post("http://localhost:8000/api/appointments", {
          procedure_id: booking.procedure_id,
          date: booking.date,
          time: booking.time,
          status: "Pending",
          patient_id: patientId,
        });

        if (response.status !== 200) {
          Swal.fire("Error", "Failed to book appointment.", "error");
          return;
        }
      }

      Swal.fire("Success", "Appointment booked successfully!", "success");
      setBookingsReview([]);
      setFormData({
        procedure_id: 0,
        date: "",
        time: "",
      });
      setIsModalOpen(false);
      // Refresh calendar count after booking
      const response = await axios.get("http://localhost:8000/api/appointments/countByDate");
      setAppointmentsCountByDate(response.data);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        Swal.fire("Error", error.response.data.message, "error");
      } else {
        Swal.fire("Error", "Server error while booking.", "error");
      }
    }
  };

  // Customize calendar day cell with color depending on booking count
  const dayCellClassNames = (arg: any) => {
    const dateStr = arg.dateStr;
    const count = appointmentsCountByDate[dateStr] || 0;

    const day = arg.date.getDay();
    // Disable weekends visually and for bookings
    if (day === 0 || day === 6) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed rounded"; // grayed out weekends
    }

    if (count >= MAX_BOOKINGS_PER_DAY) return "bg-red-400 text-white rounded";
    if (count >= MAX_BOOKINGS_PER_DAY * 0.7) return "bg-yellow-300 rounded";
    return "bg-green-200 rounded";
  };

  // Disable past days and weekends from calendar selection
  const disablePastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateStr);
    const isPast = date < today;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    return isPast || isWeekend;
  };

  return (
    <>
      <PatientHeader />
      <PatientSidemenu />

      <div className="p-6 bg-gray-50 min-h-screen">
        <div
          className="mx-auto justify-right items-right mt-10 col-span-12 relative shadow-lg bg-white p-6 rounded-md"
          style={{ maxWidth: "700px", maxHeight: "1500px", overflowY: "auto", color: "black" }}
        >
          {/* Calendar Section */}
          <section className="w-sm flex flex-col items-end justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-700 transition"
            >
              + Book Appointment
            </button>
          </section>

          <div className="grid grid-cols-1 max:grid-cols-2 gap-6">
            <section>
              <h3 className="text-xl text-center font-semibold mb-2">Appointment Calendar</h3>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="auto"
                dayCellClassNames={dayCellClassNames}
                validRange={{
                  start: new Date().toISOString().split("T")[0],
                }}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setIsModalOpen(false)}
  >
    <div
      className="bg-white rounded-lg w-md max-w-4xl flex p-6"
      onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
    >
      {/* Booking Form */}
      <div className="w-md pr-4 border-r">
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Procedure</label>
            <select
              name="procedure_id"
              value={formData.procedure_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value={0}>Select Dental Procedure</option>
              {procedureOptions.map((proc) => (
                <option key={proc.id} value={proc.id}>
                  {proc.name}
                </option>
              ))}
            </select>
            {selectedProcedure && (
              <div className="text-sm text-gray-600 italic mt-1">
                Price: ₱{selectedProcedure.price.toLocaleString()}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              min={new Date().toISOString().split("T")[0]} // no past dates
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Time</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Time</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddToReview}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            Add to Review
          </button>
        </form>
      </div>
            &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
      {/* Review Booking */}
      <div className="w-1/2 pl-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Review Booking</h2>
          <button
            onClick={() => setBookingsReview([])}
            className="text-red-600 hover:underline"
            title="Clear All"
          >
            Clear All
          </button>
        </div>
        {bookingsReview.length === 0 ? (
          <p>No bookings added yet.</p>
        ) : (
          <ul className="space-y-2 flex-1 overflow-auto max-h-96 border rounded p-2">
            {bookingsReview.map((b, idx) => (
              <li
                key={idx}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>{b.procedure_name}</strong>
                  </p>
                  <p>
                    Date: {b.date} | Time: {b.time}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveReview(idx)}
                  className="text-red-600 hover:underline"
                  title="Remove booking"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleSubmit}
          disabled={bookingsReview.length === 0}
          className={`mt-4 w-md p-2 rounded text-white ${
            bookingsReview.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          Confirm Booking
        </button>

        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-2 w-md p-2 rounded border border-gray-400 hover:bg-gray-100 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

</>
);
};      
export default PatientAppointment;


