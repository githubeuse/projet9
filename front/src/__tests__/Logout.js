/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import Logout from "../containers/Logout.js"
import '@testing-library/jest-dom/extend-expect'
import { localStorageMock } from "../__mocks__/localStorage.js"
import DashboardUI from "../views/DashboardUI.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"

const bills = [{
  "id": "47qAXb6fIm2zOKkLzMro",
  "vat": "80",
  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  "status": "pending",
  "type": "Hôtel et logement",
  "commentary": "séminaire billed",
  "name": "encore",
  "fileName": "preview-facture-free-201801-pdf-1.jpg",
  "date": "2004-04-04",
  "amount": 400,
  "commentAdmin": "ok",
  "email": "a@a",
  "pct": 20,
}]

describe('Given I am connected', () => {
  describe('When I click on disconnect button', () => {
    test(('Then, I should be sent to login page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      } // mise en place du chemin de la page
      Object.defineProperty(window, 'localStorage', { value: localStorageMock }); // définition du local storage mocké
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      })) // mise en place d'un utilisateur de type admin
      document.body.innerHTML = DashboardUI({ bills }) // mise en place de l'interface utilisateur
      const logout = new Logout({ document, onNavigate, localStorage }) // nouvelle instance de Logout => logout
      // const handleClick = jest.fn(logout.handleClick) // mock de la méthode handleClick
      logout.handleClick = jest.fn();

      const disco = screen.getByTestId('layout-disconnect') // récupération de l'élément du bouton de déconnexion
      disco.addEventListener('click', logout.handleClick) // ajout d'un event listener sur le bouton de déconnexion
      disco.click()// simulation d'un clic
      expect(logout.handleClick).toHaveBeenCalled()
      expect(screen.getByText('Administration')).toBeTruthy()
    })
  })
})
