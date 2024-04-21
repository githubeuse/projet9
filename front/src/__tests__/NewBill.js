/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

import store from "../__mocks__/store.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
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

      window.onNavigate(ROUTES_PATH.NewBill);

      // récupération de l'icône
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");

      //vérification si l'icône contient la classe active-icon
      const iconActivated = mailIcon.classList.contains("active-icon");
      expect(iconActivated).toBeTruthy();
    });
    describe("When I click on the choisir un fichier button and upload a right type file", () => {
      test("Then handleChangeFile displays the right file's name", () => {
        //page NewBill
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
});
