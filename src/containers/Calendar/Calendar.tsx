import React, { useEffect, useState } from "react";
import axios from "axios";
import { countryData } from "../../utils/countryData";
import "./Calendar.css";

interface Holiday {
  country: string;
  date: string;
  date_day: string;
  date_month: string;
  date_year: string;
  description: string;
  language: string;
  location: string;
  name: string;
  name_local: string;
  type: string;
  week_day: string;
}

interface CalendarProps {
  defaultCountryCode?: string;
}

interface APIError extends Error {
  message: string;
}

const Calendar: React.FC<CalendarProps> = ({ defaultCountryCode }) => {
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [error, setError] = useState<APIError | string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      // Only make the API request if there are no validation errors
      if (!error) {
        setLoading(true); // Set loading to true when the request starts
        const apiUrl = `https://holidays.abstractapi.com/v1/?api_key=${process.env.REACT_APP_CALAPI_KEY}&country=${countryCode}&year=${year}&month=${month}`;

        try {
          const response = await axios.get<Holiday[]>(apiUrl);
          setHolidays(response.data);
          setError("");
        } catch (error) {
          console.error("Error fetching holidays:", error);
          setError(new Error("Error fetching holidays"));
        }

        setLoading(false); // Set loading to false when the request completes
      }
    };

    fetchHolidays();
  }, [countryCode, year, month, error]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputYear = Number(e.target.value);

    setYear(inputYear);
    // Check if the input year is a valid number and within a reasonable range
    if (isNaN(inputYear) || inputYear < 1900 || inputYear > 2100) {
      setError("Invalid year");
    } else {
      setError("");
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputMonth = Number(e.target.value);

    setMonth(inputMonth);
    // Check if the input month is a valid number and within the range of 1 to 12
    if (isNaN(inputMonth) || inputMonth < 1 || inputMonth > 12) {
      setError("Invalid month");
    } else {
      setError("");
    }
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <h1>Public Holidays Calendar</h1>
        <div className="input-groups">
          <div className="input-container">
            <label htmlFor="countrySelect" className="label">
              Country:
            </label>
            <select
              className="custom-select"
              value={countryCode}
              id="countrySelect"
              onChange={handleCountryChange}
            >
              <option value="">Select a country</option>
              {countryData.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label className="label" htmlFor="yearInput">
              Year:
            </label>
            <input
              className="custom-input"
              type="number"
              id="yearInput"
              value={Number(year).toString()}
              onChange={handleYearChange}
            />
          </div>
          <div className="input-container">
            <label className="label" htmlFor="monthInput">
              Month:
            </label>
            <input
              className="custom-input"
              type="number"
              id="monthInput"
              value={Number(month).toString()}
              onChange={handleMonthChange}
            />
          </div>
        </div>
      </div>
      <div className="table-container">
        {loading ? (
          <p className="loading-message">Loading...</p>
        ) : error ? (
          <p className="error-message">
            {typeof error === "string" ? error : error.message}
          </p>
        ) : holidays.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr key={holiday.date + holiday.name}>
                  <td>{holiday.date}</td>
                  <td>{holiday.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-table-message">No holidays found.</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
