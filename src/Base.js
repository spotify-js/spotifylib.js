class Base {
  /**
   * Base for structures.
   * @type {object} data - The structure data.
   */
  constructor(data) {
    Object.assign(this, data);
  }
}

module.exports = Base;
