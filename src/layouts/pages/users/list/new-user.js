// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";

// Define the NewUser component
const NewUser = ({ fetchUsers }) => {
  const methods = useForm();
  const { handleSubmit, reset } = methods;
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error message

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}users/user/add`, {
        icNumber: data.icNumber,
      });
      reset(); // Reset the form after submission
      setError(null); // Clear error message
      setLoading(false); // Stop loading
      fetchUsers();
      // Optionally, redirect or show a success message
    } catch (error) {
      setError(error.message); // Set error message
      setLoading(false); // Stop loading
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <SoftBox>
          <SoftBox mb={2} display="flex" gap="2rem">
            <SoftInput
              name="icNumber"
              placeholder="IC Number"
              {...methods.register("icNumber", { required: true })}
            />
            <SoftButton variant="gradient" color="info" type="submit" loading={loading}>
              {loading ? (
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Add"
              )}
            </SoftButton>
          </SoftBox>
          {error && (
            <SoftTypography color="error" variant="body2" mb={2}>
              {error}
            </SoftTypography>
          )}
        </SoftBox>
      </form>
    </FormProvider>
  );
};

NewUser.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
};

export default NewUser;
