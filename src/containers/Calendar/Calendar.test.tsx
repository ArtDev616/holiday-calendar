import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import Calendar from "./Calendar";
import { Holiday } from "../../types/Holiday";

jest.mock("axios");

describe("Calendar Component", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("fetches holidays and displays them in the table", async () => {
    const mockHolidays: Holiday[] = [
      {
        uuid: "1",
        country: "GB",
        date: "07/12/2023",
        name: "Battle of the Boyne",
        observed: "",
        public: "",
      },
      {
        uuid: "2",
        country: "GB",
        date: "12/25/2023",
        name: "Christmas Day",
        observed: "",
        public: "",
      },
    ];

    (axios.get as jest.Mock).mockImplementation(() =>
      Promise.resolve({ data: mockHolidays })
    );

    render(<Calendar defaultCountryCode="GB" />);

    await waitFor(() => {
      const holiday1 = screen.getByText("Battle of the Boyne");

      expect(holiday1).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("https://holidays.abstractapi.com")
    );
  });

  test("displays 'No holidays found.' message when no holidays are available", async () => {
    const mockHolidays: Holiday[] = [];

    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: mockHolidays }));

    render(<Calendar defaultCountryCode="GB" />);

    await waitFor(() => {
      const emptyMessage = screen.getByText("No holidays found.");

      expect(emptyMessage).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("https://holidays.abstractapi.com")
    );
  });

  test("displays error message when API request fails", async () => {
    (axios.get as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error("API request failed"))
    );

    render(<Calendar defaultCountryCode="GB" />);

    await waitFor(() => {
      const errorMessage = screen.getByText("Error fetching holidays");

      expect(errorMessage).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("https://holidays.abstractapi.com")
    );
  });
});
