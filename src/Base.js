class Base {
  /**
   * Base for structures - assigns item data to the class.
   * @param {object} data - The structure data.
   */
  constructor(data) {
    Object.assign(this, data);
  }
}

module.exports = Base;
