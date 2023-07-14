/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import store from "../app/Store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    let html;
    let newBill;
    let onNavigate;

    beforeEach(() => {
      html = NewBillUI();
      document.body.innerHTML = html;

      onNavigate = jest.fn();
      newBill = new NewBill({ document: document, onNavigate, store });
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    describe("When running unit tests", () => {
      test("Then 'envoyer une note de frais' text should be present on the page", () => {
        const text = screen.getByText(/envoyer une note de frais/i);
        expect(text).toBeTruthy();
      });

      test("Then handleChangeFile should return an alert for incorrect file format", () => {
        const event = {
          preventDefault: jest.fn(),
          target: { value: "fakePath\\fakeFile.txt" },
        };
        window.alert = jest.fn();

        newBill.handleChangeFile(event);

        expect(window.alert).toHaveBeenCalledWith(
          "Seules les images au format jpg, jpeg ou png sont autorisées."
        );
      });
    });

    describe("When running integration tests", () => {
      test("Then it should successfully POST a new bill", async () => {
        document.body.innerHTML = html;

        const createMock = jest.fn().mockResolvedValue({
          fileUrl: "mockFileUrl",
          key: "mockKey",
        });
        const updateMock = jest.fn().mockResolvedValue({});
        const storeMock = {
          bills: jest.fn(() => ({
            create: createMock,
            update: updateMock,
          })),
        };

        const localStorageMock = {
          getItem: jest.fn((key) => {
            if (key === "user") {
              return JSON.stringify({
                type: "employee",
                email: "employee@test.tld",
              });
            }
            return null;
          }),
          setItem: jest.fn(),
        };

        newBill = new NewBill({
          document: document,
          onNavigate,
          store: storeMock,
          localStorage: localStorageMock,
        });

        // Remplir les champs du formulaire
        const expenseTypeInput = screen.getByTestId("expense-type");
        const expenseNameInput = screen.getByTestId("expense-name");
        const amountInput = screen.getByTestId("amount");
        const datepickerInput = screen.getByTestId("datepicker");
        const vatInput = screen.getByTestId("vat");
        const pctInput = screen.getByTestId("pct");
        const commentaryInput = screen.getByTestId("commentary");

        userEvent.selectOptions(expenseTypeInput, "Restaurants et bars");
        userEvent.type(expenseNameInput, "Mock Expense");
        userEvent.type(amountInput, "100");
        userEvent.type(datepickerInput, "2023-06-01");
        userEvent.type(vatInput, "20");
        userEvent.type(pctInput, "10");
        userEvent.type(commentaryInput, "Mock Commentary");

        const fileInput = screen.getByTestId("file");
        const file = new File(["mock file content"], "mockFile.jpg", {
          type: "image/jpeg",
        });
        userEvent.upload(fileInput, file);

        newBill.handleChangeFile({
          preventDefault: jest.fn(),
          target: { files: [file], value: file.name },
        });

        // Soumettre le formulaire
        const submitButton = screen.getByTestId("submit");
        userEvent.click(submitButton);

        // Vérifier que la méthode create a été appelée avec les données du formulaire
        expect(storeMock.bills().create).toHaveBeenCalledWith({
          data: expect.any(FormData),
          headers: {
            noContentType: true,
          },
        });

        // Vérifier que la méthode onNavigate a été appelée avec la route 'Bills'
        await waitFor(() => {
          expect(onNavigate).toHaveBeenCalledWith(
            expect.stringContaining("bills")
          );
        });
      });

      describe("When there is an error on the API", () => {
        test("Then handleSubmit should fail with 404 error", async () => {
          const mockError = new Error("Not found");
          mockError.status = 404;

          const updateMock = jest.fn().mockRejectedValue(mockError);
          const storeMock = {
            bills: jest.fn(() => ({ update: updateMock })),
          };
          const localStorageMock = {
            getItem: jest.fn(() =>
              JSON.stringify({ type: "Employee", email: "employee@test.tld" })
            ),
            setItem: jest.fn(),
          };

          newBill = new NewBill({
            document: document,
            onNavigate,
            store: storeMock,
            localStorage: localStorageMock,
          });

          newBill.fileUrl = "http://example.com/image.jpg";
          newBill.fileName = "image.jpg";

          const form = document.createElement("form");
          form.innerHTML = `
            <select data-testid="expense-type"></select>
            <input data-testid="expense-name">
            <input data-testid="amount">
            <input data-testid="datepicker">
            <input data-testid="vat">
            <input data-testid="pct">
            <textarea data-testid="commentary"></textarea>
          `;

          const event = {
            preventDefault: jest.fn(),
            target: form,
          };

          try {
            await newBill.handleSubmit(event);
          } catch (error) {
            expect(error).toEqual(mockError);
            expect(error.status).toEqual(404);
          }

          expect(updateMock).toHaveBeenCalled();
        });

        test("Then handleSubmit should fail with 500 error", async () => {
          const mockError = new Error("Internal server error");
          mockError.status = 500;
          const createMock = jest.fn().mockRejectedValue(mockError);
          const storeMock = {
            bills: jest.fn(() => ({ create: createMock })),
          };
          const localStorageMock = {
            getItem: jest.fn(() =>
              JSON.stringify({ type: "Employee", email: "employee@test.tld" })
            ),
            setItem: jest.fn(),
          };

          newBill = new NewBill({
            document: document,
            onNavigate,
            store: storeMock,
            localStorage: localStorageMock,
          });

          const fileInput = screen.getByTestId("file");
          const file = new File(["mock file content"], "mockFile.jpg", {
            type: "image/jpeg",
          });
          userEvent.upload(fileInput, file);

          try {
            await newBill.handleChangeFile({
              preventDefault: jest.fn(),
              target: { files: [file], value: file.name },
            });
          } catch (error) {
            expect(error).toEqual(mockError);
            expect(error.status).toEqual(500);
          }

          expect(createMock).toHaveBeenCalled();
        });
      });
    });
  });
});
