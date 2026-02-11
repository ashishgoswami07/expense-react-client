import axios from "axios";
import { useState } from "react";
import { serverEndpoint } from "../config/appConfig";

function CreateGroupModal({ show, onHide }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
      isValid = false;
    }

    if (formData.description.trim().length < 3) {
      newErrors.description = "Description must be at least 3 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await axios.post(
        `${serverEndpoint}/groups/create`,
        {
          name: formData.name,
          description: formData.description,
        },
        { withCredentials: true }
      );

      // notify parent & close modal
      onHide(true);

      // optional: reset form
      setFormData({ name: "", description: "" });
      setErrors({});
    } catch (error) {
      console.log(error);
      setErrors({
        message: "Unable to add group, please try again",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow">
          <form onSubmit={handleSubmit}>
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Create Group</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
              />
            </div>

            <div className="modal-body">
              {errors.message && (
                <div className="alert alert-danger small">
                  {errors.message}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Group Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  className={
                    errors.name
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                />
                {errors.name && (
                  <div className="invalid-feedback">
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  className={
                    errors.description
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                />
                {errors.description && (
                  <div className="invalid-feedback">
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={onHide}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupModal;
