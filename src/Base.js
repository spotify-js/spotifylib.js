class Base {
  /**
   * Base for structures.
   * @param {object} data - The structure data.
   * @private
   */
  constructor(data) {
    Object.assign(this, data);
  }
}

module.exports = Base;
