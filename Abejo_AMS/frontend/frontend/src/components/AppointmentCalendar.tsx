import React from "react";

interface AppointmentCalendarProps {
  appointmentsCountByDate: { [date: string]: number };
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ appointmentsCountByDate }) => {
  const today = new Date();

  // helper: check if date is weekend
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Generate dates for the current month
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const calendarDates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    calendarDates.push(date);
  }

  return (
    <div className="calendar mt-4">
      <h5>{today.toLocaleString("default", { month: "long" })} Calendar</h5>
      <div className="d-flex flex-wrap">
        {calendarDates.map((date) => {
          const dateKey = date.toLocaleDateString("en-GB");
          const count = appointmentsCountByDate[dateKey] || 0;

          let bgColor = "bg-light";
          if (isWeekend(date)) bgColor = "bg-secondary text-white";
          else if (count >= 3) bgColor = "bg-danger text-white"; // fully booked

          return (
            <div
              key={dateKey}
              className={`m-1 p-2 text-center border rounded ${bgColor}`}
              style={{ width: "60px" }}
            >
              <div>{date.getDate()}</div>
              <small>{count} bookings</small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
