/** 
 *@jest-environment jsdom 
*/

import React from 'react'
import { render, fireEvent, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import CreateOrderForm from "../src/components/components/create-order-form"
import OrderSide from "../src/interfaces/order/order-side"
import '@testing-library/jest-dom'


jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: jest.fn(),
}));

describe("CreateOrderForm", () => {
  const mockHandleSubmit = jest.fn((data) => data);
  const mockRegister = jest.fn();

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
    });
  });

  test("Should render correctly", () => {
    const mockProps = {
      buyOrders: [],
      sellOrders: [],
      fulfilledOrders: [],
      setBuyOrders: jest.fn(),
      setSellOrders: jest.fn(),
      setFulfilledOrders: jest.fn(),
    };

    render(<CreateOrderForm {...mockProps} />);
    expect(screen.getByLabelText("Price:")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity:")).toBeInTheDocument();
    expect(screen.getByLabelText("Side:")).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();

  });

  test("Should call handleSubmit on form submission", () => {
    const mockProps = {
      buyOrders: [],
      sellOrders: [],
      fulfilledOrders: [],
      setBuyOrders: jest.fn(),
      setSellOrders: jest.fn(),
      setFulfilledOrders: jest.fn(),
    };
    render(<CreateOrderForm {...mockProps} />);
    fireEvent.submit(screen.getByText("Submit"));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
