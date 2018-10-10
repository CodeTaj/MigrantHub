const urlForIdValidation = corporationId => `https://cors-anywhere.herokuapp.com/https://www.ic.gc.ca/app/scr/cc/CorporationsCanada/api/corporations/${corporationId}.json?lang=eng`

class IdApi2 {
  static checkCorpId = async (id) => {
    const response = await fetch(urlForIdValidation(id));
    const json = await response.json();
    if (json[0] === "could not find corporation " + id) {
      return false;
    } else {
      return true;
    }
  }
}

export default IdApi2;