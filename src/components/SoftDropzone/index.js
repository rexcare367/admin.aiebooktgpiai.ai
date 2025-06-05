/**
=========================================================
* AI EBOOK DASHBOARD React - v4.0.3
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Dropzone components
import Dropzone from "dropzone";

// Dropzone styles
import "dropzone/dist/dropzone.css";

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";

// Custom styles for the SoftDropzone
import SoftDropzoneRoot from "components/SoftDropzone/SoftDropzoneRoot";

function SoftDropzone({ options, setFileUrl, setIsUploading, setFileKey }) {
  const dropzoneRef = useRef();

  useEffect(() => {
    Dropzone.autoDiscover = false;

    function createDropzone() {
      return new Dropzone(dropzoneRef.current, { 
        ...options,
        init: function() {
          this.on("sending", function() {
            // Handle the loading state here
            console.log("File is being uploaded...");
            setIsUploading(true)
          });
          this.on("success", function(file, response) {
            // Handle the response from the server here
            console.log("File uploaded successfully:", response);
            setFileUrl(response.file_url);
            setFileKey(response.file_key);
            setIsUploading(false);
          });
          this.on("error", function() {
            // Handle the loading state here
            console.error("An error occurred during file upload.");
            setIsUploading(false);
          });
        }
       });
    }

    function removeDropzone() {
      if (Dropzone.instances.length > 0) Dropzone.instances.forEach((dz) => dz.destroy());
    }

    createDropzone();

    return () => removeDropzone();
  }, [options]);

  return (
    <SoftDropzoneRoot
      component="form"
      action={`${process.env.REACT_APP_API_URL}ebooks/upload-book`}
      ref={dropzoneRef}
      className="form-control dropzone"
    >
      <SoftBox className="fallback">
        <SoftBox component="input" name="file" type="file" />
      </SoftBox>
    </SoftDropzoneRoot>
  );
}

// Typechecking props for the SoftDropzone
SoftDropzone.propTypes = {
  options: PropTypes.objectOf(PropTypes.any).isRequired,
  setFileUrl: PropTypes.func,
  setFileKey: PropTypes.func,
  setIsUploading: PropTypes.func
};

export default SoftDropzone;
