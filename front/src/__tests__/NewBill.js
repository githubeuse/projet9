/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import userEvent from '@testing-library/user-event';
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import store from "../__mocks__/store.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, and I click on the choisir un fichier button and upload a right type file", () => {
      test("Then handleChangeFile displays the right file's name", () => {
        
        //page NewBill
        const html = NewBillUI();
        document.body.innerHTML = html;

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
  
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        // initialisation NewBill
        const newBill = new NewBill({ document, onNavigate, store, localStorage});
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        const input = screen.getByTestId("file");
        input.addEventListener("change", handleChangeFile);
        //fichier au bon format
        fireEvent.change(input, {
          target: {
            files: [
              new File(["image.png"], "image.png", {
                type: "image/png",
              }),
            ],
          },
        });
        expect(handleChangeFile).toHaveBeenCalled();
        expect(input.files[0].name).toBe("image.png");
      });
    });
    describe("When I click on the choisir un fichier button and upload a wrong type file", () => {
      test("Then, it should alert and reset input value if file type is invalid", () => {
        //mock de window.alert
        window.alert = jest.fn();

        const html = NewBillUI();
        document.body.innerHTML = html;
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        // initialisation NewBill
        const newBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        const input = screen.getByTestId("file");
        input.addEventListener("change", handleChangeFile);

        //fichier au mauvais format
        fireEvent.change(input, {
          target: {
            files: [
              new File(["image.gif"], "image.gif", {
                type: "image/gif", // Type non valide
              }),
            ],
          },
        });
        expect(window.alert).toHaveBeenCalledWith(
          "Le type de fichier est invalide. Merci de choisir le format JPG, JPEG ou PNG"
        );
        expect(input.value).toBe("");
      });
      test("Les factures apparaissent bien", () => {
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);
        document.body.innerHTML = NewBillUI();
        const inputData = {
          id: "47qAXb6fIm2zOKkLzMro",
          vat: "80",
          amount: "400",
          name: "encore",
          fileName: "preview-facture-free-201801-pdf-1.jpg",
          commentary: "séminaire billed",
          pct: "20",
          type: "Hôtel et logement",
          email: "employee@test.tld",
          fileUrl:
            "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
          date: "2004-04-04",
          status: "pending",
          commentAdmin: "ok",
        };

        const form = screen.getByTestId("form-new-bill");

        const inputSelectType = screen.getByTestId("expense-type"); //
        fireEvent.change(inputSelectType, {
          target: { value: inputData.type },
        });
        expect(inputSelectType.value).toBe(inputData.type);

        const inputDataName = screen.getByTestId("expense-name"); //
        fireEvent.change(inputDataName, { target: { value: inputData.name } });
        expect(inputDataName.value).toBe(inputData.name);

        const inputDate = screen.getByTestId("datepicker"); //
        fireEvent.change(inputDate, { target: { value: inputData.date } });
        expect(inputDate.value).toBe(inputData.date);

        const inputAmount = screen.getByTestId("amount"); //
        fireEvent.change(inputAmount, { target: { value: inputData.amount } });
        expect(inputAmount.value).toBe(inputData.amount);

        const inputVat = screen.getByTestId("vat");
        fireEvent.change(inputVat, { target: { value: inputData.vat } });
        expect(inputVat.value).toBe(inputData.vat); //

        const inputPct = screen.getByTestId("pct");
        fireEvent.change(inputPct, { target: { value: inputData.pct } });
        expect(inputPct.value).toBe(inputData.pct);

        const inputCommentary = screen.getByTestId("commentary");
        fireEvent.change(inputCommentary, {
          target: { value: inputData.commentary },
        });
        expect(inputCommentary.value).toBe(inputData.commentary);

        const onNavigate = () => {
          document.body.innerHTML = ROUTES_PATH["Bills"];
        };
        const store = jest.fn();
        const newBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });
        const handleSubmit = jest.fn((e) => e.preventDefault());
        newBill.updateBill = jest.fn().mockResolvedValue({});
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
      });
    });
  });
// });
// test POST
describe("Given I am a user connected as Employee", () => {
  describe("When I add a new bill", () => {
    test("Then it creates a new bill", async () => {
      //page NewBill
      document.body.innerHTML = NewBillUI();

      // facture factice
      const inputData = {
        type: "Transports",
        name: "Facticename",
        datepicker: "2000-01-01",
        amount: "99",
        vat: "99",
        pct: "99",
        commentary: "Facticecomment",
        file: new File(["factice"], "factice.png", { type: "image/png" }),
      };
      
      const formNewBill = screen.getByTestId("form-new-bill");

      const inputSelectType = screen.getByTestId("expense-type");//
      fireEvent.change( inputSelectType, { target: { value: inputData.type }});
      expect(inputSelectType.value).toBe(inputData.type);//

      const inputDataName = screen.getByTestId("expense-name");//
      fireEvent.change(inputDataName, { target: { value: inputData.name }});
      expect(inputDataName.value).toBe(inputData.name);//

      const inputDate = screen.getByTestId("datepicker");//
      fireEvent.change(inputDate, { target: { value: inputData.datepicker }});
      expect(inputDate.value).toBe(inputData.datepicker);//

      const inputAmount = screen.getByTestId("amount");//
      fireEvent.change(inputAmount, {target: { value: inputData.amount }});
      expect(inputAmount.value).toBe(inputData.amount);

      const inputVat = screen.getByTestId("vat");
      fireEvent.change(inputVat, {target: { value: inputData.vat }});
      expect(inputVat.value).toBe(inputData.vat);//

      const inputPct = screen.getByTestId("pct");
      fireEvent.change(inputPct, {target: { value: inputData.pct }});
      expect(inputPct.value).toBe(inputData.pct);

      const inputCommentary = screen.getByTestId("commentary");
      fireEvent.change(inputCommentary, {target: { value: inputData.commentary }});
      expect(inputCommentary.value).toBe(inputData.commentary);

      const inputFile = screen.getByTestId("file");
      userEvent.upload(inputFile, inputData.file);
      await waitFor(() => {
        expect(inputFile.files[0]).toStrictEqual(inputData.file);
        expect(inputFile.files).toHaveLength(1);
      });

      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() =>
            JSON.stringify({
              email: "factice@factice.com",
            })
          ),
        },
        // writable: true,
      });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn(newBill.handleSubmit);
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });
    test("Then it fails with a 404 message error", async () => {
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("Then it fails with a 500 message error", async () => {
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});