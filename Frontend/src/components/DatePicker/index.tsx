// DarkDatePicker.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Ensure correct import
import 'react-datepicker/dist/react-datepicker.css';
import './style.css'; // Custom CSS file to override styles

type DatePickerType = {
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
}

const CustomDatePicker: React.FC<DatePickerType> = (props) => {
  const {selectedDate, handleDateChange} = props;

  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
        placeholderText="Select a date"
        className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
        calendarClassName="bg-gray-900 border border-gray-700 text-white"
        dayClassName={() =>
          'text-white hover:bg-gray-700 focus:bg-blue-500 focus:text-white'
        }
        todayButton="Today"
      />
    </div>
  );
};

export default CustomDatePicker;
